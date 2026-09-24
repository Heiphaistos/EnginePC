/**
 * Synchronisation des données ouvertes → public/data/*.json
 *
 * Sources (gratuites, sans clé) :
 *  - pc-part-dataset (MIT, https://github.com/docyx/pc-part-dataset) : ~66 000 pièces PC et périphériques,
 *    prix USD. Mis à jour régulièrement par son auteur.
 *  - Banque centrale européenne : taux de change quotidiens (eurofxref-daily.xml).
 *
 * Les champs absents du dataset (dimensions, sockets des ventirads, scores…) sont déduits et listés dans
 * `estimated` pour que l'interface les signale et que la compatibilité les traite comme des avertissements.
 *
 * Usage : npm run sync            (ou via cron sur le VPS, voir docs/DEPLOIEMENT.md)
 *         DATASET_DIR=/chemin npm run sync   (utilise des fichiers JSON locaux)
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { baseComponents } from '../../src/data/catalog'
import type {
  Accessory,
  AccessoryKind,
  Case,
  Cooler,
  CPU,
  FormFactor,
  GPU,
  MemoryType,
  Motherboard,
  PCComponent,
  PSU,
  RAM,
  Storage,
  Tier,
} from '../../src/types'
import { GPU_REFERENCE, type GpuRef } from './gpu-reference'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = join(ROOT, 'public/data')
const DATASET = 'https://raw.githubusercontent.com/docyx/pc-part-dataset/main/data/json'
const SOURCE = 'pc-part-dataset'
const VAT = 1.2 // prix US hors taxes → TTC France

type Raw = Record<string, unknown> & { name: string; price: number | null }

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

async function loadDataset(file: string): Promise<Raw[]> {
  if (process.env.DATASET_DIR) return JSON.parse(await readFile(join(process.env.DATASET_DIR, `${file}.json`), 'utf8'))
  const res = await fetch(`${DATASET}/${file}.json`)
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`)
  return (await res.json()) as Raw[]
}

async function loadEurRates(): Promise<Record<string, number>> {
  const fallback = { USD: 1.1, GBP: 0.85, CHF: 0.94, CAD: 1.52, JPY: 162 }
  try {
    const res = await fetch('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const xml = await res.text()
    const rates: Record<string, number> = {}
    for (const m of xml.matchAll(/currency='([A-Z]{3})' rate='([\d.]+)'/g)) rates[m[1]] = Number(m[2])
    if (!rates.USD) throw new Error('USD manquant')
    return rates
  } catch (e) {
    console.warn(`⚠ Taux BCE indisponibles (${(e as Error).message}), valeurs par défaut utilisées.`)
    return fallback
  }
}

const MULTI_WORD_BRANDS = [
  'Western Digital', 'Cooler Master', 'Fractal Design', 'be quiet!', 'Lian Li', 'Super Flower', 'Silicon Power',
  'SK hynix', 'Creative Labs', 'In Win', 'PC Power & Cooling', 'Geometric Future', 'Arctic Cooling', 'Team Group',
]

function splitBrand(name: string): { brand: string; model: string } {
  const clean = name.replace(/\s+/g, ' ').trim()
  for (const b of MULTI_WORD_BRANDS) if (clean.toLowerCase().startsWith(b.toLowerCase() + ' ')) return { brand: b, model: clean.slice(b.length + 1) }
  const [first, ...rest] = clean.split(' ')
  const brand = first === 'TEAMGROUP' ? 'TeamGroup' : first === 'SeaSonic' ? 'Seasonic' : first
  // "Acer Acer Nitro…" → "Nitro…"
  const model = rest[0]?.toLowerCase() === first.toLowerCase() ? rest.slice(1).join(' ') : rest.join(' ')
  return { brand, model: model || clean }
}

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70)

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function hash(s: string): string {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0).toString(36).slice(0, 5)
}

function tierFromPrice(eur: number, steps: [number, number, number, number]): Tier {
  if (eur < steps[0]) return 'entry'
  if (eur < steps[1]) return 'mainstream'
  if (eur < steps[2]) return 'performance'
  if (eur < steps[3]) return 'enthusiast'
  return 'flagship'
}

// ---------------------------------------------------------------------------
// Mapping par catégorie
// ---------------------------------------------------------------------------

interface Ctx {
  usdToEur: number
  existing: Set<string>
  ids: Set<string>
}

function base(ctx: Ctx, category: PCComponent['category'], raw: Raw, suffix = '') {
  const split = splitBrand(raw.name)
  const brand = split.brand
  const core = suffix.replace(/\s+\d+GB$/i, '')
  const model = suffix && !norm(split.model).includes(norm(core)) ? `${split.model} ${suffix}` : split.model
  let id = `x-${category}-${slug(`${raw.name} ${suffix}`)}`
  if (ctx.ids.has(id)) id = `${id}-${hash(JSON.stringify(raw))}`
  for (let n = 2; ctx.ids.has(id); n++) id = `${id.replace(/-\d+$/, '')}-${n}`
  ctx.ids.add(id)
  return {
    id,
    brand,
    model,
    price: Math.max(1, Math.round((raw.price ?? 0) * ctx.usdToEur * VAT)),
    source: SOURCE,
    priceEstimated: true,
  }
}

/** Évite de dupliquer un produit déjà présent dans le catalogue vérifié. */
function isDuplicate(ctx: Ctx, name: string): boolean {
  const n = norm(name)
  return ctx.existing.has(n)
}

