import type { Device, PCComponent } from '../../../types'
import { moreCases } from './cases'
import { moreCoolers } from './coolers'
import { moreCpus } from './cpus'
import { moreGpus } from './gpus'
import { moreMonitors } from './monitors'
import { moreMotherboards } from './motherboards'
import { moreNas } from './nas'
import { morePeripherals } from './peripherals'
import { morePhones } from './phones'
import { morePsus } from './psus'
import { moreRams } from './rams'
import { moreHbas, moreNics } from './server'
import { moreStorages } from './storages'
import { moreTablets } from './tablets'

/** Extension du catalogue vérifié (produits supplémentaires, même niveau de détail). */
export const moreComponents: PCComponent[] = [
  ...moreCpus,
  ...moreGpus,
  ...moreMotherboards,
  ...moreRams,
  ...moreStorages,
  ...morePsus,
  ...moreCases,
  ...moreCoolers,
  ...moreNics,
  ...moreHbas,
  ...moreMonitors,
  ...morePeripherals,
]

export const moreDevices: Device[] = [...morePhones, ...moreTablets, ...moreNas]
