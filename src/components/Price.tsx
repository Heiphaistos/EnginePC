import { cn, formatMoney, formatPrice, formatSecondaryPrice, priceBreakdown } from '../lib/format'

/** Prix principal + prix secondaire (HT ou TTC) selon le mode d'affichage. */
export function Price({ value, className, subClassName }: { value: number; className?: string; subClassName?: string }) {
  const sub = formatSecondaryPrice(value)
  return (
    <span className="inline-flex flex-col leading-tight">
      <span className={cn('tabular-nums', className)}>{formatPrice(value)}</span>
      {sub && <span className={cn('muted text-xs font-normal tabular-nums', subClassName)}>{sub}</span>}
    </span>
  )
}

/** Tableau HT / TVA / TTC d'un montant. */
export function PriceBreakdown({ value, className }: { value: number; className?: string }) {
  const b = priceBreakdown(value)
  return (
    <dl className={cn('grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm tabular-nums', className)}>
      <dt className="muted">Total HT</dt>
      <dd className="text-right font-medium">{formatMoney(b.ht)}</dd>
      <dt className="muted">TVA {b.rate.toLocaleString('fr-FR')} %</dt>
      <dd className="text-right font-medium">{formatMoney(b.vat)}</dd>
      <dt className="font-semibold">Total TTC</dt>
      <dd className="text-right font-bold">{formatMoney(b.ttc)}</dd>
    </dl>
  )
}