// Architecture → [socket, types mémoire, IPC relatif (Zen 5 = 1), année]
const ARCH: Record<string, [string, MemoryType[], number, number]> = {
  'Zen 5': ['AM5', ['DDR5'], 1, 2024],
  'Zen 4': ['AM5', ['DDR5'], 0.9, 2022],
  'Zen 3': ['AM4', ['DDR4'], 0.8, 2020],
  'Zen 2': ['AM4', ['DDR4'], 0.7, 2019],
  'Zen+': ['AM4', ['DDR4'], 0.62, 2018],
  Zen: ['AM4', ['DDR4'], 0.58, 2017],
  'Arrow Lake': ['LGA1851', ['DDR5'], 0.97, 2024],
  'Raptor Lake Refresh': ['LGA1700', ['DDR4', 'DDR5'], 0.93, 2023],
  'Raptor Lake': ['LGA1700', ['DDR4', 'DDR5'], 0.92, 2022],
  'Alder Lake': ['LGA1700', ['DDR4', 'DDR5'], 0.88, 2021],
  'Rocket Lake': ['LGA1200', ['DDR4'], 0.78, 2021],
  'Comet Lake': ['LGA1200', ['DDR4'], 0.68, 2020],
  'Coffee Lake Refresh': ['LGA1151', ['DDR4'], 0.66, 2018],
  'Coffee Lake': ['LGA1151', ['DDR4'], 0.66, 2017],
  'Kaby Lake': ['LGA1151', ['DDR4'], 0.64, 2017],
  Skylake: ['LGA1151', ['DDR4'], 0.62, 2015],
}

function mapCpu(ctx: Ctx, raw: Raw): CPU | null {
  const arch = ARCH[String(raw.microarchitecture)]
  if (!arch || isDuplicate(ctx, raw.name) || /threadripper|epyc|xeon/i.test(raw.name)) return null
  // Plateformes HEDT (LGA2066) non gérées
  if (/i[579]-(7|9|10)\d{3}X/i.test(raw.name)) return null
  const [socket, memoryTypes, ipc, year] = arch
  const cores = Number(raw.core_count) || 4
  const base_ = Number(raw.core_clock) || 3
  const boost = Number(raw.boost_clock) || base_
  const smt = raw.smt !== false
  const b = base(ctx, 'cpu', raw)
  const x3d = /x3d/i.test(raw.name)
  return {
    ...b,
    category: 'cpu',
    releaseYear: year,
    tier: tierFromPrice(b.price, [150, 280, 450, 650]),
    segment: 'consumer',
    socket,
    cores,
    threads: smt ? cores * 2 : cores,
    baseClock: base_,
    boostClock: boost,
    tdp: Number(raw.tdp) || 65,
    memoryTypes,
    integratedGraphics: !!raw.graphics,
    singleThreadScore: Math.round(Math.min(100, (boost / 5.7) * ipc * 100 * (x3d ? 0.97 : 1))),
    multiThreadScore: Math.round(0.218 * cores * ((base_ + boost) / 2) * ipc * (smt ? 1.25 : 1) * 10) / 10,
    estimated: ["socket", "threads", "singleThreadScore", "multiThreadScore", "memoryTypes"],
  }
}

