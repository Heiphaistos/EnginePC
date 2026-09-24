import type { AccessoryKind, Device, PCComponent } from '../types'
import { formatCapacity } from './format'

/** Caractéristiques clés d'un composant, sous forme de puces courtes. */
export function componentSpecs(c: PCComponent): string[] {
  switch (c.category) {
    case 'cpu':
      return [c.socket, `${c.cores}C/${c.threads}T`, `${c.boostClock} GHz`, `${c.tdp} W`, ...(c.integratedGraphics ? ['iGPU'] : []), ...(c.npuTops ? [`NPU ${c.npuTops} TOPS`] : []), ...(c.eccSupport ? ['ECC'] : [])]
    case 'gpu':
      return [`${c.vramGB} Go ${c.vramType}`, `${c.tdp} W`, `${c.lengthMm} mm`, ...(c.fp16Tflops ? [`${c.fp16Tflops} TFLOPS FP16`] : [])]
    case 'motherboard':
      return [c.socket, c.chipset, c.formFactor, c.memoryType, `${c.memorySlots} slots · ${c.maxMemoryGB} Go max`, `${c.m2Slots}× M.2`, c.lan, ...(c.wifi ? ['Wi-Fi'] : []), ...(c.ipmi ? ['IPMI'] : [])]
    case 'ram':
      return [`${formatCapacity(c.capacityGB)} (${c.modules}×${formatCapacity(c.capacityGB / c.modules)})`, `${c.memoryType}-${c.speedMTs}`, `CL${c.casLatency}`, ...(c.registered ? ['RDIMM'] : []), ...(c.ecc ? ['ECC'] : [])]
    case 'storage':
      return [formatCapacity(c.capacityGB), c.interface, c.formFactorDrive, c.kind === 'hdd' ? `${c.rpm ?? ''} tr/min` : `${c.readMBs.toLocaleString('fr-FR')} Mo/s`, ...(c.nasRated ? ['NAS/24-7'] : [])].filter(Boolean)
    case 'psu':
      return [`${c.wattage} W`, c.efficiency, c.formFactor, c.modular === 'full' ? 'Modulaire' : c.modular === 'semi' ? 'Semi-modulaire' : 'Non modulaire', ...(c.atx31 ? ['ATX 3.1'] : [])]
    case 'case':
      return [c.type, c.supportedFormFactors.join('/'), `GPU ≤ ${c.maxGpuLengthMm} mm`, `Ventirad ≤ ${c.maxCoolerHeightMm} mm`, ...(c.driveBays35 ? [`${c.driveBays35}× 3,5"`] : [])]
    case 'cooler':
      return [c.type === 'aio' ? `AIO ${c.radiatorMm} mm` : `Air ${c.heightMm ?? '?'} mm`, `${c.maxTdp} W`, c.sockets.slice(0, 4).join(', ') + (c.sockets.length > 4 ? '…' : '')]
    case 'nic':
      return [`${c.ports}× ${c.speedGbps} Gb/s`, c.connector]
    case 'hba':
      return [c.kind === 'raid' ? 'RAID' : 'HBA', `${c.ports} ports`, c.interface]
    case 'accessory':
      return [ACCESSORY_LABELS[c.kind], ...c.specs]
  }
}

export function deviceSpecs(d: Device): string[] {
  return [
    d.cpu,
    ...(d.gpu ? [d.gpu] : []),
    `${d.ramGB} Go RAM`,
    ...(d.storageGB ? [formatCapacity(d.storageGB)] : []),
    ...(d.screenInches ? [`${d.screenInches}"${d.screenSpec ? ' ' + d.screenSpec : ''}`] : []),
    ...(d.bays ? [`${d.bays} baies`] : []),
    ...(d.batteryWh ? [`${d.batteryWh} Wh`] : []),
    ...(d.batteryMah ? [`${d.batteryMah} mAh`] : []),
    ...(d.weightKg ? [d.weightKg < 1 ? `${Math.round(d.weightKg * 1000)} g` : `${d.weightKg} kg`] : []),
    d.os,
  ]
}

export const ACCESSORY_LABELS: Record<AccessoryKind, string> = {
  monitor: 'Écran',
  keyboard: 'Clavier',
  mouse: 'Souris',
  headphones: 'Casque',
  speakers: 'Enceintes',
  webcam: 'Webcam',
  'case-fan': 'Ventilateur',
  'thermal-paste': 'Pâte thermique',
  'wifi-card': 'Carte Wi-Fi',
  'sound-card': 'Carte son',
  ups: 'Onduleur',
  os: 'Système d’exploitation',
  'external-storage': 'Stockage externe',
}

export const TIER_LABELS: Record<string, string> = {
  entry: 'Entrée de gamme',
  mainstream: 'Milieu de gamme',
  performance: 'Performance',
  enthusiast: 'Haut de gamme',
  flagship: 'Très haut de gamme',
}
