import type {
  BuildSlots,
  Case,
  Cooler,
  CPU,
  Device,
  DeviceType,
  GPU,
  HBA,
  Motherboard,
  NIC,
  PSU,
  RAM,
  Storage,
  UsageProfile,
} from '../types'
import { getOfCategory, type Catalog } from './catalog'
import { checkResolved, isTriMode, RDIMM_SOCKETS } from './compatibility'
import { recommendedPsuW, totalPrice, type ResolvedBuild } from './resolve'
import { scoreDevice, scoreResolved } from './scoring'

export type AssembledType = 'desktop' | 'server' | 'nas'

export interface GeneratorPreferences {
  cpuBrand?: 'any' | 'AMD' | 'Intel'
  gpuBrand?: 'any' | 'NVIDIA' | 'AMD' | 'Intel'
  /** Format recherché : tour standard, compact (mATX/ITX) ou rack. */
  size?: 'any' | 'compact' | 'itx' | 'tower' | 'rack'
  /** Nombre de GPU (serveurs IA / stations multi-GPU). */
  gpuCount?: number
  minRamGB?: number
  /** Capacité brute minimale en To (NAS / stockage). */
  minStorageTB?: number
  wifi?: boolean
  /** Forcer la mémoire ECC. */
  ecc?: boolean
}

export interface GeneratorInput {
  deviceType: AssembledType
  profile: UsageProfile
  budget: number
  prefs?: GeneratorPreferences
}

export interface GeneratedBuild {
  slots: BuildSlots
  resolved: ResolvedBuild
  total: number
  score: number
}

const byPrice = <T extends { price: number }>(a: T, b: T) => a.price - b.price

/** Choisit le meilleur élément (le plus cher, donc le plus haut de gamme) dans l'enveloppe, sinon le moins cher. */
function pickWithin<T extends { price: number }>(cands: T[], share: number): T | undefined {
  if (!cands.length) return undefined
  // Les pools sont triés par prix croissant une fois pour toutes (voir pools()) : pas de tri ici.
  let best: T | undefined
  for (const c of cands) {
    if (c.price > share) break
    best = c
  }
  return best ?? cands[0]
}

/** Répartition du budget restant (hors CPU/GPU) par usage. */
const PLATFORM_WEIGHTS: Record<'default' | 'ai' | 'storage' | 'server', Record<'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooler', number>> = {
  default: { motherboard: 0.24, ram: 0.2, storage: 0.2, psu: 0.15, case: 0.13, cooler: 0.08 },
  ai: { motherboard: 0.22, ram: 0.3, storage: 0.2, psu: 0.15, case: 0.08, cooler: 0.05 },
  storage: { motherboard: 0.1, ram: 0.06, storage: 0.68, psu: 0.06, case: 0.08, cooler: 0.02 },
  server: { motherboard: 0.25, ram: 0.35, storage: 0.18, psu: 0.1, case: 0.1, cooler: 0.02 },
}

/** Part idéale du budget consacrée à la plateforme (pour favoriser les configs équilibrées). */
const PLATFORM_RATIO: Partial<Record<UsageProfile, number>> = { gaming: 0.35, ai: 0.3, office: 0.55, dev: 0.45, storage: 0.7 }

function targetRamGB(input: GeneratorInput, vram: number, cpu: CPU): number {
  const { profile, budget, deviceType } = input
  let t: number
  switch (profile) {
    case 'gaming': t = budget < 900 ? 16 : budget > 4500 ? 64 : 32; break
    case 'ai': t = Math.max(32, vram * 2); break
    case 'workstation': t = budget < 2500 ? 32 : budget < 6000 ? 64 : 128; break
    case 'streaming': case 'dev': t = budget > 2500 ? 64 : 32; break
    case 'office': case 'media': t = 16; break
    case 'homelab': t = budget < 1500 ? 32 : 64; break
    case 'virtualization': t = budget < 3000 ? 64 : budget < 8000 ? 128 : budget < 20000 ? 256 : 512; break
    case 'storage': t = budget > 3000 ? 32 : 16; break
    default: t = 16
  }
  if (deviceType === 'server' && RDIMM_SOCKETS.has(cpu.socket)) t = Math.max(t, 64)
  if (input.prefs?.minRamGB) t = Math.max(t, input.prefs.minRamGB)
  return t
}

