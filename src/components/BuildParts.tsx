import { ExternalLink } from 'lucide-react'
import { CATEGORY_LABELS } from '../data/catalog'
import { displayName } from '../engine/catalog'
import { lineItems, type ResolvedBuild } from '../engine/resolve'
import { formatPrice } from '../lib/format'
import { componentSpecs } from '../lib/specs'
import { usePriceProvider } from '../store/usePrices'
import type { PCComponent } from '../types'
import { CategoryIcon } from './Icon'

/** Liste compacte des composants d'une configuration (lecture seule). */
export function BuildParts({ resolved, price, specs = true }: { resolved: ResolvedBuild; price?: (c: PCComponent) => number; specs?: boolean }) {
  const provider = usePriceProvider()
  return (
    <ul className="flex flex-col divide-y divide-[var(--border)]">
      {lineItems(resolved).map(({ item, qty }) => {
        const link = provider.productUrl({ id: item.id, name: displayName(item), category: item.category, ean: item.ean, mpn: item.mpn })
        return (
          <li key={item.id} className="flex items-center gap-3 py-2">
            <CategoryIcon category={item.category} className="h-4 w-4 shrink-0 text-brand-400" />
            <div className="min-w-0 flex-1">
              <div className="muted text-[11px] uppercase tracking-wider">{CATEGORY_LABELS[item.category]}</div>
              <div className="truncate text-sm font-medium">
                {qty > 1 && <span className="text-brand-400">{qty}× </span>}
                {displayName(item)}
              </div>
              {specs && <div className="muted truncate text-xs">{componentSpecs(item).slice(0, 4).join(' · ')}</div>}
            </div>
            <div className="text-right text-sm font-semibold tabular-nums">{formatPrice((price ?? ((c) => c.price))(item) * qty)}</div>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="muted hover:text-brand-400" title="Voir les prix">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}
