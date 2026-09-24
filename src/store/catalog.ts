import { baseComponents, baseDevices } from '../data/catalog'
import { createCatalog, type Catalog } from '../engine/catalog'
import type { Device, PCComponent } from '../types'
import { useStore } from './useStore'

let last: { components: PCComponent[]; devices: Device[]; catalog: Catalog } | null = null

/** Fusionne catalogue de base et imports (partagé entre tous les composants React). */
function buildCatalog(components: PCComponent[], devices: Device[]): Catalog {
  if (last && last.components === components && last.devices === devices) return last.catalog
  const comp = new Map(baseComponents.map((c) => [c.id, c]))
  components.forEach((c) => comp.set(c.id, c))
  const dev = new Map(baseDevices.map((d) => [d.id, d]))
  devices.forEach((d) => dev.set(d.id, d))
  last = { components, devices, catalog: createCatalog([...comp.values()], [...dev.values()]) }
  return last.catalog
}

/** Catalogue de base + composants importés / synchronisés (les imports écrasent par id). */
export function useCatalog(): Catalog {
  const customComponents = useStore((s) => s.customComponents)
  const customDevices = useStore((s) => s.customDevices)
  return buildCatalog(customComponents, customDevices)
}