function targetStorageGB(input: GeneratorInput): number {
  const { profile, budget } = input
  switch (profile) {
    case 'office': return budget < 700 ? 500 : 1000
    case 'gaming': return budget < 1000 ? 1000 : budget < 3500 ? 2000 : 4000
    case 'ai': case 'workstation': return budget < 3000 ? 2000 : 4000
    case 'media': return 2000
    default: return 1000
  }
}

function sizeAllows(ff: Motherboard['formFactor'], size: GeneratorPreferences['size']): boolean {
  switch (size) {
    case 'compact': return ff === 'mATX' || ff === 'ITX'
    case 'itx': return ff === 'ITX'
    case 'tower': return !ff.startsWith('Rack')
    default: return true
  }
}

interface Pools {
  boardsBySocket: Map<string, Motherboard[]>
  cpus: CPU[]
  gpus: GPU[]
  boards: Motherboard[]
  rams: RAM[]
  storages: Storage[]
  psus: PSU[]
  cases: Case[]
  coolers: Cooler[]
  nics: NIC[]
  hbas: HBA[]
}

/** Garde, pour chaque clé, l'élément le moins cher (réduit fortement l'espace de recherche du générateur). */
function cheapestPer<T extends { price: number }>(items: T[], key: (t: T) => string): T[] {
  const best = new Map<string, T>()
  for (const it of items) {
    const k = key(it)
    const cur = best.get(k)
    if (!cur || it.price < cur.price) best.set(k, it)
  }
  return [...best.values()]
}

/**
 * Front de Pareto : retire les éléments « dominés » (plus chers, et pas meilleurs sur aucun critère)
 * au sein d'un même groupe. Le générateur ne les choisirait jamais.
 */
function paretoFront<T extends { price: number }>(items: T[], group: (t: T) => string, crit: (t: T) => number[]): T[] {
  const groups = new Map<string, T[]>()
  for (const it of items) groups.set(group(it), [...(groups.get(group(it)) ?? []), it])
  const out: T[] = []
  for (const list of groups.values()) {
    const vals = list.map(crit)
    list.forEach((a, i) => {
      const dominated = list.some((b, j) => j !== i && b.price <= a.price && vals[j].every((v, k) => v >= vals[i][k]) && (b.price < a.price || vals[j].some((v, k) => v > vals[i][k])))
      if (!dominated) out.push(a)
    })
  }
  return out
}

const largest = <T extends { capacityGB: number }>(items: T[]): T | undefined =>
  items.reduce<T | undefined>((best, x) => (!best || x.capacityGB > best.capacityGB ? x : best), undefined)

