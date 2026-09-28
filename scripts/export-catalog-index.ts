// Génère public/data/catalog-index.json : index compact de tout le catalogue (vérifié + base ouverte).
// Il permet aux applications reliées (bot Discord HeiphaisBot, comparateur SearchIT) de retrouver le nom,
// la catégorie, l'EAN et le prix indicatif d'une pièce à partir de son identifiant EnginePC
// (par exemple pour chiffrer une configuration partagée avec /pc build).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { baseComponents, baseDevices } from '../src/data/catalog'
import { displayName } from '../src/engine/catalog'
import type { PCComponent } from '../src/types'

interface IndexItem {
  id: string
  name: string
  category: string
  brand: string
  price: number
  year?: number
  ean?: string
  mpn?: string
  kind?: string
  source?: string
}

const publicData = fileURLToPath(new URL('../public/data/', import.meta.url))

const fromComponent = (c: PCComponent): IndexItem => ({
  id: c.id,
  name: displayName(c),
  category: c.category === 'accessory' && 'kind' in c ? `accessory:${c.kind}` : c.category,
  brand: c.brand,
  price: c.price,
  year: c.releaseYear,
  ...(c.ean && { ean: c.ean }),
  ...(c.mpn && { mpn: c.mpn }),
  ...(c.source && { source: c.source }),
})

const items: IndexItem[] = [
  ...baseComponents.map(fromComponent),
  ...baseDevices.map((d) => ({
    id: d.id,
    name: displayName(d),
    category: d.deviceType,
    brand: d.brand,
    price: d.price,
    year: d.releaseYear,
    ...(d.ean && { ean: d.ean }),
  })),
]

try {
  const extra = JSON.parse(readFileSync(`${publicData}extra-catalog.json`, 'utf8')) as { components?: PCComponent[] }
  items.push(...(extra.components ?? []).map(fromComponent))
} catch {
  console.warn('extra-catalog.json absent : index limité au catalogue vérifié')
}

const seen = new Set<string>()
const unique = items.filter((i) => !seen.has(i.id) && seen.add(i.id))
writeFileSync(
  `${publicData}catalog-index.json`,
  JSON.stringify({ schema: 'enginepc.catalog-index', version: 1, generatedAt: new Date().toISOString(), count: unique.length, items: unique }),
)
console.log(`catalog-index.json : ${unique.length} produits`)
