import { BookOpen, Columns3, ExternalLink, Info, Loader2, ShoppingCart, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Price } from './Price'
import { useEffect, useState } from 'react'
import { CATEGORY_LABELS } from '../data/catalog'
import { DEVICE_TYPE_BY_ID } from '../data/profiles'
import { displayName } from '../engine/catalog'
import { componentSpecs, deviceSpecs, TIER_LABELS } from '../lib/specs'
import { fetchWikiSummary, merchantLinks, type WikiSummary } from '../services/openData'
import { usePriceProvider } from '../store/usePrices'
import type { Device, PCComponent } from '../types'

type Item = PCComponent | Device

const isDevice = (i: Item): i is Device => 'deviceType' in i

/** Fiche produit : caractéristiques, résumé Wikipédia, liens marchands et comparateur. */
function CompareToggle({ id }: { id: string }) {
  const selected = useStore((s) => s.compareParts.includes(id))
  const count = useStore((s) => s.compareParts.length)
  const toggle = useStore((s) => s.toggleComparePart)
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <button className={selected ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'} onClick={() => toggle(id)}>
        <Columns3 className="h-3.5 w-3.5" /> {selected ? 'Dans le comparateur' : 'Ajouter au comparateur'}
      </button>
      {count > 0 && (
        <Link to="/comparer" className="text-sm text-brand-400 underline">
          Voir la comparaison ({count})
        </Link>
      )}
    </div>
  )
}

export function ProductDetails({ item, onClose }: { item: Item; onClose: () => void }) {
  const provider = usePriceProvider()
  const [wiki, setWiki] = useState<WikiSummary | null | 'loading' | 'error'>('loading')
  const name = displayName(item)
  const specs = isDevice(item) ? deviceSpecs(item) : componentSpecs(item)
  const category = isDevice(item) ? DEVICE_TYPE_BY_ID[item.deviceType].label : CATEGORY_LABELS[item.category]
  const estimated = !isDevice(item) ? item.estimated ?? [] : []
  const comparator = provider.productUrl({ id: item.id, name, category: isDevice(item) ? item.deviceType : item.category, ean: item.ean })

  useEffect(() => {
    const ctrl = new AbortController()
    const query = isDevice(item) || item.category === 'cpu' || item.category === 'gpu' ? name : `${item.brand} ${item.model.split(' ').slice(0, 3).join(' ')}`
    fetchWikiSummary(query, ctrl.signal)
      .then(setWiki)
      .catch(() => !ctrl.signal.aborted && setWiki('error'))
    // Phase de capture : Échap ferme la fiche sans fermer la fenêtre qui l'a ouverte.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      ctrl.abort()
      window.removeEventListener('keydown', onKey, true)
    }
  }, [item, name, onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:p-6"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div className="card max-h-[92vh] w-full max-w-2xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="label">
              {category} · {item.brand} · {item.releaseYear}
            </div>
            <h2 className="mt-1 text-2xl font-bold">{name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-2xl font-bold"><Price value={item.price} /></span>
              <span className="chip">{TIER_LABELS[item.tier]}</span>
              {!isDevice(item) && item.priceEstimated && <span className="chip border-amber-500/40 text-amber-400">Prix converti (USD → EUR TTC)</span>}
              {!isDevice(item) && item.source && <span className="chip">Source : {item.source}</span>}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {specs.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
        {isDevice(item) && item.highlights.length > 0 && <p className="muted mt-3 text-sm">{item.highlights.join(' · ')}</p>}
        {estimated.length > 0 && (
          <p className="mt-3 flex gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">
            <Info className="h-4 w-4 shrink-0" />
            Données issues de la base ouverte : certaines valeurs sont estimées ({estimated.join(', ')}). Les règles de compatibilité correspondantes
            sont signalées comme « à vérifier ».
          </p>
        )}

        <section className="mt-5">
          <div className="label mb-2 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> Wikipédia
          </div>
          {wiki === 'loading' ? (
            <p className="muted flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Recherche…
            </p>
          ) : wiki && wiki !== 'error' ? (
            <div className="card-soft flex gap-3 p-3">
              {wiki.thumbnail && <img src={wiki.thumbnail} alt="" className="h-20 w-20 shrink-0 rounded-lg object-contain" loading="lazy" />}
              <div className="min-w-0 text-sm">
                <div className="font-semibold">{wiki.title}</div>
                <p className="muted mt-1 line-clamp-5">{wiki.extract}</p>
                {wiki.url && (
                  <a className="mt-1 inline-flex items-center gap-1 text-xs text-brand-400" href={wiki.url} target="_blank" rel="noreferrer">
                    Lire sur Wikipédia ({wiki.lang}) <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="muted text-sm">Aucun article trouvé.</p>
          )}
        </section>

        {!isDevice(item) && <CompareToggle id={item.id} />}
        <section className="mt-5">
          <div className="label mb-2 flex items-center gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5" /> Trouver le meilleur prix
          </div>
          <div className="flex flex-wrap gap-2">
            {comparator && (
              <a className="btn btn-primary btn-sm" href={comparator} target="_blank" rel="noreferrer">
                Notre comparateur <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {merchantLinks(name).map((m) => (
              <a key={m.label} className="btn btn-ghost btn-sm" href={m.url} target="_blank" rel="noreferrer nofollow">
                {m.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