function pools(catalog: Catalog, input: GeneratorInput): Pools {
  const { deviceType, profile, budget } = input
  const prefs = input.prefs ?? {}
  const cpuBrandOk = (c: CPU) => !prefs.cpuBrand || prefs.cpuBrand === 'any' || c.brand.toLowerCase() === prefs.cpuBrand.toLowerCase()
  const gpuBrandOk = (g: GPU) => {
    if (!prefs.gpuBrand || prefs.gpuBrand === 'any') return true
    const b = g.brand.toLowerCase()
    const chip = g.chipset.toLowerCase()
    if (prefs.gpuBrand === 'NVIDIA') return b === 'nvidia' || /rtx|gtx|geforce|quadro|^[ahl]\d/.test(chip)
    if (prefs.gpuBrand === 'AMD') return b === 'amd' || /radeon|instinct|rx /.test(chip)
    return b === 'intel' || chip.includes('arc')
  }

  let cpus = getOfCategory<CPU>(catalog, 'cpu').filter(cpuBrandOk)
  let gpus = getOfCategory<GPU>(catalog, 'gpu').filter(gpuBrandOk)
  let boards = getOfCategory<Motherboard>(catalog, 'motherboard')
  let cases = getOfCategory<Case>(catalog, 'case')

  const hedt = (profile === 'workstation' || profile === 'ai') && budget >= 5000
  if (deviceType === 'desktop') {
    cpus = cpus.filter((c) => c.segment !== 'server' && (hedt || c.segment !== 'workstation'))
    gpus = gpus.filter((g) => g.segment !== 'server' && (profile === 'ai' || profile === 'workstation' || g.segment !== 'workstation'))
    boards = boards.filter((m) => m.segment !== 'server' && (hedt || m.segment !== 'workstation'))
    cases = cases.filter((c) => c.type !== 'rack' && c.type !== 'nas')
  } else if (deviceType === 'server') {
    const serverOnly = budget >= 2500 || prefs.ecc
    if (serverOnly) boards = boards.filter((m) => m.segment === 'server' || m.segment === 'workstation' || m.eccSupport)
    if (profile !== 'ai' && profile !== 'workstation') gpus = gpus.filter((g) => g.tier === 'entry' || g.segment === 'server')
    cases = cases.filter((c) => c.type !== 'nas' && c.type !== 'mini')
    if (prefs.size === 'rack') cases = cases.filter((c) => c.type === 'rack')
  } else {
    // NAS : faible consommation, iGPU apprécié pour le transcodage.
    cpus = cpus.filter((c) => c.tdp <= 65 && c.segment !== 'workstation' && !RDIMM_SOCKETS.has(c.socket) && c.price <= Math.max(150, budget * 0.2))
    gpus = []
    boards = boards.filter((m) => !RDIMM_SOCKETS.has(m.socket))
    cases = cases.filter((c) => c.type === 'nas' || (prefs.size === 'rack' ? c.type === 'rack' : c.driveBays35 >= 4))
  }
  if (prefs.size && prefs.size !== 'any') {
    boards = boards.filter((m) => sizeAllows(m.formFactor, prefs.size))
    if (prefs.size === 'rack') cases = cases.filter((c) => c.type === 'rack')
    if (prefs.size === 'tower') cases = cases.filter((c) => c.type !== 'rack')
  }
  // Sans préférence de taille, on privilégie ATX / mATX (meilleur rapport prix/connectique).
  if (deviceType === 'desktop' && (!prefs.size || prefs.size === 'any')) boards = boards.filter((m) => m.formFactor !== 'ITX')
  if (prefs.wifi) boards = boards.filter((m) => m.wifi)
  let rams = getOfCategory<RAM>(catalog, 'ram')
  if (prefs.ecc || deviceType === 'nas' && budget > 1500) {
    const eccRams = rams.filter((r) => r.ecc)
    if (prefs.ecc) {
      rams = eccRams
      boards = boards.filter((m) => m.eccSupport || RDIMM_SOCKETS.has(m.socket))
    }
  }
  const sorted = <T extends { price: number }>(xs: T[]) => [...xs].sort(byPrice)
  boards = sorted(boards)
  rams = sorted(rams)
  cases = sorted(cases)
  const boardsBySocket = new Map<string, Motherboard[]>()
  for (const m of boards) boardsBySocket.set(m.socket, [...(boardsBySocket.get(m.socket) ?? []), m])
  return {
    boardsBySocket,
    cpus: paretoFront(cpus, (c) => `${c.socket}|${c.memoryTypes.join()}|${c.integratedGraphics}|${c.segment ?? ''}`, (c) => [c.singleThreadScore, c.multiThreadScore, -c.tdp, c.maxMemoryGB ?? 0, /x3d/i.test(c.model) ? 1 : 0]),
    // Les modèles partenaires d'une même puce ont les mêmes scores : on ne garde que le moins cher de chaque puce/VRAM.
    gpus: paretoFront(cheapestPer(gpus, (g) => `${g.chipset}|${g.vramGB}`), (g) => g.segment ?? '', (g) => [g.gamingScore, g.aiScore, g.vramGB, -g.tdp, -g.lengthMm]),
    boards,
    rams,
    storages: sorted(getOfCategory<Storage>(catalog, 'storage')),
    psus: sorted(getOfCategory<PSU>(catalog, 'psu')),
    cases,
    coolers: sorted(getOfCategory<Cooler>(catalog, 'cooler')),
    nics: sorted(getOfCategory<NIC>(catalog, 'nic')),
    hbas: sorted(getOfCategory<HBA>(catalog, 'hba')),
  }
}

function needsGpu(profile: UsageProfile): boolean {
  return profile === 'gaming' || profile === 'ai' || profile === 'streaming' || profile === 'workstation'
}