function findGpuRef(chipset: string): GpuRef | undefined {
  const exact = GPU_REFERENCE[chipset] ?? GPU_REFERENCE[chipset.replace(/\s+LHR$/, '')]
  if (exact) return exact
  const n = norm(chipset)
  const hit = Object.entries(GPU_REFERENCE).find(([k]) => norm(k) === n)
  return hit?.[1]
}

function mapGpu(ctx: Ctx, raw: Raw): GPU | null {
  const chipset = String(raw.chipset ?? '')
  const ref = findGpuRef(chipset)
  if (!ref || isDuplicate(ctx, raw.name)) return null
  const b = base(ctx, 'gpu', raw, chipset.replace(/\s+LHR$/, '').replace(/^(GeForce|Radeon) /, ''))
  const length = Number(raw.length) || 0
  return {
    ...b,
    category: 'gpu',
    releaseYear: ref.releaseYear,
    tier: ref.tier,
    segment: ref.segment,
    chipset: chipset.replace(/\s+LHR$/, ''),
    vramGB: Number(raw.memory) || 0,
    vramType: ref.vramType,
    tdp: ref.tdp,
    lengthMm: length || 280,
    slots: ref.slots,
    gamingScore: ref.gamingScore,
    aiScore: ref.aiScore,
    fp16Tflops: ref.fp16Tflops,
    recommendedPsuW: ref.recommendedPsuW,
    powerConnector: ref.powerConnector,
    estimated: length ? ['slots'] : ['slots', 'lengthMm'],
  }
}

const MB_SOCKETS = new Set(['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151'])
const FF: Record<string, FormFactor> = { ATX: 'ATX', 'Micro ATX': 'mATX', 'Mini ITX': 'ITX', EATX: 'E-ATX', 'XL ATX': 'E-ATX', 'SSI CEB': 'E-ATX' }
const CHIPSET_RE = /(?<![A-Z0-9])(X870E|X870|B850|B840|X670E|X670|B650E|B650|A620|X570S?|B550|A520|X470|B450|Z890|B860|H810|Z790|B760|H770|Z690|B660|H670|H610|Z590|B560|H510|H570|Z490|B460|H410|Z390|B365|B360|H370|H310|Z370|Z270|H270|B250|Z170|H170|B150|H110|W480|W680|W790)(?:M|I)?(?![A-Z0-9])/i

function mapMotherboard(ctx: Ctx, raw: Raw): Motherboard | null {
  const socket = String(raw.socket)
  const formFactor = FF[String(raw.form_factor)]
  if (!MB_SOCKETS.has(socket) || !formFactor || isDuplicate(ctx, raw.name)) return null
  const name = raw.name
  const chipset = (name.match(CHIPSET_RE)?.[1] ?? '').toUpperCase()
  const ddr4 = /ddr4|\bd4\b/i.test(name) || ['AM4', 'LGA1200', 'LGA1151'].includes(socket)
  const memoryType: MemoryType = socket === 'LGA1700' ? (ddr4 ? 'DDR4' : 'DDR5') : ddr4 ? 'DDR4' : 'DDR5'
  const modern = ['AM5', 'LGA1851', 'LGA1700'].includes(socket)
  const b = base(ctx, 'motherboard', raw)
  const year = { AM5: 2023, LGA1851: 2024, LGA1700: 2022, AM4: 2020, LGA1200: 2020, LGA1151: 2018 }[socket] ?? 2020
  return {
    ...b,
    category: 'motherboard',
    releaseYear: year,
    tier: tierFromPrice(b.price, [130, 220, 350, 550]),
    segment: /supermicro|asrock rack/i.test(name) ? 'server' : 'consumer',
    socket,
    chipset: chipset || '—',
    formFactor,
    memoryType,
    memorySlots: Number(raw.memory_slots) || 4,
    maxMemoryGB: Number(raw.max_memory) || (modern ? 192 : 128),
    m2Slots: formFactor === 'ITX' ? 2 : modern ? (formFactor === 'mATX' ? 2 : 3) : 2,
    sataPorts: formFactor === 'ITX' ? 2 : 4,
    pcieX16Slots: formFactor === 'ITX' ? 1 : formFactor === 'E-ATX' ? 2 : 1,
    wifi: /wi-?fi|\bax\b|\bac\b|wifi/i.test(name),
    lan: modern ? '2.5GbE' : '1GbE',
    eccSupport: /ecc|supermicro|asrock rack/i.test(name) || undefined,
    estimated: ['m2Slots', 'sataPorts', 'pcieX16Slots', 'lan', 'memoryType'],
  }
}

