import type {
  Accessory,
  BuildSlots,
  Case,
  Cooler,
  CPU,
  GPU,
  HBA,
  Motherboard,
  NIC,
  PCComponent,
  PSU,
  RAM,
  Storage,
} from '../types'
import { lookup, type Catalog } from './catalog'

/** Configuration avec les objets composants résolus depuis le catalogue. */
export interface ResolvedBuild {
  cpu?: CPU
  gpus: GPU[]
  motherboard?: Motherboard
  ram?: RAM
  ramKits: number
  storage: Storage[]
  psu?: PSU
  case?: Case
  cooler?: Cooler
  nic?: NIC
  hba?: HBA
  accessories: Accessory[]
}

export function resolveBuild(slots: BuildSlots, catalog: Catalog): ResolvedBuild {
  const many = <T extends PCComponent>(ids?: string[]) =>
    (ids ?? []).map((id) => lookup<T>(catalog, id)).filter((x): x is T => !!x)
  return {
    cpu: lookup<CPU>(catalog, slots.cpu),
    gpus: many<GPU>(slots.gpu),
    motherboard: lookup<Motherboard>(catalog, slots.motherboard),
    ram: lookup<RAM>(catalog, slots.ram),
    ramKits: Math.max(1, slots.ramKits ?? 1),
    storage: many<Storage>(slots.storage),
    psu: lookup<PSU>(catalog, slots.psu),
    case: lookup<Case>(catalog, slots.case),
    cooler: lookup<Cooler>(catalog, slots.cooler),
    nic: lookup<NIC>(catalog, slots.nic),
    hba: lookup<HBA>(catalog, slots.hba),
    accessories: many<Accessory>(slots.accessories),
  }
}

/** Liste plate (avec quantités) des composants d'une config résolue. */
export function lineItems(b: ResolvedBuild): { item: PCComponent; qty: number }[] {
  const out: { item: PCComponent; qty: number }[] = []
  const pushGrouped = (items: PCComponent[]) => {
    const counts = new Map<string, { item: PCComponent; qty: number }>()
    for (const it of items) {
      const e = counts.get(it.id)
      if (e) e.qty++
      else counts.set(it.id, { item: it, qty: 1 })
    }
    out.push(...counts.values())
  }
  if (b.cpu) out.push({ item: b.cpu, qty: 1 })
  if (b.cooler) out.push({ item: b.cooler, qty: 1 })
  if (b.motherboard) out.push({ item: b.motherboard, qty: 1 })
  if (b.ram) out.push({ item: b.ram, qty: b.ramKits })
  pushGrouped(b.gpus)
  pushGrouped(b.storage)
  if (b.psu) out.push({ item: b.psu, qty: 1 })
  if (b.case) out.push({ item: b.case, qty: 1 })
  if (b.nic) out.push({ item: b.nic, qty: 1 })
  if (b.hba) out.push({ item: b.hba, qty: 1 })
  pushGrouped(b.accessories)
  return out
}

export type PriceResolver = (item: PCComponent) => number

export const catalogPrice: PriceResolver = (item) => item.price

export function totalPrice(b: ResolvedBuild, price: PriceResolver = catalogPrice): number {
  return lineItems(b).reduce((sum, { item, qty }) => sum + price(item) * qty, 0)
}

export function totalRamGB(b: ResolvedBuild): number {
  return b.ram ? b.ram.capacityGB * b.ramKits : 0
}

export function totalStorageGB(b: ResolvedBuild): number {
  return b.storage.reduce((s, d) => s + d.capacityGB, 0)
}

export function totalVramGB(b: ResolvedBuild): number {
  return b.gpus.reduce((s, g) => s + g.vramGB, 0)
}

/** Puissance CPU en pointe : PPT AMD ≈ 1,35 × TDP, PL2 Intel ≈ 2 × PBP sur les modèles K. */
export function cpuPeakW(cpu: CPU): number {
  if (cpu.segment === 'server' || cpu.segment === 'workstation') return cpu.tdp
  if (cpu.brand === 'Intel') return cpu.tdp >= 125 ? cpu.tdp * 2 : cpu.tdp * 1.5
  return cpu.tdp * 1.35
}

/** Estimation de la consommation électrique en charge (W). */
export function estimatePowerW(b: ResolvedBuild): number {
  let w = 60 // carte mère, ventilateurs, USB
  if (b.cpu) w += cpuPeakW(b.cpu)
  for (const g of b.gpus) w += g.tdp
  for (const d of b.storage) w += d.kind === 'hdd' ? 9 : 7
  if (b.ram) w += (b.ram.modules * b.ramKits) * (b.ram.registered ? 6 : 4)
  if (b.nic) w += 15
  if (b.hba) w += 20
  return Math.round(w)
}

/** Puissance d'alimentation recommandée (marge 30 % + transitoires GPU). */
export function recommendedPsuW(b: ResolvedBuild): number {
  const base = estimatePowerW(b) * 1.3
  const gpuRec = b.gpus.length ? Math.max(...b.gpus.map((g) => g.recommendedPsuW)) + (b.gpus.length - 1) * (b.gpus[0].tdp * 1.2) : 0
  return Math.ceil(Math.max(base, gpuRec) / 50) * 50
}