/** Construit la plateforme autour d'un couple CPU + GPU(s). */
function assemble(input: GeneratorInput, p: Pools, cpu: CPU, gpuList: GPU[]): GeneratedBuild | null {
  const { deviceType, profile, budget } = input
  const prefs = input.prefs ?? {}
  const core = cpu.price + gpuList.reduce((s, g) => s + g.price, 0)
  const rest = budget - core
  if (rest <= 0) return null
  const weights = PLATFORM_WEIGHTS[profile === 'ai' ? 'ai' : profile === 'storage' || deviceType === 'nas' ? 'storage' : deviceType === 'server' ? 'server' : 'default']

  // Carte mère
  const boards = (p.boardsBySocket.get(cpu.socket) ?? []).filter((m) => cpu.memoryTypes.includes(m.memoryType) && m.pcieX16Slots >= gpuList.length)
  const mb = pickWithin(deviceType === 'nas' ? boards.filter((m) => m.sataPorts >= 4) .concat(boards).slice(0, Math.max(1, boards.length)) : boards, rest * weights.motherboard)
  if (!mb) return null

  // Mémoire
  const vram = gpuList.reduce((s, g) => s + g.vramGB, 0)
  const ramTarget = Math.min(targetRamGB(input, vram, cpu), mb.maxMemoryGB, cpu.maxMemoryGB ?? Infinity)
  const needsRdimm = RDIMM_SOCKETS.has(mb.socket)
  const ramOk = p.rams.filter((r) => r.memoryType === mb.memoryType && r.registered === needsRdimm && r.modules <= mb.memorySlots)
  const ramPool = (deviceType !== 'desktop' || prefs.ecc) && mb.eccSupport && ramOk.some((r) => r.ecc) ? ramOk.filter((r) => r.ecc) : ramOk
  const ramFits = ramPool.filter((r) => r.capacityGB >= ramTarget)
  const ram = ramFits.length
    ? pickWithin(ramFits, Math.max(ramFits[0].price, rest * weights.ram * 0.6))
    : largest(ramPool)
  if (!ram) return null

  // Stockage
  const storage: Storage[] = []
  const nvmes = p.storages.filter((s) => s.kind === 'nvme' && s.segment !== 'server')
  let hddCount = 0
  if (deviceType === 'nas' || profile === 'storage') {
    const boot = nvmes.find((s) => s.capacityGB >= 500)
    if (boot) storage.push(boot)
    const hdds = p.storages.filter((s) => s.kind === 'hdd' && s.nasRated)
    const hddBudget = rest * weights.storage - (boot?.price ?? 0)
    const wantTB = prefs.minStorageTB ?? 0
    const maxBays = Math.max(0, ...p.cases.map((c) => c.driveBays35))
    let bestHdd: { d: Storage; n: number; tb: number } | undefined
    for (const d of hdds) {
      for (let n = 2; n <= Math.min(24, maxBays); n += 1) {
        const cost = d.price * n
        const tb = (d.capacityGB * n) / 1000
        if (cost > Math.max(hddBudget, 0) && !(wantTB && tb >= wantTB && !bestHdd)) break
        if (wantTB && tb < wantTB) continue
        if (!bestHdd || tb > bestHdd.tb || (tb === bestHdd.tb && cost < bestHdd.d.price * bestHdd.n)) bestHdd = { d, n, tb }
      }
    }
    if (!bestHdd && hdds.length) {
      const cheapest = hdds[0]
      bestHdd = { d: cheapest, n: 2, tb: (cheapest.capacityGB * 2) / 1000 }
    }
    if (bestHdd) for (let i = 0; i < bestHdd.n; i++) storage.push(bestHdd.d)
    hddCount = bestHdd?.n ?? 0
  } else {
    const want = targetStorageGB(input)
    const fits = nvmes.filter((s) => s.capacityGB >= want)
    const drive = fits.length ? pickWithin(fits, Math.max(fits[0].price, rest * weights.storage)) : largest(nvmes)
    if (drive) storage.push(drive)
    if (deviceType === 'server' && (profile === 'virtualization' || profile === 'ai')) {
      const data = p.storages.filter((s) => s.segment === 'server' && s.kind !== 'hdd')
      const extra = pickWithin(data, rest * 0.12)
      if (extra && extra.price < rest * 0.2) storage.push(extra, extra)
    }
  }
  if (!storage.length) return null

  // HBA si trop de disques SATA
  const sataCount = storage.filter((s) => s.interface === 'SATA' || s.interface === 'SAS').length
  let hba: HBA | undefined
  const needsHba = sataCount > mb.sataPorts || storage.some((s) => s.interface === 'SAS') || storage.some((s) => s.interface === 'U.2')
  if (needsHba) {
    const tri = storage.some((s) => s.interface === 'U.2')
    hba = p.hbas.find((h) => h.ports + mb.sataPorts >= sataCount && (!tri || isTriMode(h)))
    if (!hba && sataCount > mb.sataPorts) return null
  }

  // Refroidissement + boîtier
  const maxGpuLen = Math.max(0, ...gpuList.map((g) => g.lengthMm))
  const psuFormOk = (c: Case) => c.supportedFormFactors.includes(mb.formFactor) && c.maxGpuLengthMm >= maxGpuLen && c.driveBays35 >= hddCount
  const caseCands = p.cases.filter(psuFormOk)
  if (!caseCands.length) return null
  const coolerCands = p.coolers
    .filter((c) => c.sockets.includes(cpu.socket) && c.maxTdp >= cpu.tdp)
    .filter((c) => caseCands.some((k) => (c.type === 'air' ? (c.heightMm ?? 0) <= k.maxCoolerHeightMm : (c.radiatorMm ?? 0) <= k.maxRadiatorMm)))
  const cooler = pickWithin(coolerCands, rest * weights.cooler)
  if (!cooler) return null
  const fitsCooler = (k: Case) => (cooler.type === 'air' ? (cooler.heightMm ?? 0) <= k.maxCoolerHeightMm : (cooler.radiatorMm ?? 0) <= k.maxRadiatorMm)
  const pcCase = pickWithin(caseCands.filter(fitsCooler), rest * weights.case)
  if (!pcCase) return null

  // Réseau
  let nic: NIC | undefined
  if (deviceType === 'server' && (profile === 'virtualization' || profile === 'ai') && !/10G|25G|100G/.test(mb.lan)) {
    nic = pickWithin(p.nics.filter((n) => n.speedGbps >= 10), rest * 0.05)
  }

  // Alimentation
  const partial: ResolvedBuild = { cpu, gpus: gpuList, motherboard: mb, ram, ramKits: 1, storage, case: pcCase, cooler, nic, hba, accessories: [] }
  const needW = recommendedPsuW(partial)
  const psuCands = p.psus.filter((s) => {
    if (s.wattage < needW) return false
    if (pcCase.psuFormFactor === 'Redundant') return s.formFactor === 'Redundant'
    if (pcCase.psuFormFactor === 'SFX') return s.formFactor === 'SFX'
    if (pcCase.psuFormFactor === 'SFX-L') return s.formFactor === 'SFX' || s.formFactor === 'SFX-L'
    return s.formFactor !== 'Redundant'
  })
  const psu = pickWithin(psuCands, rest * weights.psu)
  if (!psu) return null

  const resolved: ResolvedBuild = { ...partial, psu }
  if (checkResolved(resolved, deviceType).some((i) => i.severity === 'error')) return null
  const total = totalPrice(resolved)
  if (total > budget * 1.03) return null
  const slots: BuildSlots = {
    cpu: cpu.id,
    gpu: gpuList.map((g) => g.id),
    motherboard: mb.id,
    ram: ram.id,
    ramKits: 1,
    storage: storage.map((s) => s.id),
    psu: psu.id,
    case: pcCase.id,
    cooler: cooler.id,
    nic: nic?.id,
    hba: hba?.id,
  }
  return { slots, resolved, total, score: scoreResolved(resolved, profile) }
}

