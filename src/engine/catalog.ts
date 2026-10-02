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

/**
 * Même catalogue aux prix du marché, pour que le générateur choisisse avec les prix qui seront affichés.
 * `prices` : prix live connu, ou `null` = pas d'offre live (prix catalogue gardé).
 * Les pièces pas encore interrogées sont estimées au prix catalogue × l'écart médian live/catalogue constaté
 * dans leur catégorie (entre ×1 et ×1,5, pour qu'une pièce rare comme une RTX 4090 épuisée ne renchérisse pas toute la catégorie) : sans cela, chaque tour remplace une pièce trop chère par une autre
 * encore au prix catalogue et il faut des dizaines d'allers-retours avec le comparateur.
 * `knownOnly` : pièces non interrogées hors de prix, la sélection ne garde que des prix connus (dernier tour, sans nouvel appel).
 */
export function withPrices(catalog: Catalog, prices: Record<string, number | null>, knownOnly = false): Catalog {
  const ratios = new Map<string, number[]>()
  for (const [id, live] of Object.entries(prices)) {
    const c = catalog.byId.get(id)
    if (c && live != null && c.price > 0) ratios.set(c.category, [...(ratios.get(c.category) ?? []), live / c.price])
  }
  if (!Object.keys(prices).length) return catalog
  const factor = new Map([...ratios].map(([cat, r]) => [cat, Math.min(1.5, Math.max(1, r.sort((a, b) => a - b)[Math.floor(r.length / 2)]))]))
  return createCatalog(
    catalog.components.map((c) => {
      const price = c.id in prices ? (prices[c.id] ?? c.price) : c.price * (factor.get(c.category) ?? 1) * (knownOnly ? 100 : 1)
      return price === c.price ? c : { ...c, price }
    }),
    catalog.devices,
  )
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
