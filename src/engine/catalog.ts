import type { ComponentCategory, Device, PCComponent } from '../types'

/** Vue indexée d'un catalogue, passée à toutes les fonctions du moteur (pures et testables). */
export interface Catalog {
  components: PCComponent[]
  devices: Device[]
  byId: Map<string, PCComponent>
  deviceById: Map<string, Device>
  byCategory: Map<ComponentCategory, PCComponent[]>
}

export function createCatalog(components: PCComponent[], devices: Device[]): Catalog {
  const byId = new Map<string, PCComponent>()
  const byCategory = new Map<ComponentCategory, PCComponent[]>()
  for (const c of components) {
    byId.set(c.id, c)
    const list = byCategory.get(c.category) ?? []
    list.push(c)
    byCategory.set(c.category, list)
  }
  const deviceById = new Map(devices.map((d) => [d.id, d]))
  return { components, devices, byId, deviceById, byCategory }
}

export function getOfCategory<T extends PCComponent>(catalog: Catalog, category: T['category']): T[] {
  return (catalog.byCategory.get(category) ?? []) as T[]
}

export function lookup<T extends PCComponent>(catalog: Catalog, id: string | undefined): T | undefined {
  return id ? (catalog.byId.get(id) as T | undefined) : undefined
}

export function displayName(item: { brand: string; model: string }): string {
  return item.model.toLowerCase().startsWith(item.brand.toLowerCase()) ? item.model : `${item.brand} ${item.model}`
}
