import { Minus, Plus, RotateCcw, Search, Sparkles, Trash2, Wand2 } from 'lucide-react'
import { Price } from '../components/Price'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { BuildSummary } from '../components/BuildSummary'
import { ComponentPicker } from '../components/ComponentPicker'
import { DeviceCard } from '../components/DeviceCard'
import { ExportMenu } from '../components/ExportMenu'
import { CategoryIcon, Icon } from '../components/Icon'
import { ScoreBar, ScoreRing } from '../components/Score'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../data/catalog'
import { DEVICE_TYPE_BY_ID, DEVICE_TYPES, PROFILE_BY_ID, profilesFor } from '../data/profiles'
import { displayName, lookup } from '../engine/catalog'
import { autoComplete, checkBuild, REQUIRED, withComponent } from '../engine/compatibility'
import { scoreDevice } from '../engine/scoring'
import { cn, formatPrice } from '../lib/format'
import { componentSpecs, deviceSpecs } from '../lib/specs'
import { useCatalog } from '../store/catalog'
import { useStore } from '../store/useStore'
import type { Build, BuildSlots, ComponentCategory, DeviceType, PCComponent, UsageProfile } from '../types'

export function Builder() {
  const { type } = useParams<{ type: DeviceType }>()
  const drafts = useStore((s) => s.drafts)
  const setDraft = useStore((s) => s.setDraft)
  const resetDraft = useStore((s) => s.resetDraft)
  const saveBuild = useStore((s) => s.saveBuild)
  const savedList = useStore((s) => s.saved)
  const [justSaved, setJustSaved] = useState(false)

  if (!type || !DEVICE_TYPE_BY_ID[type]) return <Navigate to="/configurer/desktop" replace />
  const info = DEVICE_TYPE_BY_ID[type]
  const build: Build = drafts[type] ?? useStore.getState().getDraft(type)
  const update = (patch: Partial<Build>) => {
    setJustSaved(false)
    setDraft({ ...build, ...patch })
  }
  const isSaved = justSaved || savedList.some((s) => s.id === build.id && s.updatedAt >= build.updatedAt)
  const onSave = () => {
    saveBuild(build)
    setJustSaved(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="no-print mb-6 flex gap-1.5 overflow-x-auto pb-1">
        {DEVICE_TYPES.map((d) => (
          <Link
            key={d.id}
            to={`/configurer/${d.id}`}
            className={cn('card-soft flex shrink-0 items-center gap-2 px-4 py-2 text-sm font-medium', d.id === type ? 'border-brand-500 text-brand-400' : 'hover:border-brand-500/50')}
          >
            <Icon name={d.icon} className="h-4 w-4" /> {d.label}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <div className="label">Configuration {info.label}</div>
          <input className="mt-1 w-full bg-transparent text-2xl font-bold outline-none md:text-3xl" value={build.name} onChange={(e) => update({ name: e.target.value })} />
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <select className="input w-auto" value={build.profile} onChange={(e) => update({ profile: e.target.value as UsageProfile })}>
            {profilesFor(type).map((p) => (
              <option key={p.id} value={p.id}>
                Usage : {p.label}
              </option>
            ))}
          </select>
          <Link className="btn btn-ghost" to={`/generer?type=${type}&profile=${build.profile}`}>
            <Sparkles className="h-4 w-4" /> Générer
          </Link>
          <button className="btn btn-ghost" onClick={() => resetDraft(type)} title="Nouvelle configuration">
            <RotateCcw className="h-4 w-4" /> Réinitialiser
          </button>
        </div>
      </div>

      {info.assembled && !(type === 'nas' && build.deviceId) ? (
        <AssembledBuilder build={build} update={update} onSave={onSave} saved={isSaved} />
      ) : (
        <DeviceBuilder build={build} update={update} onSave={onSave} saved={isSaved} />
      )}
    </div>
  )
}

type Slot = { category: ComponentCategory; index?: number }

function AssembledBuilder({ build, update, onSave, saved }: { build: Build; update: (p: Partial<Build>) => void; onSave: () => void; saved: boolean }) {
  const catalog = useCatalog()
  const [picker, setPicker] = useState<(Slot & { mode: 'replace' | 'add' }) | null>(null)
  const deviceType = build.deviceType as 'desktop' | 'server' | 'nas'
  const required = REQUIRED[deviceType]
  const issues = useMemo(() => checkBuild(build.slots, catalog, deviceType), [build.slots, catalog, deviceType])
  const setSlots = (slots: BuildSlots) => update({ slots })

  const pick = (c: PCComponent) => {
    if (!picker) return
    let slots: BuildSlots
    if ((c.category === 'gpu' || c.category === 'storage') && picker.mode === 'replace' && picker.index !== undefined) {
      const arr = [...(build.slots[c.category] ?? [])]
      arr[picker.index] = c.id
      slots = { ...build.slots, [c.category]: arr }
    } else slots = withComponent(build.slots, c, picker.mode)
    setSlots(slots)
    setPicker(null)
  }
  const remove = (category: ComponentCategory, index?: number) => {
    const slots = { ...build.slots }
    if (category === 'accessory') slots.accessories = (slots.accessories ?? []).filter((_, i) => i !== index)
    else if (category === 'gpu' || category === 'storage') slots[category] = (slots[category] ?? []).filter((_, i) => i !== index)
    else delete slots[category]
    setSlots(slots)
  }

  const categories = CATEGORY_ORDER.filter((c) => deviceType !== 'desktop' || c !== 'hba')

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-3">
        <div className="no-print flex flex-wrap items-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setSlots(autoComplete(build.slots, catalog, deviceType))}>
            <Wand2 className="h-3.5 w-3.5" /> Compléter au moins cher
          </button>
          <span className="muted text-xs">Seuls les composants compatibles avec vos choix sont proposés par défaut.</span>
        </div>
        {categories.map((cat) => {
          const multi = cat === 'gpu' || cat === 'storage'
          const ids = multi ? (build.slots[cat] as string[] | undefined) ?? [] : build.slots[cat as keyof BuildSlots] ? [build.slots[cat as keyof BuildSlots] as string] : []
          const catIssues = issues.filter((i) => i.severity !== 'info' && i.categories.includes(cat))
          const isRequired = required.includes(cat)
          return (
            <div key={cat} className={cn('card p-4', catIssues.some((i) => i.severity === 'error') && 'border-red-500/50')}>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/10 text-brand-400">
                  <CategoryIcon category={cat} className="h-4.5 w-4.5" />
                </span>
                <div className="flex-1">
                  <div className="font-semibold">{CATEGORY_LABELS[cat]}</div>
                  <div className="muted text-xs">{isRequired ? 'Obligatoire' : 'Optionnel'}{multi && ' · plusieurs possibles'}</div>
                </div>
                {(ids.length === 0 || multi) && (
                  <button className="btn btn-ghost btn-sm no-print" onClick={() => setPicker({ category: cat, mode: 'add' })}>
                    <Plus className="h-3.5 w-3.5" /> {ids.length ? 'Ajouter' : 'Choisir'}
                  </button>
                )}
              </div>
              {ids.map((id, index) => {
                const c = lookup<PCComponent>(catalog, id)
                if (!c) return null
                return (
                  <div key={`${id}-${index}`} className="card-soft mt-3 flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{displayName(c)}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {componentSpecs(c).map((s) => (
                          <span key={s} className="chip">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {cat === 'ram' && (
                        <div className="flex items-center gap-1 text-sm">
                          <button className="btn btn-ghost btn-sm px-2" onClick={() => setSlots({ ...build.slots, ramKits: Math.max(1, (build.slots.ramKits ?? 1) - 1) })}>
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center tabular-nums">×{build.slots.ramKits ?? 1}</span>
                          <button className="btn btn-ghost btn-sm px-2" onClick={() => setSlots({ ...build.slots, ramKits: (build.slots.ramKits ?? 1) + 1 })}>
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <span className="w-24 text-right font-bold tabular-nums">{formatPrice(c.price * (cat === 'ram' ? build.slots.ramKits ?? 1 : 1))}</span>
                      <button className="btn btn-ghost btn-sm no-print" onClick={() => setPicker({ category: cat, mode: 'replace', index: multi ? index : undefined })}>
                        Changer
                      </button>
                      <button className="btn btn-ghost btn-sm no-print px-2" onClick={() => remove(cat, multi ? index : undefined)} aria-label="Retirer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
              {catIssues.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1 text-xs">
                  {catIssues.map((i, k) => (
                    <li key={k} className={i.severity === 'error' ? 'text-red-400' : 'text-amber-400'}>
                      • {i.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-500/10 text-accent-400">
              <CategoryIcon category="accessory" className="h-4.5 w-4.5" />
            </span>
            <div className="flex-1">
              <div className="font-semibold">Périphériques & accessoires</div>
              <div className="muted text-xs">Écran, clavier, souris, casque, onduleur, ventilateurs… ajoutés au prix total</div>
            </div>
            <button className="btn btn-ghost btn-sm no-print" onClick={() => setPicker({ category: 'accessory', mode: 'add' })}>
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
          </div>
          {(build.slots.accessories ?? []).map((id, index) => {
            const a = lookup<PCComponent>(catalog, id)
            if (!a) return null
            return (
              <div key={`${id}-${index}`} className="card-soft mt-3 flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{displayName(a)}</div>
                  <div className="muted truncate text-xs">{componentSpecs(a).join(' · ')}</div>
                </div>
                <span className="font-bold tabular-nums">{formatPrice(a.price)}</span>
                <button className="btn btn-ghost btn-sm no-print px-2" onClick={() => remove('accessory', index)} aria-label="Retirer">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
        {build.deviceType === 'nas' && (
          <p className="muted text-sm">
            Vous préférez un NAS clé en main ?{' '}
            <button className="text-brand-400 underline" onClick={() => update({ deviceId: catalog.devices.find((d) => d.deviceType === 'nas')?.id })}>
              Parcourir les NAS Synology, QNAP, UGREEN…
            </button>
          </p>
        )}
      </div>
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <BuildSummary build={build} onSave={onSave} saved={saved} onChangeSlots={setSlots} />
      </aside>
      {picker && (
        <ComponentPicker
          category={picker.category}
          slots={picker.mode === 'replace' ? build.slots : { ...build.slots }}
          deviceType={deviceType}
          profile={build.profile}
          selectedId={picker.mode === 'replace' ? (picker.index !== undefined ? (build.slots[picker.category as 'gpu' | 'storage'] ?? [])[picker.index] : (build.slots[picker.category as keyof BuildSlots] as string)) : undefined}
          onPick={pick}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  )
}

type DeviceSort = 'score' | 'price-asc' | 'price-desc' | 'recent' | 'value'

function DeviceBuilder({ build, update, onSave, saved }: { build: Build; update: (p: Partial<Build>) => void; onSave: () => void; saved: boolean }) {
  const catalog = useCatalog()
  const [q, setQ] = useState('')
  const [brand, setBrand] = useState('')
  const [sort, setSort] = useState<DeviceSort>('score')
  const [maxPrice, setMaxPrice] = useState(0)
  const all = useMemo(() => catalog.devices.filter((d) => d.deviceType === build.deviceType), [catalog, build.deviceType])
  const brands = [...new Set(all.map((d) => d.brand))].sort()
  const maxAll = Math.max(0, ...all.map((d) => d.price))
  const selected = build.deviceId ? catalog.deviceById.get(build.deviceId) : undefined

  const rows = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return all
      .filter((d) => !brand || d.brand === brand)
      .filter((d) => !maxPrice || d.price <= maxPrice)
      .filter((d) => words.every((w) => `${d.brand} ${d.model} ${deviceSpecs(d).join(' ')} ${d.highlights.join(' ')}`.toLowerCase().includes(w)))
      .map((d) => ({ d, score: scoreDevice(d, build.profile) }))
      .sort((a, b) => {
        switch (sort) {
          case 'price-asc':
            return a.d.price - b.d.price
          case 'price-desc':
            return b.d.price - a.d.price
          case 'recent':
            return b.d.releaseYear - a.d.releaseYear
          case 'value':
            return b.score / b.d.price - a.score / a.d.price
          default:
            return b.score - a.score || a.d.price - b.d.price
        }
      })
  }, [all, brand, maxPrice, q, sort, build.profile])

  const profiles = profilesFor(build.deviceType)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <div className="card no-print mb-4 grid gap-2 p-4 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input className="input pl-9" placeholder="Rechercher (modèle, puce, OLED, 5G…)" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <select className="input md:w-40" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">Toutes marques</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select className="input md:w-48" value={sort} onChange={(e) => setSort(e.target.value as DeviceSort)}>
            <option value="score">Tri : score {PROFILE_BY_ID[build.profile].short}</option>
            <option value="value">Rapport qualité/prix</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="recent">Plus récents</option>
          </select>
          <label className="flex items-center gap-3 text-sm md:col-span-3">
            <span className="muted">Budget max</span>
            <input type="range" min={0} max={maxAll} step={50} value={maxPrice || maxAll} onChange={(e) => setMaxPrice(Number(e.target.value) >= maxAll ? 0 : Number(e.target.value))} className="flex-1" />
            <span className="w-20 text-right tabular-nums">{maxPrice ? formatPrice(maxPrice) : 'Aucun'}</span>
          </label>
        </div>
        <p className="muted mb-3 text-sm">{rows.length} appareil(s)</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map(({ d, score }) => (
            <DeviceCard key={d.id} device={d} score={score} selected={d.id === build.deviceId} onSelect={() => update({ deviceId: d.id, name: `${d.brand} ${d.model}` })} />
          ))}
        </div>
        {build.deviceType === 'nas' && (
          <p className="muted mt-4 text-sm">
            Envie d’un NAS sur mesure ?{' '}
            <button className="text-brand-400 underline" onClick={() => update({ deviceId: undefined })}>
              Passer en mode DIY
            </button>
          </p>
        )}
      </div>
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        {selected ? (
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <ScoreRing value={scoreDevice(selected, build.profile)} />
              <div>
                <div className="label">{selected.brand}</div>
                <div className="font-semibold">{selected.model}</div>
                <div className="mt-1 text-2xl font-bold"><Price value={selected.price} /></div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              {deviceSpecs(selected).map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {profiles.map((p) => (
                <ScoreBar key={p.id} label={p.label} value={scoreDevice(selected, p.id)} highlight={p.id === build.profile} />
              ))}
            </div>
            <div className="no-print mt-5 grid grid-cols-2 gap-2">
              <button className="btn btn-primary" onClick={onSave}>
                {saved ? 'Enregistré' : 'Enregistrer'}
              </button>
              <ExportMenu build={build} compact />
            </div>
          </div>
        ) : (
          <div className="card muted p-6 text-center text-sm">Sélectionnez un appareil pour voir son analyse détaillée.</div>
        )}
      </aside>
    </div>
  )
}
