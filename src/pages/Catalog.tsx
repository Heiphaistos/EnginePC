import { Download, Search } from 'lucide-react'
import { Price } from '../components/Price'
import { useMemo, useState } from 'react'
import { CategoryIcon, Icon } from '../components/Icon'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../data/catalog'
import { DEVICE_TYPE_BY_ID } from '../data/profiles'
import { displayName } from '../engine/catalog'
import { download } from '../lib/export'
import { cn } from '../lib/format'
import { ACCESSORY_LABELS, componentSpecs, deviceSpecs, TIER_LABELS } from '../lib/specs'
import { useCatalog } from '../store/catalog'
import type { ComponentCategory, Device, PCComponent } from '../types'
import { ProductDetails } from '../components/ProductDetails'
import { useStore } from '../store/useStore'

type Tab = ComponentCategory | Device['deviceType']
const DEVICE_TABS: Device['deviceType'][] = ['laptop', 'tablet', 'phone', 'nas']

export function Catalog() {
  const catalog = useCatalog()
  const [tab, setTab] = useState<Tab>('cpu')
  const [q, setQ] = useState('')
  const [brand, setBrand] = useState('')
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'recent' | 'name'>('recent')
  const [origin, setOrigin] = useState<'all' | 'verified' | 'open'>('all')
  const [kind, setKind] = useState('')
  const [limit, setLimit] = useState(200)
  const [details, setDetails] = useState<PCComponent | Device | null>(null)
  const extraMeta = useStore((s) => s.extraMeta)
  const isDevice = (DEVICE_TABS as string[]).includes(tab)

  const rows = useMemo(() => {
    const items = isDevice
      ? catalog.devices.filter((d) => d.deviceType === tab).map((d) => ({ item: d as PCComponent | Device, id: d.id, brand: d.brand, name: `${d.brand} ${d.model}`, price: d.price, year: d.releaseYear, tier: d.tier, specs: deviceSpecs(d), open: false, kind: '' }))
      : (catalog.byCategory.get(tab as ComponentCategory) ?? []).map((c) => ({ item: c as PCComponent | Device, id: c.id, brand: c.brand, name: displayName(c), price: c.price, year: c.releaseYear, tier: c.tier, specs: componentSpecs(c), open: !!c.source, kind: c.category === 'accessory' ? c.kind : '' }))
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return items
      .filter((i) => !brand || i.brand === brand)
      .filter((i) => origin === 'all' || (origin === 'open' ? i.open : !i.open))
      .filter((i) => !kind || i.kind === kind)
      .filter((i) => words.every((w) => `${i.name} ${i.specs.join(' ')}`.toLowerCase().includes(w)))
      .sort((a, b) => (sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name) : b.year - a.year || b.price - a.price))
  }, [catalog, tab, isDevice, q, brand, sort, origin, kind])

  const brands = useMemo(
    () => [...new Set((isDevice ? catalog.devices.filter((d) => d.deviceType === tab) : catalog.byCategory.get(tab as ComponentCategory) ?? []).map((i) => i.brand))].sort(),
    [catalog, tab, isDevice],
  )

  const count = (t: Tab): number => ((DEVICE_TABS as string[]).includes(t) ? catalog.devices.filter((d) => d.deviceType === t).length : catalog.byCategory.get(t as ComponentCategory)?.length ?? 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Catalogue</h1>
          <p className="muted mt-1">
            {catalog.components.length.toLocaleString('fr-FR')} composants et périphériques, {catalog.devices.length} appareils complets.
            {extraMeta.status === 'loading' && ' Chargement de la base étendue…'}
            {extraMeta.status === 'ready' && extraMeta.generatedAt && ` Base ouverte mise à jour le ${new Date(extraMeta.generatedAt).toLocaleDateString('fr-FR')}.`}
          </p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => download('enginepc-catalogue.json', JSON.stringify({ schema: 'enginepc.catalog', version: 1, components: catalog.components, devices: catalog.devices }, null, 2), 'application/json')}
        >
          <Download className="h-4 w-4" /> Exporter le catalogue (JSON)
        </button>
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {[...CATEGORY_ORDER, 'accessory' as const].map((c) => (
          <TabButton key={c} active={tab === c} onClick={() => { setTab(c); setBrand(''); setKind(''); setLimit(200) }} icon={<CategoryIcon category={c} className="h-4 w-4" />} label={CATEGORY_LABELS[c]} count={count(c)} />
        ))}
        {DEVICE_TABS.map((d) => (
          <TabButton key={d} active={tab === d} onClick={() => { setTab(d); setBrand(''); setKind(''); setLimit(200) }} icon={<Icon name={DEVICE_TYPE_BY_ID[d].icon} className="h-4 w-4" />} label={DEVICE_TYPE_BY_ID[d].plural} count={count(d)} />
        ))}
      </div>

      <div className="card mb-4 grid gap-2 p-4 md:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative">
          <Search className="muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input className="input pl-9" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="input md:w-44" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Toutes marques</option>
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <select className="input md:w-44" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom</option>
        </select>
        <select className="input md:w-48" value={origin} onChange={(e) => setOrigin(e.target.value as typeof origin)}>
          <option value="all">Toutes les sources</option>
          <option value="verified">Catalogue vérifié</option>
          <option value="open">Base ouverte</option>
        </select>
        {tab === 'accessory' && (
          <select className="input md:col-span-4" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">Tous les périphériques</option>
            {Object.entries(ACCESSORY_LABELS).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="muted bg-[var(--bg-soft)] text-left text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Caractéristiques</th>
                <th className="px-4 py-3">Gamme</th>
                <th className="px-4 py-3 text-right">Année</th>
                <th className="px-4 py-3 text-right">Prix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {rows.slice(0, limit).map((r) => (
                <tr key={r.id} className="cursor-pointer hover:bg-[var(--bg-soft)]" onClick={() => setDetails(r.item)}>
                  <td className="px-4 py-3 font-medium">
                    {r.name}
                    {r.open && <span className="chip ml-2 border-accent-500/40 text-accent-400">Base ouverte</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.specs.slice(0, 6).map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="muted whitespace-nowrap px-4 py-3 text-xs">{TIER_LABELS[r.tier]}</td>
                  <td className="muted px-4 py-3 text-right tabular-nums">{r.year}</td>
                  <td className="px-4 py-3 text-right font-semibold"><Price value={r.price} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="muted p-8 text-center">Aucun résultat.</p>}
        {rows.length > limit && (
          <div className="p-4 text-center">
            <button className="btn btn-ghost btn-sm" onClick={() => setLimit(limit + 200)}>
              Afficher plus ({rows.length - limit} restants)
            </button>
          </div>
        )}
      </div>
      {details && <ProductDetails item={details} onClose={() => setDetails(null)} />}
    </div>
  )
}

function TabButton({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number }) {
  return (
    <button onClick={onClick} className={cn('card-soft flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium', active ? 'border-brand-500 text-brand-400' : 'hover:border-brand-500/50')}>
      {icon} {label} <span className="muted text-xs">{count}</span>
    </button>
  )
}