function mapRam(ctx: Ctx, raw: Raw): RAM | null {
  const [ddr, speed] = (raw.speed as [number, number]) ?? []
  const [modules, size] = (raw.modules as [number, number]) ?? []
  if ((ddr !== 4 && ddr !== 5) || !modules || !size || isDuplicate(ctx, raw.name)) return null
  const b = base(ctx, 'ram', raw)
  const registered = /registered|rdimm|\brdimm\b/i.test(raw.name)
  return {
    ...b,
    id: b.id.replace('x-ram-', 'x-ram-'),
    category: 'ram',
    releaseYear: ddr === 5 ? 2023 : 2019,
    tier: tierFromPrice(b.price, [70, 140, 250, 450]),
    memoryType: ddr === 5 ? 'DDR5' : 'DDR4',
    capacityGB: modules * size,
    modules,
    speedMTs: speed,
    casLatency: Number(raw.cas_latency) || (ddr === 5 ? 36 : 16),
    ecc: /ecc/i.test(raw.name) || registered,
    registered,
  }
}

function mapStorage(ctx: Ctx, raw: Raw): Storage | null {
  const iface = String(raw.interface)
  const ff = String(raw.form_factor)
  const cap = Number(raw.capacity)
  const capLabel = cap >= 1000 ? `${Math.round(cap / 100) / 10}TB`.replace('.0TB', 'TB') : `${cap}GB`
  if (!cap || /PATA|mSATA|1\.5 Gb/.test(iface) || ff === 'mSATA' || isDuplicate(ctx, `${raw.name} ${capLabel}`)) return null
  const ssd = raw.type === 'SSD'
  const gen = iface.match(/PCIe (\d)\.0/)?.[1]
  const iface2: Storage['interface'] = iface === 'U.2' ? 'U.2' : iface.startsWith('SAS') ? 'SAS' : gen ? (`NVMe PCIe ${gen}.0` as Storage['interface']) : 'SATA'
  if (iface.startsWith('PCIe x')) return null
  const kind: Storage['kind'] = gen ? 'nvme' : ssd ? 'ssd' : 'hdd'
  const formFactorDrive: Storage['formFactorDrive'] = ff.startsWith('M.2') ? 'M.2 2280' : ff === '3.5' ? '3.5"' : iface === 'U.2' ? 'U.2' : '2.5"'
  const speed = kind === 'hdd' ? (Number(raw.type) >= 7200 ? 250 : 180) : gen === '5' ? 12000 : gen === '4' ? 7000 : gen === '3' ? 3500 : 550
  const b = base(ctx, 'storage', raw, capLabel)
  return {
    ...b,
    category: 'storage',
    releaseYear: gen === '5' ? 2024 : gen === '4' ? 2021 : 2019,
    tier: tierFromPrice(b.price, [60, 120, 220, 400]),
    segment: /exos|ultrastar|enterprise|datacenter|\bdc\b|mg\d\d/i.test(raw.name) ? 'server' : 'consumer',
    kind,
    interface: iface2,
    formFactorDrive,
    capacityGB: cap,
    readMBs: speed,
    writeMBs: Math.round(speed * 0.9),
    rpm: kind === 'hdd' ? Number(raw.type) || undefined : undefined,
    nasRated: kind === 'hdd' ? /ironwolf|red|exos|ultrastar|n300|mg\d\d|skyhawk|gold/i.test(raw.name) : undefined,
    estimated: ['readMBs', 'writeMBs'],
  }
}

