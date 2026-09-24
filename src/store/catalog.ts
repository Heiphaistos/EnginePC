import { baseComponents, baseDevices } from '../data/catalog'
import { createCatalog, type Catalog } from '../engine/catalog'
import type { Device, PCComponent } from '../types'
import { useStore } from './useStore'

let last: { key: unknown[]; catalog: Catalog } | null = null

/** Fusionne catalogue vérifié, base étendue (données ouvertes) et imports (partagé entre tous les composants). */
function buildCatalog(extra: PCComponent[], components: PCComponent[], devices: Device[]): Catalog {
  const key = [extra, components, devices]
  if (last && last.key.every((k, i) => k === key[i])) return last.catalog
  const comp = new Map<string, PCComponent>()
  baseComponents.forEach((c) => comp.set(c.id, c))
  extra.forEach((c) => comp.has(c.id) || comp.set(c.id, c))
  components.forEach((c) => comp.set(c.id, c))
  const dev = new Map(baseDevices.map((d) => [d.id, d]))
  devices.forEach((d) => dev.set(d.id, d))
  last = { key, catalog: createCatalog([...comp.values()], [...dev.values()]) }
  return last.catalog
}

const EMPTY: PCComponent[] = []

/** Catalogue complet : vérifié + base étendue (si activée) + imports utilisateur. */
export function useCatalog(): Catalog {
  const customComponents = useStore((s) => s.customComponents)
  const customDevices = useStore((s) => s.customDevices)
  const extra = useStore((s) => (s.useExtended ? s.extra : EMPTY))
  return buildCatalog(extra, customComponents, customDevices)
}
