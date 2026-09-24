import type { BuildSlots, ComponentCategory, DeviceType, PCComponent, UsageProfile } from '../types'
import type { Catalog } from './catalog'
import { candidateErrors } from './compatibility'
import { estimatePowerW, resolveBuild, totalPrice, type ResolvedBuild } from './resolve'
import { cpuGamingIndex, scoreResolved } from './scoring'

export interface Bottleneck {
  limitedBy: 'cpu' | 'gpu' | 'balanced'
  /** Part de performance GPU perdue à cause du CPU (0-1), en 1080p et 1440p. */
  loss1080: number
  loss1440: number
  message: string
}

/** Détecte si le processeur bride la carte graphique en jeu. */
export function analyzeBottleneck(b: ResolvedBuild): Bottleneck | null {
  if (!b.cpu || !b.gpus.length) return null
  const gpu = Math.max(...b.gpus.map((g) => g.gamingScore))
  if (gpu < 5) return null
  const cpuFps = cpuGamingIndex(b.cpu) * 2.0
  const loss = (mult: number) => Math.max(0, 1 - cpuFps / (gpu * mult))
  const loss1080 = loss(2.6)
  const loss1440 = loss(1.85)
  if (loss1440 > 0.08)
    return { limitedBy: 'cpu', loss1080, loss1440, message: `Le processeur limite la carte graphique : ~${Math.round(loss1440 * 100)} % de performances perdues en 1440p (${Math.round(loss1080 * 100)} % en 1080p).` }
  if (loss1080 > 0.1)
    return { limitedBy: 'balanced', loss1080, loss1440, message: `Configuration équilibrée en 1440p/4K ; en 1080p le processeur bride le GPU d’environ ${Math.round(loss1080 * 100)} %.` }
  return { limitedBy: 'gpu', loss1080, loss1440, message: 'Configuration équilibrée : la carte graphique est exploitée pleinement.' }
}

export interface Suggestion {
  kind: 'upgrade' | 'saving'
  category: ComponentCategory
  from: PCComponent
  to: PCComponent
  /** Différence de prix (positive = plus cher). */
  priceDelta: number
  scoreDelta: number
  newScore: number
}

const ADVISED: ComponentCategory[] = ['cpu', 'gpu', 'ram', 'storage']

function replaceSlot(slots: BuildSlots, from: PCComponent, to: PCComponent): BuildSlots {
  if (to.category === 'gpu' || to.category === 'storage') {
    const list = [...(slots[to.category] ?? [])]
    const i = list.indexOf(from.id)
    if (i >= 0) list[i] = to.id
    return { ...slots, [to.category]: list }
  }
  return { ...slots, [to.category]: to.id }
}

/**
 * Propose les meilleurs remplacements d'un composant : gains de score au meilleur coût,
 * et équivalents moins chers à performances quasi identiques.
 */
export function suggestUpgrades(slots: BuildSlots, catalog: Catalog, deviceType: DeviceType, profile: UsageProfile, limit = 4): Suggestion[] {
  const base = resolveBuild(slots, catalog)
  const baseScore = scoreResolved(base, profile)
  const basePrice = totalPrice(base)
  const out: Suggestion[] = []
  for (const cat of ADVISED) {
    const current: PCComponent[] =
      cat === 'gpu' ? base.gpus.slice(0, 1) : cat === 'storage' ? base.storage.slice(0, 1) : cat === 'cpu' && base.cpu ? [base.cpu] : cat === 'ram' && base.ram ? [base.ram] : []
    for (const from of current) {
      let bestUp: Suggestion | null = null
      let bestSave: Suggestion | null = null
      for (const to of catalog.byCategory.get(cat) ?? []) {
        if (to.id === from.id) continue
        // Évite les centaines de variantes quasi identiques : on reste sur les produits vérifiés, plus fiables.
        if (to.source) continue
        // RAM et stockage : jamais de capacité inférieure (une « économie » qui retire de l'espace n'en est pas une).
        if ((to.category === 'ram' || to.category === 'storage') && to.capacityGB < (from as { capacityGB: number }).capacityGB) continue
        if (to.category === 'storage' && from.category === 'storage' && to.kind !== from.kind) continue
        const next = replaceSlot(slots, from, to)
        if (candidateErrors(to, next, catalog, deviceType).length) continue
        const r = resolveBuild(next, catalog)
        const score = scoreResolved(r, profile)
        const priceDelta = totalPrice(r) - basePrice
        const scoreDelta = score - baseScore
        const s: Suggestion = { kind: 'upgrade', category: cat, from, to, priceDelta, scoreDelta, newScore: score }
        if (scoreDelta >= 2 && priceDelta > 0) {
          const eff = scoreDelta / priceDelta
          if (!bestUp || eff > bestUp.scoreDelta / bestUp.priceDelta) bestUp = s
        }
        if (priceDelta <= -20 && scoreDelta >= -0.5) {
          if (!bestSave || priceDelta < bestSave.priceDelta) bestSave = { ...s, kind: 'saving' }
        }
      }
      if (bestUp) out.push(bestUp)
      if (bestSave) out.push(bestSave)
    }
  }
  return out
    .sort((a, b) => (a.kind === b.kind ? (a.kind === 'saving' ? a.priceDelta - b.priceDelta : b.scoreDelta / b.priceDelta - a.scoreDelta / a.priceDelta) : a.kind === 'saving' ? -1 : 1))
    .slice(0, limit)
}

export interface EnergyEstimate {
  /** Consommation moyenne pendant l'utilisation (W). */
  averageW: number
  kWhPerYear: number
  costPerYear: number
}

/** Coût électrique annuel : consommation moyenne ≈ 60 % de la pointe pendant les heures d'utilisation. */
export function estimateEnergy(b: ResolvedBuild, hoursPerDay: number, kWhPrice: number): EnergyEstimate {
  const averageW = Math.round(estimatePowerW(b) * 0.6)
  const kWhPerYear = Math.round((averageW * hoursPerDay * 365) / 1000)
  return { averageW, kWhPerYear, costPerYear: Math.round(kWhPerYear * kWhPrice) }
}
