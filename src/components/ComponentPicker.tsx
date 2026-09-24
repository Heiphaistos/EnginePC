import { AlertTriangle, Check, Info, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CATEGORY_LABELS } from '../data/catalog'
import { displayName } from '../engine/catalog'
import { candidateErrors } from '../engine/compatibility'
import { cn, formatPrice } from '../lib/format'
import { ACCESSORY_LABELS, componentSpecs, TIER_LABELS } from '../lib/specs'
import { useCatalog } from '../store/catalog'
import { useLivePrices } from '../store/usePrices'
import type { AccessoryKind, BuildSlots, ComponentCategory, DeviceType, PCComponent, UsageProfile } from '../types'
import { CategoryIcon } from './Icon'
import { ProductDetails } from './ProductDetails'

type SortKey = 'perf' | 'price-asc' | 'price-desc' | 'recent'

function perfKey(c: PCComponent, profile: UsageProfile): number {
  switch (c.category) {
    case 'cpu':
      return profile === 'gaming' ? c.singleThreadScore : c.multiThreadScore * 3 + c.singleThreadScore
    case 'gpu':
      return profile === 'ai' ? c.aiScore * 2 + c.vramGB : c.gamingScore
    case 'ram':
      return c.capacityGB * 10 + c.speedMTs / 1000
    case 'storage':
      return c.capacityGB + c.readMBs / 100
    case 'psu':
      return c.wattage
    case 'cooler':
      return c.maxTdp
    case 'nic':
      return c.speedGbps * c.ports
    case 'hba':
      return c.ports
    case 'motherboard':
      return c.price
    case 'case':
      return c.maxGpuLengthMm + c.driveBays35 * 10
    case 'accessory':
      return (c.refreshHz ?? 0) * 10 + (c.resolutionY ?? 0) + c.price / 1000
  }
}

interface Props {
  category: ComponentCategory
  slots: BuildSlots
  deviceType: DeviceType
  profile: UsageProfile
  selectedId?: string
  onPick: (c: PCComponent) => void
  onClose: () => void
}

