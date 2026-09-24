import { useStore } from '../store/useStore'
import { breakdown, effectiveVat, type Breakdown, type PriceMode } from './tax'

const formatters = new Map<string, Intl.NumberFormat>()

function money(eur: number): string {
  const { priceSettings, rates } = useStore.getState()
  const currency = rates.rates[priceSettings.currency] ? priceSettings.currency : 'EUR'
  let f = formatters.get(currency)
  if (!f) {
    f = new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 })
    formatters.set(currency, f)
  }
  return f.format(Math.round(eur * (rates.rates[currency] ?? 1)))
}

export function priceMode(): PriceMode {
  return useStore.getState().priceSettings.priceMode ?? 'ttc'
}

export function vatRate(): number {
  return effectiveVat(useStore.getState().priceSettings)
}

/** Décomposition HT / TVA / TTC d'un prix catalogue (TTC France) selon les paramètres de TVA. */
export function priceBreakdown(catalogTtc: number): Breakdown {
  return breakdown(catalogTtc, vatRate())
}

/**
 * Prix principal affiché selon le mode choisi (Paramètres ou bouton HT/TTC de l'en-tête).
 * Les montants sont stockés en EUR TTC France et convertis dans la devise choisie.
 */
export function formatPrice(catalogTtc: number): string {
  const b = priceBreakdown(catalogTtc)
  const mode = priceMode()
  if (mode === 'ht') return `${money(b.ht)} HT`
  if (mode === 'both') return `${money(b.ttc)} TTC`
  return money(b.ttc)
}

/** Prix secondaire (HT quand le TTC est affiché en mode « les deux », TTC en mode HT). */
export function formatSecondaryPrice(catalogTtc: number): string | null {
  const b = priceBreakdown(catalogTtc)
  const mode = priceMode()
  if (mode === 'both') return `${money(b.ht)} HT`
  if (mode === 'ht') return `${money(b.ttc)} TTC`
  return null
}

export const formatHT = (catalogTtc: number) => `${money(priceBreakdown(catalogTtc).ht)} HT`
export const formatTTC = (catalogTtc: number) => `${money(priceBreakdown(catalogTtc).ttc)} TTC`
export const formatVatAmount = (catalogTtc: number) => money(priceBreakdown(catalogTtc).vat)
export const formatMoney = money

export function formatCapacity(gb: number): string {
  if (gb >= 1000) {
    const tb = gb / 1000
    return `${Number.isInteger(tb) ? tb : tb.toFixed(tb < 10 ? 2 : 1).replace(/\.?0+$/, '')} To`
  }
  return `${gb} Go`
}

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')
