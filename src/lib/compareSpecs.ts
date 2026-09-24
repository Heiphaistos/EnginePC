import type { ComponentCategory, PCComponent } from '../types'
import { formatCapacity } from './format'

export interface SpecRow {
  label: string
  value: (c: PCComponent) => string | number | undefined
  /** Pour les valeurs numériques : quelle direction est la meilleure. */
  better?: 'higher' | 'lower'
}

const n = <T extends PCComponent>(f: (c: T) => number | undefined) => (c: PCComponent) => f(c as T)
const t = <T extends PCComponent>(f: (c: T) => string | undefined) => (c: PCComponent) => f(c as T)
const yesNo = (v: boolean | undefined) => (v ? 'Oui' : 'Non')

/** Caractéristiques comparées par catégorie. */
export const SPEC_ROWS: Partial<Record<ComponentCategory, SpecRow[]>> = {
  cpu: [
    { label: 'Socket', value: t<Extract<PCComponent, { category: 'cpu' }>>((c) => c.socket) },
    { label: 'Cœurs', value: n<Extract<PCComponent, { category: 'cpu' }>>((c) => c.cores), better: 'higher' },
    { label: 'Threads', value: n<Extract<PCComponent, { category: 'cpu' }>>((c) => c.threads), better: 'higher' },
    { label: 'Fréquence boost (GHz)', value: n<Extract<PCComponent, { category: 'cpu' }>>((c) => c.boostClock), better: 'higher' },
    { label: 'TDP (W)', value: n<Extract<PCComponent, { category: 'cpu' }>>((c) => c.tdp), better: 'lower' },
    { label: 'Score mono-cœur', value: n<Extract<PCComponent, { category: 'cpu' }>>((c) => c.singleThreadScore), better: 'higher' },
    { label: 'Score multi-cœur', value: n<Extract<PCComponent, { category: 'cpu' }>>((c) => c.multiThreadScore), better: 'higher' },
    { label: 'iGPU', value: t<Extract<PCComponent, { category: 'cpu' }>>((c) => yesNo(c.integratedGraphics)) },
    { label: 'NPU (TOPS)', value: n<Extract<PCComponent, { category: 'cpu' }>>((c) => c.npuTops), better: 'higher' },
    { label: 'Mémoire', value: t<Extract<PCComponent, { category: 'cpu' }>>((c) => c.memoryTypes.join(' / ')) },
  ],
  gpu: [
    { label: 'Puce', value: t<Extract<PCComponent, { category: 'gpu' }>>((c) => c.chipset) },
    { label: 'VRAM (Go)', value: n<Extract<PCComponent, { category: 'gpu' }>>((c) => c.vramGB), better: 'higher' },
    { label: 'Type de mémoire', value: t<Extract<PCComponent, { category: 'gpu' }>>((c) => c.vramType) },
    { label: 'Score gaming', value: n<Extract<PCComponent, { category: 'gpu' }>>((c) => c.gamingScore), better: 'higher' },
    { label: 'Score IA', value: n<Extract<PCComponent, { category: 'gpu' }>>((c) => c.aiScore), better: 'higher' },
    { label: 'FP16 (TFLOPS)', value: n<Extract<PCComponent, { category: 'gpu' }>>((c) => c.fp16Tflops), better: 'higher' },
    { label: 'Consommation (W)', value: n<Extract<PCComponent, { category: 'gpu' }>>((c) => c.tdp), better: 'lower' },
    { label: 'Longueur (mm)', value: n<Extract<PCComponent, { category: 'gpu' }>>((c) => c.lengthMm), better: 'lower' },
    { label: 'Alimentation conseillée (W)', value: n<Extract<PCComponent, { category: 'gpu' }>>((c) => c.recommendedPsuW), better: 'lower' },
  ],
  motherboard: [
    { label: 'Socket', value: t<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.socket) },
    { label: 'Chipset', value: t<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.chipset) },
    { label: 'Format', value: t<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.formFactor) },
    { label: 'Mémoire', value: t<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.memoryType) },
    { label: 'Slots mémoire', value: n<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.memorySlots), better: 'higher' },
    { label: 'Mémoire max (Go)', value: n<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.maxMemoryGB), better: 'higher' },
    { label: 'Ports M.2', value: n<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.m2Slots), better: 'higher' },
    { label: 'Ports SATA', value: n<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.sataPorts), better: 'higher' },
    { label: 'Réseau', value: t<Extract<PCComponent, { category: 'motherboard' }>>((c) => c.lan) },
    { label: 'Wi-Fi', value: t<Extract<PCComponent, { category: 'motherboard' }>>((c) => yesNo(c.wifi)) },
  ],
  ram: [
    { label: 'Capacité', value: t<Extract<PCComponent, { category: 'ram' }>>((c) => formatCapacity(c.capacityGB)) },
    { label: 'Barrettes', value: n<Extract<PCComponent, { category: 'ram' }>>((c) => c.modules) },
    { label: 'Type', value: t<Extract<PCComponent, { category: 'ram' }>>((c) => c.memoryType) },
    { label: 'Fréquence (MT/s)', value: n<Extract<PCComponent, { category: 'ram' }>>((c) => c.speedMTs), better: 'higher' },
    { label: 'Latence CAS', value: n<Extract<PCComponent, { category: 'ram' }>>((c) => c.casLatency), better: 'lower' },
    { label: 'Latence réelle (ns)', value: n<Extract<PCComponent, { category: 'ram' }>>((c) => Math.round((c.casLatency / c.speedMTs) * 2000 * 10) / 10), better: 'lower' },
    { label: 'ECC', value: t<Extract<PCComponent, { category: 'ram' }>>((c) => yesNo(c.ecc)) },
  ],
  storage: [
    { label: 'Capacité', value: t<Extract<PCComponent, { category: 'storage' }>>((c) => formatCapacity(c.capacityGB)) },
    { label: 'Interface', value: t<Extract<PCComponent, { category: 'storage' }>>((c) => c.interface) },
    { label: 'Lecture (Mo/s)', value: n<Extract<PCComponent, { category: 'storage' }>>((c) => c.readMBs), better: 'higher' },
    { label: 'Écriture (Mo/s)', value: n<Extract<PCComponent, { category: 'storage' }>>((c) => c.writeMBs), better: 'higher' },
    { label: 'Endurance (TBW)', value: n<Extract<PCComponent, { category: 'storage' }>>((c) => c.tbw), better: 'higher' },
    { label: 'Prix au To (€)', value: (c) => Math.round((c.price / Math.max(1, (c as Extract<PCComponent, { category: 'storage' }>).capacityGB)) * 1000), better: 'lower' },
  ],
  psu: [
    { label: 'Puissance (W)', value: n<Extract<PCComponent, { category: 'psu' }>>((c) => c.wattage), better: 'higher' },
    { label: 'Certification', value: t<Extract<PCComponent, { category: 'psu' }>>((c) => c.efficiency) },
    { label: 'Format', value: t<Extract<PCComponent, { category: 'psu' }>>((c) => c.formFactor) },
    { label: 'Modulaire', value: t<Extract<PCComponent, { category: 'psu' }>>((c) => c.modular) },
    { label: 'ATX 3.1', value: t<Extract<PCComponent, { category: 'psu' }>>((c) => yesNo(c.atx31)) },
  ],
  case: [
    { label: 'Formats', value: t<Extract<PCComponent, { category: 'case' }>>((c) => c.supportedFormFactors.join(', ')) },
    { label: 'GPU max (mm)', value: n<Extract<PCComponent, { category: 'case' }>>((c) => c.maxGpuLengthMm), better: 'higher' },
    { label: 'Ventirad max (mm)', value: n<Extract<PCComponent, { category: 'case' }>>((c) => c.maxCoolerHeightMm), better: 'higher' },
    { label: 'Radiateur max (mm)', value: n<Extract<PCComponent, { category: 'case' }>>((c) => c.maxRadiatorMm), better: 'higher' },
    { label: 'Baies 3,5"', value: n<Extract<PCComponent, { category: 'case' }>>((c) => c.driveBays35), better: 'higher' },
  ],
  cooler: [
    { label: 'Type', value: t<Extract<PCComponent, { category: 'cooler' }>>((c) => (c.type === 'aio' ? `AIO ${c.radiatorMm} mm` : 'Ventirad')) },
    { label: 'TDP max (W)', value: n<Extract<PCComponent, { category: 'cooler' }>>((c) => c.maxTdp), better: 'higher' },
    { label: 'Hauteur (mm)', value: n<Extract<PCComponent, { category: 'cooler' }>>((c) => c.heightMm), better: 'lower' },
    { label: 'Sockets', value: t<Extract<PCComponent, { category: 'cooler' }>>((c) => c.sockets.join(', ')) },
  ],
}

/** Indices des meilleures valeurs d'une ligne numérique. */
export function bestIndexes(values: (string | number | undefined)[], better?: 'higher' | 'lower'): Set<number> {
  if (!better) return new Set()
  const nums = values.map((v) => (typeof v === 'number' ? v : NaN))
  const valid = nums.filter((v) => !Number.isNaN(v))
  if (valid.length < 2 || new Set(valid).size === 1) return new Set()
  const target = better === 'higher' ? Math.max(...valid) : Math.min(...valid)
  return new Set(nums.flatMap((v, i) => (v === target ? [i] : [])))
}
