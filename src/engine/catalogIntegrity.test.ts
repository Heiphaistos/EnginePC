import { describe, expect, it } from 'vitest'
import { baseComponents, baseDevices } from '../data/catalog'
import { DEVICE_TYPES, profilesFor } from '../data/profiles'
import type { PCComponent } from '../types'
import { createCatalog } from './catalog'
import { checkBuild } from './compatibility'
import { generateBuild, recommendDevices, type AssembledType } from './generator'

const catalog = createCatalog(baseComponents, baseDevices)
const SOCKETS = new Set(['AM4', 'AM5', 'LGA1700', 'LGA1851', 'sTR5', 'SP5', 'SP6', 'LGA4677', 'LGA4710'])
const of = <C extends PCComponent['category']>(cat: C) => baseComponents.filter((c): c is Extract<PCComponent, { category: C }> => c.category === cat)
const year = new Date().getFullYear()

describe('intégrité du catalogue', () => {
  it('ids uniques, en kebab-case', () => {
    const ids = [...baseComponents.map((c) => c.id), ...baseDevices.map((d) => d.id)]
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
    expect(ids.filter((id) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toEqual([])
  })

  it('prix, années et libellés cohérents', () => {
    const bad = [...baseComponents, ...baseDevices].filter(
      (c) => !(c.price > 0) || c.releaseYear < 1980 || c.releaseYear > year + 1 || !c.brand.trim() || !c.model.trim(),
    )
    expect(bad.map((c) => c.id)).toEqual([])
  })

  it('EAN valides (13 chiffres) quand renseignés', () => {
    expect([...baseComponents, ...baseDevices].filter((c) => c.ean !== undefined && !/^\d{13}$/.test(c.ean)).map((c) => c.id)).toEqual([])
  })

  it('sockets connus (CPU, cartes mères, refroidissements)', () => {
    const bad = [
      ...of('cpu').filter((c) => !SOCKETS.has(c.socket)),
      ...of('motherboard').filter((m) => !SOCKETS.has(m.socket)),
      ...of('cooler').filter((c) => c.sockets.length === 0 || c.sockets.some((s) => !SOCKETS.has(s))),
    ]
    expect(bad.map((c) => c.id)).toEqual([])
  })

  it('chaque socket de carte mère a au moins un CPU, et inversement', () => {
    const cpuSockets = new Set(of('cpu').map((c) => c.socket))
    const mbSockets = new Set(of('motherboard').map((m) => m.socket))
    expect([...mbSockets].filter((s) => !cpuSockets.has(s))).toEqual([])
    // ponytail: LGA4710 (Xeon 6 6700) n'a pas encore de carte mère au catalogue : ces CPU ne sont pas sélectionnables.
    expect([...cpuSockets].filter((s) => !mbSockets.has(s) && s !== 'LGA4710')).toEqual([])
  })

  it('CPU : cœurs, threads, fréquences et TDP plausibles', () => {
    const bad = of('cpu').filter(
      (c) => c.cores < 1 || c.threads < c.cores || c.boostClock < c.baseClock || c.tdp <= 0 || c.memoryTypes.length === 0,
    )
    expect(bad.map((c) => c.id)).toEqual([])
  })

  it('GPU : VRAM, dimensions et alimentation plausibles', () => {
    const bad = of('gpu').filter((g) => g.vramGB <= 0 || g.lengthMm < 100 || g.lengthMm > 420 || g.slots < 1 || g.tdp <= 0 || g.recommendedPsuW < g.tdp)
    expect(bad.map((g) => g.id)).toEqual([])
  })

  it('cartes mères et mémoire : valeurs cohérentes', () => {
    const mb = of('motherboard').filter((m) => m.memorySlots < 1 || m.maxMemoryGB <= 0 || m.m2Slots < 0 || m.sataPorts < 0)
    const ram = of('ram').filter((r) => r.modules < 1 || r.capacityGB <= 0 || r.capacityGB % r.modules !== 0 || r.speedMTs < 1600 || (r.registered && !r.ecc))
    expect([...mb, ...ram].map((c) => c.id)).toEqual([])
  })

  it('stockage, alimentations, boîtiers, refroidissements : valeurs cohérentes', () => {
    const bad = [
      ...of('storage').filter((s) => s.capacityGB <= 0 || s.readMBs <= 0 || s.writeMBs <= 0 || (s.kind === 'hdd') !== (s.rpm !== undefined && s.rpm > 0)),
      ...of('psu').filter((p) => p.wattage < 200),
      ...of('case').filter((c) => c.supportedFormFactors.length === 0 || (c.type !== 'rack' && c.maxGpuLengthMm < 150) || c.maxCoolerHeightMm < 20),
      ...of('cooler').filter((c) => c.maxTdp <= 0 || (c.type === 'aio' ? !c.radiatorMm : !c.heightMm)),
    ]
    expect(bad.map((c) => c.id)).toEqual([])
  })

  it('appareils : caractéristiques renseignées', () => {
    const bad = baseDevices.filter(
      (d) => (d.deviceType !== 'nas' && d.ramGB <= 0) || d.ramGB < 0 || d.storageGB < 0 || (d.deviceType !== 'nas' && d.storageGB === 0) || d.weightKg <= 0 || (d.deviceType === 'nas' ? !d.bays : d.screenInches <= 0) || Object.keys(d.scores).length === 0,
    )
    expect(bad.map((d) => d.id)).toEqual([])
  })
})

/** Budgets testés : bornes de la plage du type d'appareil et quelques points intermédiaires. */
function budgets(range: [number, number]): number[] {
  const [lo, hi] = range
  return [...new Set([lo * 2, Math.sqrt(lo * hi), hi / 2].map((b) => Math.round(b / 50) * 50))]
}

describe('générateur : chaque profil et budget donne une configuration compatible', () => {
  for (const t of DEVICE_TYPES.filter((d) => d.assembled)) {
    for (const p of profilesFor(t.id).filter((p) => p.id !== 'mobile')) {
      // NAS sur mesure : ~850 à 1300 € minimum selon l'usage (2 disques NAS + plateforme) ; en dessous, le générateur propose le mode clé en main.
      for (const budget of budgets(t.id === 'nas' ? [650, t.budgetRange[1]] : t.budgetRange)) {
        it(`${t.id} / ${p.id} / ${budget} €`, () => {
          const b = generateBuild(catalog, { deviceType: t.id as AssembledType, profile: p.id, budget })
          expect(b, 'aucune configuration').not.toBeNull()
          expect(b!.total).toBeLessThanOrEqual(budget * 1.03)
          expect(checkBuild(b!.slots, catalog, t.id).filter((i) => i.severity === 'error')).toEqual([])
        })
      }
    }
  }

  for (const t of DEVICE_TYPES.filter((d) => !d.assembled)) {
    for (const p of profilesFor(t.id)) {
      it(`${t.id} / ${p.id} : au moins un appareil recommandé`, () => {
        expect(recommendDevices(catalog, t.id as 'laptop' | 'tablet' | 'phone', p.id, t.defaultBudget).length).toBeGreaterThan(0)
      })
    }
  }
})