const EFF: Record<string, PSU['efficiency']> = {
  plus: '80+ White',
  bronze: '80+ Bronze',
  silver: '80+ Bronze',
  gold: '80+ Gold',
  platinum: '80+ Platinum',
  titanium: '80+ Titanium',
}

function mapPsu(ctx: Ctx, raw: Raw): PSU | null {
  const type = String(raw.type)
  const formFactor: PSU['formFactor'] | undefined = type === 'ATX' ? 'ATX' : type === 'SFX' ? (/sfx-?l/i.test(raw.name) ? 'SFX-L' : 'SFX') : undefined
  const wattage = Number(raw.wattage)
  if (!formFactor || !wattage || isDuplicate(ctx, raw.name)) return null
  const b = base(ctx, 'psu', raw)
  const modular = String(raw.modular)
  return {
    ...b,
    category: 'psu',
    releaseYear: /atx 3|pcie ?5|atx3/i.test(raw.name) ? 2024 : 2021,
    tier: tierFromPrice(b.price, [70, 120, 200, 320]),
    wattage,
    efficiency: EFF[String(raw.efficiency)] ?? '80+ White',
    modular: modular === 'Full' ? 'full' : modular === 'Semi' ? 'semi' : 'none',
    formFactor,
    atx31: /atx ?3|pcie ?5|12v-2x6|12vhpwr/i.test(raw.name),
  }
}

function mapCase(ctx: Ctx, raw: Raw): Case | null {
  const type = String(raw.type)
  if (/test bench|slim|htpc/i.test(type) || isDuplicate(ctx, raw.name)) return null
  const full = /full tower/i.test(type)
  const atx = type.startsWith('ATX')
  const matx = type.startsWith('MicroATX')
  const itx = type.startsWith('Mini ITX')
  const desktopItx = itx && /desktop/i.test(type)
  const supportedFormFactors: FormFactor[] = full ? ['E-ATX', 'ATX', 'mATX', 'ITX'] : atx ? ['ATX', 'mATX', 'ITX'] : matx ? ['mATX', 'ITX'] : ['ITX']
  const b = base(ctx, 'case', raw)
  const bays = Number(raw.internal_35_bays) || 0
  return {
    ...b,
    category: 'case',
    releaseYear: 2022,
    tier: tierFromPrice(b.price, [60, 110, 180, 280]),
    supportedFormFactors,
    maxGpuLengthMm: full ? 420 : atx ? 360 : matx ? 330 : desktopItx ? 300 : 320,
    maxCoolerHeightMm: full ? 185 : atx ? 165 : matx ? 160 : desktopItx ? 65 : 150,
    driveBays35: bays,
    driveBays25: 2,
    psuFormFactor: desktopItx ? 'SFX' : 'ATX',
    maxRadiatorMm: full ? 420 : atx ? 360 : matx ? 280 : desktopItx ? 240 : 280,
    type: full ? 'tower' : atx || matx ? 'mid-tower' : 'mini',
    estimated: ['maxGpuLengthMm', 'maxCoolerHeightMm', 'maxRadiatorMm', 'psuFormFactor'],
  }
}

const COOLER_SOCKETS = ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151']

function mapCooler(ctx: Ctx, raw: Raw): Cooler | null {
  if (isDuplicate(ctx, raw.name)) return null
  const size = Number(raw.size) || 0
  const aio = size > 0
  const b = base(ctx, 'cooler', raw)
  const lowProfile = /low profile|nh-l|slim|\bl9|\bl12/i.test(raw.name)
  return {
    ...b,
    category: 'cooler',
    releaseYear: 2022,
    tier: tierFromPrice(b.price, [30, 60, 110, 180]),
    type: aio ? 'aio' : 'air',
    sockets: COOLER_SOCKETS,
    heightMm: aio ? undefined : lowProfile ? 60 : 155,
    radiatorMm: aio ? size : undefined,
    maxTdp: aio ? (size >= 360 ? 300 : size >= 280 ? 260 : size >= 240 ? 230 : 170) : lowProfile ? 95 : b.price > 60 ? 250 : 200,
    estimated: aio ? ['sockets', 'maxTdp'] : ['sockets', 'maxTdp', 'heightMm'],
  }
}

