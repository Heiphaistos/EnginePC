import { describe, expect, it } from 'vitest'
import { baseComponents, baseDevices } from '../data/catalog'
import { createCatalog, withPrices } from './catalog'
import { checkBuild } from './compatibility'
import { generateBuild, generatePricedVariants, generateVariants, recommendDevices, type AssembledType, type GeneratedBuild } from './generator'
import { lineItems, totalPrice } from './resolve'
import type { UsageProfile } from '../types'

const catalog = createCatalog(baseComponents, baseDevices)

describe('catalogue', () => {
  it('a des identifiants uniques', () => {
    const ids = [...baseComponents.map((c) => c.id), ...baseDevices.map((d) => d.id)]
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dupes).toEqual([])
  })
})

describe('compatibilité', () => {
  it('détecte un socket incompatible', () => {
    const cpu = baseComponents.find((c) => c.category === 'cpu' && c.socket === 'AM5')!
    const mb = baseComponents.find((c) => c.category === 'motherboard' && c.socket === 'LGA1700')!
    const issues = checkBuild({ cpu: cpu.id, motherboard: mb.id }, catalog)
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('Socket'))).toBe(true)
  })
})

const cases: [AssembledType, UsageProfile, number][] = [
  ['desktop', 'gaming', 800],
  ['desktop', 'gaming', 1500],
  ['desktop', 'gaming', 3000],
  ['desktop', 'gaming', 6000],
  ['desktop', 'ai', 3000],
  ['desktop', 'ai', 8000],
  ['desktop', 'workstation', 4000],
  ['desktop', 'workstation', 12000],
  ['desktop', 'office', 600],
  ['desktop', 'dev', 1500],
  ['desktop', 'streaming', 2000],
  ['server', 'virtualization', 3000],
  ['server', 'virtualization', 15000],
  ['server', 'ai', 30000],
  ['server', 'ai', 100000],
  ['server', 'homelab', 1200],
  ['nas', 'storage', 1200],
  ['nas', 'media', 2500],
]

describe('générateur', () => {
  for (const [deviceType, profile, budget] of cases) {
    it(`${deviceType} / ${profile} / ${budget} €`, () => {
      const b = generateBuild(catalog, { deviceType, profile, budget })
      expect(b, 'aucune config trouvée').not.toBeNull()
      expect(b!.total).toBeLessThanOrEqual(budget)
      const errors = checkBuild(b!.slots, catalog, deviceType).filter((i) => i.severity === 'error')
      expect(errors).toEqual([])
      if (process.env.VERBOSE) {
        const r = b!.resolved
        console.log(`${deviceType}/${profile}/${budget}: ${Math.round(b!.total)}€ score ${b!.score.toFixed(1)} | ${r.cpu?.model} | ${r.gpus.map((g) => g.chipset).join('+') || '-'} | ${r.motherboard?.model} | ${r.ram?.model} | ${r.storage.map((s) => s.model).join(', ')} | ${r.psu?.model} | ${r.case?.model} | ${r.cooler?.model}`)
      }
    })
  }

  it('produit plusieurs variantes', () => {
    const v = generateVariants(catalog, { deviceType: 'desktop', profile: 'gaming', budget: 1500 })
    expect(v.length).toBeGreaterThanOrEqual(3)
  })
})

describe('prix live plus chers que le catalogue', () => {
  // Prix live factices : +5 à +60 % selon la pièce (pseudo-aléatoire stable), RTX 4090 à 3 990 € comme en ligne.
  const hash = (id: string) => [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7)
  const live = (c: { id: string; price: number; chipset?: string }) => (/4090/.test(c.chipset ?? '') ? 3990 : c.price * (1.05 + (hash(c.id) % 56) / 100))
  for (const budget of [800, 1500, 2650, 4000]) {
    it(`budget ${budget} € respecté au prix live affiché, en peu d'allers-retours`, { timeout: 20000 }, () => {
      // Boucle de la page Générateur : prix live des pièces choisies ; si une variante dépasse son budget au prix affiché,
      // nouvelle sélection avec ces prix (dès le 2e réajustement : pièces au prix connu seulement).
      const input = { deviceType: 'desktop', profile: 'gaming', budget } as const
      const known: Record<string, number> = {}
      const shown = (b: GeneratedBuild) => totalPrice(b.resolved, (c) => known[c.id])
      let variants = generatePricedVariants(catalog, input)
      let rounds = 0
      for (; rounds < 30; rounds++) {
        const fresh = variants.flatMap((v) => lineItems(v.build.resolved)).filter(({ item }) => !(item.id in known))
        fresh.forEach(({ item }) => (known[item.id] = live(catalog.byId.get(item.id) as { id: string; price: number; chipset?: string })))
        if (!fresh.length || variants.every((v) => shown(v.build) <= v.budget)) break
        variants = generatePricedVariants(catalog, input, known, rounds >= 1)
      }
      const best = variants.find((v) => v.key === 'best')
      expect(best, 'aucune config trouvée').toBeDefined()
      expect(rounds).toBeLessThanOrEqual(3)
      variants.forEach((v) => expect(shown(v.build), v.key).toBeLessThanOrEqual(v.budget))
      if (process.env.VERBOSE) console.log(budget, 'rounds', rounds, 'priced', Object.keys(known).length, Math.round(shown(best!.build)), best!.build.resolved.gpus.map((g) => g.chipset))
    })
  }

  it('garde le prix catalogue sans offre live (null)', () => {
    const gpu = baseComponents.find((c) => c.category === 'gpu')!
    expect(withPrices(catalog, { [gpu.id]: null }).byId.get(gpu.id)!.price).toBe(gpu.price)
  })

  it("estime les pièces non interrogées à l'écart médian de leur catégorie", () => {
    const [a, b] = baseComponents.filter((c) => c.category === 'case')
    expect(withPrices(catalog, { [a.id]: a.price * 1.2 }).byId.get(b.id)!.price).toBeCloseTo(b.price * 1.2)
  })
})

describe('appareils', () => {
  it('recommande des portables gaming dans le budget', () => {
    const r = recommendDevices(catalog, 'laptop', 'gaming', 2000)
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((x) => x.device.price <= 2100)).toBe(true)
  })
})
