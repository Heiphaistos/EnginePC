import { ExternalLink } from 'lucide-react'
import { cn } from '../lib/format'
import type { Offer } from '../services/pricing'
import { useComparatorHealth } from '../store/usePrices'

const shortDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR')

/** Origine d'un prix : offre live du comparateur (marchand, date, lien) ou prix indicatif du catalogue. */
export function PriceSource({ offer, converted, link = true, className }: { offer?: Offer; converted?: boolean; link?: boolean; className?: string }) {
  const base = cn('text-[10px] uppercase tracking-wider', className)
  if (!offer) return <span className={cn(base, 'muted')}>{converted ? 'Indicatif · converti USD' : 'Prix indicatif'}</span>
  const date = offer.updatedAt ? shortDate(offer.updatedAt) : null
  const label = `Prix live · ${offer.merchant}${date ? ` · ${date}` : ''}${offer.inStock ? '' : ' · hors stock'}`
  const title = `Meilleure offre du comparateur : ${offer.merchant}${date ? `, relevée le ${date}` : ''}${offer.shipping ? `, + ${offer.shipping} € de livraison` : ''}`
  if (!link) return <span className={cn(base, 'text-emerald-500')} title={title}>{label}</span>
  return (
    <a className={cn(base, 'inline-flex items-center gap-1 text-emerald-500 hover:underline')} href={offer.url} target="_blank" rel="noopener noreferrer" title={title}>
      {label} <ExternalLink className="h-3 w-3" aria-hidden />
      <span className="sr-only">(ouvre l’offre dans un nouvel onglet)</span>
    </a>
  )
}

/** Mention discrète quand le comparateur annonce des prix de démonstration (`GET /api/health` → `demo: true`). */
export function DemoPricesNotice({ className }: { className?: string }) {
  const health = useComparatorHealth()
  if (!health?.demo) return null
  return (
    <p className={cn('text-xs text-amber-500', className)} role="note">
      Comparateur en mode démonstration : les prix « live » affichés sont fictifs.
    </p>
  )
}
