const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export const formatPrice = (v: number) => eur.format(Math.round(v))

export function formatCapacity(gb: number): string {
  if (gb >= 1000) {
    const tb = gb / 1000
    return `${Number.isInteger(tb) ? tb : tb.toFixed(tb < 10 ? 2 : 1).replace(/\.?0+$/, '')} To`
  }
  return `${gb} Go`
}

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}
