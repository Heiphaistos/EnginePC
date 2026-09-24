import { useStore } from '../store/useStore'

const formatters = new Map<string, Intl.NumberFormat>()

/** Formate un prix stocké en EUR dans la devise choisie (Paramètres), avec les taux BCE du jour. */
export function formatPrice(eurValue: number): string {
  const { priceSettings, rates } = useStore.getState()
  const currency = rates.rates[priceSettings.currency] ? priceSettings.currency : 'EUR'
  let f = formatters.get(currency)
  if (!f) {
    f = new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 })
    formatters.set(currency, f)
  }
  return f.format(Math.round(eurValue * (rates.rates[currency] ?? 1)))
}

export function formatCapacity(gb: number): string {
  if (gb >= 1000) {
    const tb = gb / 1000
    return `${Number.isInteger(tb) ? tb : tb.toFixed(tb < 10 ? 2 : 1).replace(/\.?0+$/, '')} To`
  }
  return `${gb} Go`
}

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')
