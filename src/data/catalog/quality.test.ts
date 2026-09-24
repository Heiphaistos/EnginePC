import { describe, expect, it } from 'vitest'
import type { Device, PCComponent } from '../../types'
import { baseComponents, baseDevices } from './index'

const SOCKETS = new Set(['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'sTR5', 'SP5', 'SP6', 'LGA4677', 'LGA4710'])
const FORM_FACTORS = new Set(['E-ATX', 'ATX', 'mATX', 'ITX', 'SSI-EEB', 'Rack-1U', 'Rack-2U', 'Rack-4U'])
const TIERS = new Set(['entry', 'mainstream', 'performance', 'enthusiast', 'flagship'])
const score = (v: unknown) => typeof v === 'number' && v >= 0 && v <= 100

/** Renvoie la liste des problèmes d'un composant (vide = OK). */
function componentProblems(c: PCComponent): string[] {
  const p: string[] = []
  if (!c.id || !c.brand || !c.model) p.push('champ manquant')
  if (!(c.price > 0 && c.price < 200000)) p.push(`prix ${c.price}`)
  // Certains périphériques de référence sont anciens (ex. casque DT 770 Pro, 1985).
  if (!(c.releaseYear >= (c.category === 'accessory' ? 1980 : 2010) && c.releaseYear <= 2026)) p.push(`année ${c.releaseYear}`)
  if (!TIERS.has(c.tier)) p.push(`gamme ${c.tier}`)
  switch (c.category) {
    case 'cpu':
      if (!SOCKETS.has(c.socket)) p.push(`socket ${c.socket}`)
      if (!(c.cores > 0 && c.threads >= c.cores)) p.push('cœurs/threads')
      if (!score(c.singleThreadScore) || !score(c.multiThreadScore)) p.push('scores')
      if (!c.memoryTypes.length) p.push('mémoire')
      break
    case 'gpu':
      if (!score(c.gamingScore) || !score(c.aiScore)) p.push('scores')
      if (!(c.vramGB > 0 && c.tdp > 0 && c.lengthMm > 0)) p.push('specs')
      break
    case 'motherboard':
      if (!SOCKETS.has(c.socket)) p.push(`socket ${c.socket}`)
      if (!FORM_FACTORS.has(c.formFactor)) p.push(`format ${c.formFactor}`)
      if (!(c.memorySlots > 0 && c.maxMemoryGB > 0)) p.push('mémoire')
      break
    case 'ram':
      if (!(c.capacityGB > 0 && c.modules > 0 && c.capacityGB % c.modules === 0)) p.push('capacité/barrettes')
      if (c.registered && !c.ecc) p.push('RDIMM sans ECC')
      break
    case 'storage':
      if (!(c.capacityGB > 0 && c.readMBs > 0)) p.push('specs')
      if (c.kind === 'hdd' && c.formFactorDrive === 'M.2 2280') p.push('HDD M.2')
      break
    case 'psu':
      if (!(c.wattage >= 200 && c.wattage <= 5000)) p.push(`puissance ${c.wattage}`)
      break
    case 'case':
      if (!c.supportedFormFactors.length || c.supportedFormFactors.some((f) => !FORM_FACTORS.has(f))) p.push('formats')
      break
    case 'cooler':
      if (!c.sockets.length || c.sockets.some((s) => !SOCKETS.has(s))) p.push(`sockets ${c.sockets.join(',')}`)
      if (!(c.maxTdp > 0)) p.push('TDP')
      break
    case 'accessory':
      if (!Array.isArray(c.specs)) p.push('specs')
      break
  }
  return p
}

function deviceProblems(d: Device): string[] {
  const p: string[] = []
  if (!(d.price > 0)) p.push(`prix ${d.price}`)
  if (!(d.releaseYear >= 2015 && d.releaseYear <= 2026)) p.push(`année ${d.releaseYear}`)
  if (!Object.values(d.scores).every(score)) p.push('scores')
  if (!Object.keys(d.scores).length) p.push('aucun score')
  if (d.deviceType === 'nas' && !d.bays) p.push('baies')
  return p
}

describe('qualité du catalogue vérifié', () => {
  it('composants cohérents', () => {
    const bad = baseComponents.map((c) => [c.id, componentProblems(c)] as const).filter(([, p]) => p.length)
    expect(bad).toEqual([])
  })

  it('appareils cohérents', () => {
    const bad = baseDevices.map((d) => [d.id, deviceProblems(d)] as const).filter(([, p]) => p.length)
    expect(bad).toEqual([])
  })

  it('aucun doublon de modèle', () => {
    const key = (x: { brand: string; model: string }) => `${x.brand} ${x.model}`.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]/g, '')
    const seen = new Map<string, string>()
    const dupes: string[] = []
    for (const x of [...baseComponents, ...baseDevices]) {
      const k = `${'category' in x ? x.category : x.deviceType}:${key(x)}`
      if (seen.has(k)) dupes.push(`${seen.get(k)} ≈ ${x.id}`)
      else seen.set(k, x.id)
    }
    expect(dupes).toEqual([])
  })
})