// --- Périphériques & accessoires ------------------------------------------

type SpecFn = (r: Raw) => { specs: string[]; refreshHz?: number; resolutionY?: number }
const yes = (v: unknown) => v === true

const ACCESSORIES: [string, AccessoryKind, SpecFn][] = [
  ['monitor', 'monitor', (r) => {
    const [w, h] = (r.resolution as [number, number]) ?? []
    return {
      specs: [r.screen_size ? `${r.screen_size}"` : '', w ? `${w}×${h}` : '', r.refresh_rate ? `${r.refresh_rate} Hz` : '', String(r.panel_type ?? ''), r.response_time ? `${r.response_time} ms` : ''].filter(Boolean),
      refreshHz: Number(r.refresh_rate) || undefined,
      resolutionY: h,
    }
  }],
  ['keyboard', 'keyboard', (r) => ({ specs: [String(r.style ?? ''), String(r.switches ?? ''), String(r.connection_type ?? ''), yes(r.tenkeyless) ? 'TKL' : '', r.backlit ? `Rétroéclairé ${r.backlit}` : ''].filter((x) => x && x !== 'null') })],
  ['mouse', 'mouse', (r) => ({ specs: [String(r.connection_type ?? ''), r.max_dpi ? `${r.max_dpi} DPI` : '', String(r.tracking_method ?? '')].filter((x) => x && x !== 'null') })],
  ['headphones', 'headphones', (r) => ({ specs: [String(r.type ?? ''), yes(r.wireless) ? 'Sans fil' : 'Filaire', yes(r.microphone) ? 'Micro' : '', String(r.enclosure_type ?? '')].filter((x) => x && x !== 'null') })],
  ['speakers', 'speakers', (r) => ({ specs: [r.configuration ? `${r.configuration} canaux` : '', r.wattage ? `${r.wattage} W` : ''].filter(Boolean) })],
  ['webcam', 'webcam', (r) => ({ specs: [((r.resolutions as string[]) ?? [])[0] ?? '', String(r.focus_type ?? ''), r.fov ? `${r.fov}°` : ''].filter(Boolean) })],
  ['case-fan', 'case-fan', (r) => ({ specs: [r.size ? `${r.size} mm` : '', yes(r.pwm) ? 'PWM' : '', String(r.color ?? '')].filter((x) => x && x !== 'null') })],
  ['thermal-paste', 'thermal-paste', (r) => ({ specs: [r.amount ? `${r.amount} g` : ''].filter(Boolean) })],
  ['wireless-network-card', 'wifi-card', (r) => ({ specs: [String(r.protocol ?? ''), String(r.interface ?? '')].filter((x) => x && x !== 'null') })],
  ['sound-card', 'sound-card', (r) => ({ specs: [r.channels ? `${r.channels} canaux` : '', r.snr ? `SNR ${r.snr} dB` : '', String(r.interface ?? '')].filter(Boolean) })],
  ['ups', 'ups', (r) => ({ specs: [r.capacity_va ? `${r.capacity_va} VA` : '', r.capacity_w ? `${r.capacity_w} W` : ''].filter(Boolean) })],
  ['os', 'os', () => ({ specs: [] })],
  ['external-hard-drive', 'external-storage', (r) => ({ specs: [r.capacity ? `${Number(r.capacity) >= 1000 ? Number(r.capacity) / 1000 + ' To' : r.capacity + ' Go'}` : '', String(r.type ?? '')].filter(Boolean) })],
]

function mapAccessory(ctx: Ctx, kind: AccessoryKind, fn: SpecFn, raw: Raw): Accessory {
  const b = base(ctx, 'accessory', raw)
  return { ...b, category: 'accessory', kind, releaseYear: 2023, tier: tierFromPrice(b.price, [30, 80, 200, 500]), ...fn(raw) }
}

// ---------------------------------------------------------------------------