export function ComponentPicker({ category, slots, deviceType, profile, selectedId, onPick, onClose }: Props) {
  const catalog = useCatalog()
  const all = useMemo(() => catalog.byCategory.get(category) ?? [], [catalog, category])
  const [q, setQ] = useState('')
  const [brand, setBrand] = useState('')
  const [sort, setSort] = useState<SortKey>('perf')
  const [onlyCompatible, setOnlyCompatible] = useState(true)
  const [segment, setSegment] = useState<'all' | 'consumer' | 'pro'>(deviceType === 'server' ? 'all' : 'all')
  const [maxPrice, setMaxPrice] = useState(0)
  const [origin, setOrigin] = useState<'all' | 'verified' | 'open'>('all')
  const [kind, setKind] = useState<AccessoryKind | ''>('')
  const [limit, setLimit] = useState(150)
  const [details, setDetails] = useState<PCComponent | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const brands = useMemo(() => [...new Set(all.map((c) => c.brand))].sort(), [all])
  const rows = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return all
      .filter((c) => !brand || c.brand === brand)
      .filter((c) => {
        if (segment === 'all') return true
        const pro = c.segment === 'server' || c.segment === 'workstation'
        return segment === 'pro' ? pro : !pro
      })
      .filter((c) => !maxPrice || c.price <= maxPrice)
      .filter((c) => origin === 'all' || (origin === 'open' ? !!c.source : !c.source))
      .filter((c) => !kind || (c.category === 'accessory' && c.kind === kind))
      .filter((c) => {
        if (!words.length) return true
        const hay = `${c.brand} ${c.model} ${componentSpecs(c).join(' ')}`.toLowerCase()
        return words.every((w) => hay.includes(w))
      })
      .map((c) => ({ c, errors: candidateErrors(c, slots, catalog, deviceType) }))
      .filter((r) => !onlyCompatible || r.errors.length === 0)
      .sort((a, b) => {
        switch (sort) {
          case 'price-asc':
            return a.c.price - b.c.price
          case 'price-desc':
            return b.c.price - a.c.price
          case 'recent':
            return b.c.releaseYear - a.c.releaseYear || b.c.price - a.c.price
          default:
            return perfKey(b.c, profile) - perfKey(a.c, profile) || a.c.price - b.c.price
        }
      })
  }, [all, brand, segment, maxPrice, origin, kind, q, slots, catalog, deviceType, onlyCompatible, sort, profile])

  const visible = rows.slice(0, limit)
  const kinds = useMemo(
    () => [...new Set(all.map((c) => (c.category === 'accessory' ? c.kind : null)).filter((k): k is AccessoryKind => !!k))],
    [all],
  )
  const prices = useLivePrices(visible.map((r) => r.c))
  const maxAll = Math.max(0, ...all.map((c) => c.price))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:p-6" onClick={onClose}>
      <div className="card flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden md:h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-[var(--border)] p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
            <CategoryIcon category={category} className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Choisir : {CATEGORY_LABELS[category]}</h2>
            <p className="muted text-xs">
              {rows.length} résultat(s) sur {all.length} · compatibilité vérifiée en temps réel
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-2 border-b border-[var(--border)] p-4 md:grid-cols-[1fr_auto_auto] lg:grid-cols-[1fr_auto_auto_auto_auto]">
          <label className="relative">
            <Search className="muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input autoFocus className="input pl-9" placeholder="Rechercher un modèle, une spec (ex: 16 Go, AM5, 4.0)…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <select className="input md:w-40" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">Toutes marques</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select className="input md:w-44" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="perf">Tri : performance</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="recent">Plus récents</option>
          </select>
          <select className="input md:w-40" value={segment} onChange={(e) => setSegment(e.target.value as typeof segment)}>
            <option value="all">Tous segments</option>
            <option value="consumer">Grand public</option>
            <option value="pro">Pro / serveur</option>
          </select>
          <select className="input md:w-48" value={origin} onChange={(e) => setOrigin(e.target.value as typeof origin)}>
            <option value="all">Toutes les sources</option>
            <option value="verified">Catalogue vérifié</option>
            <option value="open">Base ouverte (étendue)</option>
          </select>
          {kinds.length > 0 && (
            <select className="input md:w-48" value={kind} onChange={(e) => setKind(e.target.value as AccessoryKind | '')}>
              <option value="">Tous les types</option>
              {kinds.map((k) => (
                <option key={k} value={k}>
                  {ACCESSORY_LABELS[k]}
                </option>
              ))}
            </select>
          )}
          <div className="flex flex-wrap items-center gap-4 md:col-span-3 lg:col-span-5">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={onlyCompatible} onChange={(e) => setOnlyCompatible(e.target.checked)} />
              Compatibles uniquement
            </label>
            <label className="flex flex-1 items-center gap-3 text-sm">
              <span className="muted whitespace-nowrap">Prix max</span>
              <input type="range" min={0} max={maxAll} step={10} value={maxPrice || maxAll} onChange={(e) => setMaxPrice(Number(e.target.value) >= maxAll ? 0 : Number(e.target.value))} className="flex-1" />
              <span className="w-20 text-right tabular-nums">{maxPrice ? formatPrice(maxPrice) : 'Aucun'}</span>
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {visible.length === 0 && (
            <div className="muted p-10 text-center">
              Aucun composant ne correspond. {onlyCompatible && 'Essayez de désactiver le filtre « Compatibles uniquement ».'}
            </div>
          )}
          <ul className="grid gap-1.5">
            {visible.map(({ c, errors }) => {
              const selected = c.id === selectedId
              const live = prices.isLive(c.id)
              return (
                <li key={c.id} className="flex items-stretch gap-1.5">
                  <button
                    onClick={() => onPick(c)}
                    className={cn(
                      'card-soft group flex min-w-0 flex-1 items-center gap-4 p-3 text-left transition hover:border-brand-500',
                      selected && 'border-brand-500 ring-1 ring-brand-500',
                      errors.length > 0 && 'opacity-70',
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{displayName(c)}</span>
                        <span className="chip">{TIER_LABELS[c.tier]}</span>
                        {c.source && <span className="chip border-accent-500/40 text-accent-400">Base ouverte</span>}
                        <span className="muted text-xs">{c.releaseYear}</span>
                        {selected && (
                          <span className="chip border-brand-500 text-brand-400">
                            <Check className="h-3 w-3" /> Sélectionné
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {componentSpecs(c).map((s) => (
                          <span key={s} className="chip">
                            {s}
                          </span>
                        ))}
                      </div>
                      {errors.length > 0 && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {errors[0].message}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold tabular-nums">{formatPrice(prices.price(c))}</div>
                      <div className={cn('text-[10px] uppercase tracking-wider', live ? 'text-emerald-400' : 'muted')}>{live ? 'Prix live' : c.priceEstimated ? 'Converti USD' : 'Indicatif'}</div>
                    </div>
                  </button>
                  <button className="card-soft muted px-2 hover:border-brand-500 hover:text-brand-400" onClick={() => setDetails(c)} aria-label="Fiche produit" title="Fiche produit">
                    <Info className="h-4 w-4" />
                  </button>
                </li>
              )
            })}
          </ul>
          {rows.length > visible.length && (
            <div className="p-3 text-center">
              <button className="btn btn-ghost btn-sm" onClick={() => setLimit(limit + 150)}>
                Afficher plus ({rows.length - visible.length} restants)
              </button>
            </div>
          )}
        </div>
      </div>
      {details && <ProductDetails item={details} onClose={() => setDetails(null)} />}
    </div>
  )
}
