import { Columns3, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Price } from '../components/Price'
import { CATEGORY_LABELS } from '../data/catalog'
import { displayName } from '../engine/catalog'
import { bestIndexes, SPEC_ROWS } from '../lib/compareSpecs'
import { cn } from '../lib/format'
import { componentSpecs, TIER_LABELS } from '../lib/specs'
import { useCatalog } from '../store/catalog'
import { useStore } from '../store/useStore'
import type { ComponentCategory, PCComponent } from '../types'

/** Comparaison côte à côte de composants (jusqu'à 4), meilleures valeurs mises en évidence. */
export function Compare() {
  const catalog = useCatalog()
  const ids = useStore((s) => s.compareParts)
  const toggle = useStore((s) => s.toggleComparePart)
  const clear = useStore((s) => s.clearCompareParts)
  const extraStatus = useStore((s) => s.extraMeta.status)
  const items = ids.map((id) => catalog.byId.get(id)).filter((c): c is PCComponent => !!c)
  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Columns3 className="h-7 w-7 text-brand-400" /> Comparer des composants
          </h1>
          <p className="muted mt-1">Ajoutez jusqu’à 4 composants depuis le catalogue ou leur fiche produit.</p>
        </div>
        {items.length > 0 && (
          <button className="btn btn-ghost" onClick={clear}>
            <Trash2 className="h-4 w-4" /> Vider
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="font-semibold">{ids.length && extraStatus === 'loading' ? 'Chargement…' : 'Aucun composant à comparer.'}</p>
          <Link to="/catalogue" className="btn btn-primary mt-4">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        categories.map((cat) => <CategoryTable key={cat} category={cat} items={items.filter((i) => i.category === cat)} onRemove={toggle} />)
      )}
    </div>
  )
}

function CategoryTable({ category, items, onRemove }: { category: ComponentCategory; items: PCComponent[]; onRemove: (id: string) => void }) {
  const rows = SPEC_ROWS[category] ?? []
  const priceBest = bestIndexes(
    items.map((i) => i.price),
    'lower',
  )
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-semibold">{CATEGORY_LABELS[category]}</h2>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-[var(--bg-soft)]">
              <th className="w-48 px-4 py-3" />
              {items.map((i) => (
                <th key={i.id} className="px-4 py-3 text-left align-top">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{displayName(i)}</div>
                      <div className="muted text-xs font-normal">
                        {TIER_LABELS[i.tier]} · {i.releaseYear}
                        {i.source && ' · base ouverte'}
                      </div>
                    </div>
                    <button className="muted hover:text-red-400" onClick={() => onRemove(i.id)} aria-label="Retirer">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            <tr>
              <td className="muted px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">Prix</td>
              {items.map((i, k) => (
                <td key={i.id} className={cn('px-4 py-2.5 font-semibold', priceBest.has(k) && 'text-emerald-400')}>
                  <Price value={i.price} />
                </td>
              ))}
            </tr>
            {rows.map((r) => {
              const values = items.map((i) => r.value(i))
              if (values.every((v) => v === undefined || v === '')) return null
              const best = bestIndexes(values, r.better)
              return (
                <tr key={r.label}>
                  <td className="muted px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">{r.label}</td>
                  {values.map((v, k) => (
                    <td key={items[k].id} className={cn('px-4 py-2.5 tabular-nums', best.has(k) && 'font-semibold text-emerald-400')}>
                      {v === undefined || v === '' ? '—' : typeof v === 'number' ? v.toLocaleString('fr-FR') : v}
                    </td>
                  ))}
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td className="muted px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">Caractéristiques</td>
                {items.map((i) => (
                  <td key={i.id} className="px-4 py-2.5">
                    {componentSpecs(i).join(' · ')}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