/** Génère la meilleure configuration assemblée pour un budget donné. */
export function generateBuild(catalog: Catalog, input: GeneratorInput): GeneratedBuild | null {
  const p = pools(catalog, input)
  const { budget, profile, deviceType } = input
  const prefs = input.prefs ?? {}
  const counts = prefs.gpuCount && prefs.gpuCount > 0 ? [prefs.gpuCount] : deviceType === 'server' && profile === 'ai' ? [1, 2, 4, 8] : [1]
  const gpuSets: GPU[][] = [[]]
  if (deviceType !== 'nas') for (const g of p.gpus) for (const n of counts) gpuSets.push(Array(n).fill(g))
  const idealPlatform = budget * (PLATFORM_RATIO[profile] ?? 0.4)

  let best: { build: GeneratedBuild; metric: number } | null = null
  for (const cpu of p.cpus) {
    if (cpu.price > budget * 0.7) continue
    for (const gpus of gpuSets) {
      if (gpus.length === 0 && needsGpu(profile) && !(profile === 'gaming' && budget < 700 && cpu.integratedGraphics)) continue
      if (gpus.length > 0 && !needsGpu(profile) && deviceType !== 'server' && cpu.integratedGraphics) continue
      const core = cpu.price + gpus.reduce((s, g) => s + g.price, 0)
      if (core > budget * 0.85) continue
      const build = assemble(input, p, cpu, gpus)
      if (!build) continue
      const platform = build.total - core
      const balance = 3 * Math.min(1, platform / idealPlatform)
      // Pour les usages peu gourmands, on valorise aussi l'économie.
      const thrift = profile === 'office' || profile === 'homelab' || profile === 'storage' ? 4 * (1 - build.total / budget) : 0
      const metric = build.score + balance + thrift
      if (!best || metric > best.metric || (metric === best.metric && build.total < best.build.total)) best = { build, metric }
    }
  }
  return best?.build ?? null
}

