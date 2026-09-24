import { describe, expect, it } from 'vitest'
import { baseComponents, baseDevices } from '../data/catalog'
import { analyzeBottleneck, estimateEnergy, suggestUpgrades } from './advice'
import { createCatalog } from './catalog'
import { checkBuild } from './compatibility'
import { generateBuild } from './generator'
import { resolveBuild } from './resolve'

const catalog = createCatalog(baseComponents, baseDevices)

describe('conseils', () => {
  it('détecte un processeur qui bride la carte graphique', () => {
    const b = resolveBuild({ cpu: 'intel-core-i3-14100f', gpu: ['nvidia-rtx-5090-fe'] }, catalog)
    expect(b.cpu && b.gpus.length).toBeTruthy()
    expect(analyzeBottleneck(b)?.limitedBy).toBe('cpu')
  })

  it('propose des remplacements compatibles', () => {
    const g = generateBuild(catalog, { deviceType: 'desktop', profile: 'gaming', budget: 1500 })!
    const s = suggestUpgrades(g.slots, catalog, 'desktop', 'gaming')
    expect(s.length).toBeGreaterThan(0)
    for (const x of s) {
      const slots = { ...g.slots }
      if (x.category === 'gpu' || x.category === 'storage') slots[x.category] = (slots[x.category] ?? []).map((id) => (id === x.from.id ? x.to.id : id))
      else (slots as Record<string, unknown>)[x.category] = x.to.id
      expect(checkBuild(slots, catalog, 'desktop').filter((i) => i.severity === 'error')).toEqual([])
    }
  })

  it('estime le coût électrique', () => {
    const g = generateBuild(catalog, { deviceType: 'desktop', profile: 'gaming', budget: 1500 })!
    const e = estimateEnergy(g.resolved, 4, 0.2)
    expect(e.costPerYear).toBe(Math.round(e.kWhPerYear * 0.2))
    expect(e.kWhPerYear).toBeGreaterThan(100)
  })
})