/** Garde les produits avec un prix, sans les doublons exacts du dataset. */
function uniqueRows(rows: Raw[]): Raw[] {
  const seen = new Set<string>()
  return rows.filter((r) => {
    if (!r.price || r.price <= 0) return false
    const key = JSON.stringify(r)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Clé de regroupement pour détecter les prix aberrants (revendeurs tiers, produits en fin de vie). */
function priceGroup(c: PCComponent): string {
  switch (c.category) {
    case 'gpu':
      return `gpu-${c.chipset}-${c.vramGB}`
    case 'motherboard':
      return `mb-${c.socket}-${c.chipset}`
    case 'ram':
      return `ram-${c.memoryType}-${c.capacityGB}`
    case 'storage':
      return `st-${c.kind}-${c.interface}-${c.capacityGB}`
    case 'psu':
      return `psu-${Math.round(c.wattage / 100)}-${c.efficiency}`
    case 'cooler':
      return `cool-${c.type}-${c.radiatorMm ?? 0}`
    case 'case':
      return `case-${c.type}`
    case 'accessory':
      return `acc-${c.kind}-${c.specs.slice(0, 3).join('-')}`
    default:
      return `${c.category}-${c.id}`
  }
}

const median = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

/** Supprime les prix > 2,5× la médiane de leur groupe, et les vieilles plateformes hors de prix. */
function dropPriceOutliers(items: PCComponent[]): PCComponent[] {
  const groups = new Map<string, number[]>()
  for (const c of items) {
    const k = priceGroup(c)
    groups.set(k, [...(groups.get(k) ?? []), c.price])
  }
  const oldPlatforms = new Set(['AM4', 'LGA1200', 'LGA1151'])
  return items.filter((c) => {
    if ((c.category === 'motherboard' || c.category === 'cpu') && oldPlatforms.has(c.socket) && c.price > 450) return false
    const g = groups.get(priceGroup(c))!
    return g.length < 3 || c.price <= median(g) * 2.5
  })
}

async function main() {
  const rates = await loadEurRates()
  const usdToEur = 1 / rates.USD
  const ctx: Ctx = {
    usdToEur,
    existing: new Set(baseComponents.flatMap((c) => [norm(`${c.brand} ${c.model}`), norm(c.model)])),
    ids: new Set(baseComponents.map((c) => c.id)),
  }

  const mappers: [string, (ctx: Ctx, r: Raw) => PCComponent | null][] = [
    ['cpu', mapCpu],
    ['video-card', mapGpu],
    ['motherboard', mapMotherboard],
    ['memory', mapRam],
    ['internal-hard-drive', mapStorage],
    ['power-supply', mapPsu],
    ['case', mapCase],
    ['cpu-cooler', mapCooler],
  ]

  const components: PCComponent[] = []
  const stats: Record<string, number> = {}
  for (const [file, fn] of mappers) {
    const rows = uniqueRows(await loadDataset(file))
    const mapped = dropPriceOutliers(rows.map((r) => fn(ctx, r)).filter((x): x is PCComponent => !!x))
    components.push(...mapped)
    stats[file] = mapped.length
  }
  for (const [file, kind, fn] of ACCESSORIES) {
    const rows = uniqueRows(await loadDataset(file))
    const mapped = dropPriceOutliers(rows.map((r) => mapAccessory(ctx, kind, fn, r)))
    components.push(...mapped)
    stats[file] = mapped.length
  }

  await mkdir(OUT, { recursive: true })
  const generatedAt = new Date().toISOString()
  await writeFile(
    join(OUT, 'extra-catalog.json'),
    JSON.stringify({ schema: 'enginepc.catalog', version: 1, generatedAt, source: 'https://github.com/docyx/pc-part-dataset (MIT)', components }),
  )
  await writeFile(join(OUT, 'rates.json'), JSON.stringify({ base: 'EUR', generatedAt, source: 'BCE', rates: { EUR: 1, ...rates } }))
  console.log(`✓ ${components.length} produits écrits dans public/data/extra-catalog.json (1 USD = ${usdToEur.toFixed(4)} EUR)`)
  console.table(stats)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