export interface BuildVariant {
  key: 'eco' | 'best' | 'premium' | 'alt'
  label: string
  description: string
  build: GeneratedBuild
}

/** Plusieurs propositions : économique, recommandée, premium et alternative de marque. */
export function generateVariants(catalog: Catalog, input: GeneratorInput): BuildVariant[] {
  const out: BuildVariant[] = []
  const best = generateBuild(catalog, input)
  const eco = generateBuild(catalog, { ...input, budget: Math.round(input.budget * 0.72) })
  const premium = generateBuild(catalog, { ...input, budget: Math.round(input.budget * 1.35) })
  if (eco) out.push({ key: 'eco', label: 'Économique', description: `≈ -28 % de budget`, build: eco })
  if (best) out.push({ key: 'best', label: 'Recommandée', description: 'Le meilleur score pour votre budget', build: best })
  if (premium) out.push({ key: 'premium', label: 'Premium', description: `≈ +35 % de budget`, build: premium })
  const cpuBrand = best?.resolved.cpu?.brand
  if (best && (!input.prefs?.cpuBrand || input.prefs.cpuBrand === 'any') && cpuBrand) {
    const other = cpuBrand === 'AMD' ? 'Intel' : 'AMD'
    const alt = generateBuild(catalog, { ...input, prefs: { ...input.prefs, cpuBrand: other } })
    if (alt) out.push({ key: 'alt', label: `Alternative ${other}`, description: `Même budget, plateforme ${other}`, build: alt })
  }
  // Dédoublonnage
  const seen = new Set<string>()
  return out.filter((v) => {
    const key = JSON.stringify(v.build.slots)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export interface DevicePreferences {
  brand?: string
  os?: string
  minScreen?: number
  maxScreen?: number
  minRamGB?: number
  minStorageGB?: number
}

export interface RankedDevice {
  device: Device
  score: number
  /** Points de score par tranche de 100 €. */
  value: number
}

/** Classe les appareils complets (portables, tablettes, téléphones, NAS clé en main). */
export function recommendDevices(
  catalog: Catalog,
  deviceType: Exclude<DeviceType, 'desktop' | 'server'>,
  profile: UsageProfile,
  budget: number,
  prefs: DevicePreferences = {},
): RankedDevice[] {
  return catalog.devices
    .filter((d) => d.deviceType === deviceType && d.price <= budget * 1.05)
    .filter((d) => !prefs.brand || d.brand.toLowerCase() === prefs.brand.toLowerCase())
    .filter((d) => !prefs.os || d.os.toLowerCase().includes(prefs.os.toLowerCase()))
    .filter((d) => !prefs.minScreen || d.screenInches >= prefs.minScreen)
    .filter((d) => !prefs.maxScreen || d.screenInches <= prefs.maxScreen)
    .filter((d) => !prefs.minRamGB || d.ramGB >= prefs.minRamGB)
    .filter((d) => !prefs.minStorageGB || d.storageGB >= prefs.minStorageGB)
    .map((device) => {
      const score = scoreDevice(device, profile)
      // Bonus récence : à score égal, le plus récent l'emporte.
      return { device, score, value: (score / Math.max(1, device.price)) * 100 }
    })
    .sort((a, b) => b.score - a.score || a.device.price - b.device.price || b.device.releaseYear - a.device.releaseYear)
}
