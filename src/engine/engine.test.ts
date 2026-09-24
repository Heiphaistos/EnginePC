import { describe, expect, it } from 'vitest'
import { baseComponents, baseDevices } from '../data/catalog'
import { createCatalog } from './catalog'
import { checkBuild } from './compatibility'
import { generateBuild, generateVariants, recommendDevices, type AssembledType } from './generator'
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
      expect(b!.total).toBeLessThanOrEqual(budget * 1.03)
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

describe('appareils', () => {
  it('recommande des portables gaming dans le budget', () => {
    const r = recommendDevices(catalog, 'laptop', 'gaming', 2000)
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((x) => x.device.price <= 2100)).toBe(true)
  })
})
