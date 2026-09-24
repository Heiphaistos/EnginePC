import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { baseComponents, baseDevices } from '../data/catalog'
import type { PCComponent } from '../types'
import { createCatalog } from './catalog'
import { autoComplete, checkBuild } from './compatibility'

const extra = (JSON.parse(readFileSync('public/data/extra-catalog.json', 'utf8')) as { components: PCComponent[] }).components
const catalog = createCatalog([...baseComponents, ...extra], baseDevices)

describe('base ouverte étendue', () => {
  it('contient des milliers de produits aux identifiants uniques', () => {
    expect(extra.length).toBeGreaterThan(5000)
    const ids = new Set(baseComponents.map((c) => c.id))
    const dupes = extra.filter((c) => (ids.has(c.id) ? true : (ids.add(c.id), false)))
    expect(dupes.map((d) => d.id)).toEqual([])
  })

  it('a des prix positifs et une source', () => {
    expect(extra.every((c) => c.price > 0 && c.source)).toBe(true)
  })

  it('permet de compléter une config autour d’une pièce de la base ouverte', () => {
    const board = extra.find((c) => c.category === 'motherboard' && c.socket === 'AM5')!
    const slots = autoComplete({ motherboard: board.id }, catalog, 'desktop')
    const errors = checkBuild(slots, catalog, 'desktop').filter((i) => i.severity === 'error')
    expect(errors).toEqual([])
    expect(slots.cpu && slots.ram && slots.psu && slots.case).toBeTruthy()
  })
})
