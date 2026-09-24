import type { ComponentCategory, Device, PCComponent } from '../../types'
import { accessories } from './accessories'
import { cases } from './cases'
import { coolers } from './coolers'
import { cpus } from './cpus'
import { gpus } from './gpus'
import { hbas } from './hbas'
import { laptops } from './laptops'
import { motherboards } from './motherboards'
import { nasDevices } from './nasDevices'
import { nics } from './nics'
import { phones } from './phones'
import { psus } from './psus'
import { rams } from './rams'
import { storages } from './storages'
import { tablets } from './tablets'

export const baseComponents: PCComponent[] = [
  ...cpus,
  ...gpus,
  ...motherboards,
  ...rams,
  ...storages,
  ...psus,
  ...cases,
  ...coolers,
  ...nics,
  ...hbas,
  ...accessories,
]

export const baseDevices: Device[] = [...laptops, ...tablets, ...phones, ...nasDevices]

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  cpu: 'Processeur',
  gpu: 'Carte graphique',
  motherboard: 'Carte mère',
  ram: 'Mémoire vive',
  storage: 'Stockage',
  psu: 'Alimentation',
  case: 'Boîtier',
  cooler: 'Refroidissement',
  nic: 'Carte réseau',
  hba: 'Contrôleur HBA / RAID',
  accessory: 'Périphériques & accessoires',
}

export const CATEGORY_ORDER: ComponentCategory[] = [
  'cpu',
  'cooler',
  'motherboard',
  'ram',
  'gpu',
  'storage',
  'psu',
  'case',
  'nic',
  'hba',
]
