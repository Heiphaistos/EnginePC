import { Loader2, Save, Sparkles, Wrench } from 'lucide-react'
import { Price } from '../components/Price'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BuildParts } from '../components/BuildParts'
import { DeviceCard } from '../components/DeviceCard'
import { ExportMenu } from '../components/ExportMenu'
import { Icon } from '../components/Icon'
import { ScoreRing } from '../components/Score'
import { DEVICE_TYPE_BY_ID, DEVICE_TYPES, PROFILE_BY_ID, profilesFor } from '../data/profiles'
import { recommendDevices, type AssembledType, type GeneratorPreferences } from '../engine/generator'
import { estimateAi, estimateGamingFps } from '../engine/scoring'
import { cn, priceMode, vatRate } from '../lib/format'
import { CATALOG_VAT } from '../lib/tax'
import { useCatalog } from '../store/catalog'
import { useGeneratedVariants } from '../store/useGenerator'
import { newBuild, useStore } from '../store/useStore'
import type { Build, DeviceType, UsageProfile } from '../types'

const toSlider = (v: number, [min, max]: [number, number]) => Math.log(v / min) / Math.log(max / min)
const fromSlider = (t: number, [min, max]: [number, number]) => {
  const raw = min * Math.pow(max / min, t)
  const step = raw < 2000 ? 50 : raw < 10000 ? 100 : 1000
  return Math.round(raw / step) * step
}

export function Generator() {
  const [params, setParams] = useSearchParams()
  const catalog = useCatalog()
  const navigate = useNavigate()
  const setDraft = useStore((s) => s.setDraft)
  const saveBuild = useStore((s) => s.saveBuild)

  const type = (params.get('type') as DeviceType) || 'desktop'
  const info = DEVICE_TYPE_BY_ID[type] ?? DEVICE_TYPE_BY_ID.desktop
  const allowedProfiles = profilesFor(info.id)
  const profileParam = params.get('profile') as UsageProfile | null
  const profile = profileParam && allowedProfiles.some((p) => p.id === profileParam) ? profileParam : info.defaultProfile
  const budget = Number(params.get('budget')) || info.defaultBudget
  // Le budget saisi est HT ou TTC (pays choisi) selon l'affichage ; le moteur travaille en TTC France.
  const mode = priceMode()
  const engineBudget = Math.round(mode === 'ht' ? budget * (1 + CATALOG_VAT / 100) : (budget / (1 + vatRate() / 100)) * (1 + CATALOG_VAT / 100))
  const [prefs, setPrefs] = useState<GeneratorPreferences>({})
  const [deviceBrand, setDeviceBrand] = useState('')
  const [nasMode, setNasMode] = useState<'diy' | 'turnkey'>('diy')
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => setPrefs({}), [type])

  const update = (patch: Record<string, string | number>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => next.set(k, String(v)))
    setParams(next, { replace: true })
  }

  const assembled = info.assembled && !(type === 'nas' && nasMode === 'turnkey')
  const input = { type, profile, budget: engineBudget, prefs, deviceBrand, assembled }
  const { variants, loading: stale } = useGeneratedVariants(
    assembled ? { deviceType: type as AssembledType, profile, budget: engineBudget, prefs } : null,
  )
  const devices = useMemo(
    () =>
      input.assembled
        ? []
        : recommendDevices(catalog, input.type as 'laptop' | 'tablet' | 'phone' | 'nas', input.profile, input.budget, { brand: input.deviceBrand || undefined }).slice(0, 12),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalog, type, profile, engineBudget, deviceBrand, assembled],
  )
  const deviceBrands = useMemo(() => [...new Set(catalog.devices.filter((d) => d.deviceType === type).map((d) => d.brand))].sort(), [catalog, type])

  const toBuild = (slots: Build['slots'] | undefined, deviceId: string | undefined, label: string): Build => ({
    ...newBuild(type, profile),
    name: `${info.label} ${PROFILE_BY_ID[profile].label} — ${label}`,
    slots: slots ?? {},
    deviceId,
  })

  const customize = (b: Build) => {
    setDraft(b)
    navigate(`/configurer/${type}`)
  }
  const save = (b: Build, key: string) => {
    saveBuild(b)
    setSavedIds((s) => [...s, key])
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Sparkles className="h-7 w-7 text-brand-400" /> Générateur automatique
        </h1>
        <p className="muted mt-1">Réglez vos critères : les propositions se recalculent instantanément.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="card no-print h-fit p-5 lg:sticky lg:top-20">
          <div className="label mb-2">Type d’appareil</div>
          <div className="grid grid-cols-3 gap-1.5">
            {DEVICE_TYPES.map((d) => (
              <button
                key={d.id}
                onClick={() => update({ type: d.id, budget: d.defaultBudget, profile: d.defaultProfile })}
                className={cn('card-soft flex flex-col items-center gap-1 p-2 text-xs font-medium transition', d.id === type ? 'border-brand-500 text-brand-400' : 'hover:border-brand-500/50')}
              >
                <Icon name={d.icon} className="h-5 w-5" /> {d.label}
              </button>
            ))}
          </div>

          {type === 'nas' && (
            <div className="mt-4 grid grid-cols-2 gap-1.5">
              {(['diy', 'turnkey'] as const).map((m) => (
                <button key={m} onClick={() => setNasMode(m)} className={cn('btn btn-sm', nasMode === m ? 'btn-primary' : 'btn-ghost')}>
                  {m === 'diy' ? 'NAS DIY' : 'Clé en main'}
                </button>
              ))}
            </div>
          )}

          <div className="label mb-2 mt-5">Usage principal</div>
          <div className="flex flex-wrap gap-1.5">
            {allowedProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => update({ profile: p.id })}
                className={cn('chip cursor-pointer px-3 py-1 text-sm', p.id === profile && 'border-brand-500 bg-brand-500/15 text-brand-400')}
                title={p.description}
              >
                <Icon name={p.icon} className="h-3.5 w-3.5" /> {p.label}
              </button>
            ))}
          </div>
          <p className="muted mt-2 text-xs">{PROFILE_BY_ID[profile].description}</p>

          <div className="mt-5 flex items-end justify-between">
            <div className="label">Budget {mode === 'ht' ? 'HT' : 'TTC'} (€)</div>
            <input
              type="number"
              className="input w-32 text-right font-semibold"
              value={budget}
              min={info.budgetRange[0]}
              step={50}
              onChange={(e) => update({ budget: Math.max(50, Number(e.target.value) || 0) })}
            />
          </div>
          <input
            type="range"
            className="mt-3 w-full"
            min={0}
            max={1}
            step={0.001}
            value={toSlider(Math.min(Math.max(budget, info.budgetRange[0]), info.budgetRange[1]), info.budgetRange)}
            onChange={(e) => update({ budget: fromSlider(Number(e.target.value), info.budgetRange) })}
          />
          <div className="muted flex justify-between text-xs">
            <span>{info.budgetRange[0].toLocaleString('fr-FR')} €</span>
            <span>{info.budgetRange[1].toLocaleString('fr-FR')} €</span>
          </div>

          {assembled ? (
            <div className="mt-5 flex flex-col gap-3">
              <div className="label">Préférences</div>
              <Select label="Processeur" value={prefs.cpuBrand ?? 'any'} onChange={(v) => setPrefs({ ...prefs, cpuBrand: v as GeneratorPreferences['cpuBrand'] })} options={[['any', 'Indifférent'], ['AMD', 'AMD'], ['Intel', 'Intel']]} />
              {type !== 'nas' && (
                <Select label="Carte graphique" value={prefs.gpuBrand ?? 'any'} onChange={(v) => setPrefs({ ...prefs, gpuBrand: v as GeneratorPreferences['gpuBrand'] })} options={[['any', 'Indifférent'], ['NVIDIA', 'NVIDIA'], ['AMD', 'AMD Radeon'], ['Intel', 'Intel Arc']]} />
              )}
              <Select
                label="Format"
                value={prefs.size ?? 'any'}
                onChange={(v) => setPrefs({ ...prefs, size: v as GeneratorPreferences['size'] })}
                options={type === 'desktop' ? [['any', 'Indifférent'], ['compact', 'Compact (mATX/ITX)'], ['itx', 'Mini-ITX']] : [['any', 'Indifférent'], ['tower', 'Tour'], ['rack', 'Rack']]}
              />
              {(type === 'server' || profile === 'ai') && type !== 'nas' && (
                <Select label="Nombre de GPU" value={String(prefs.gpuCount ?? 0)} onChange={(v) => setPrefs({ ...prefs, gpuCount: Number(v) || undefined })} options={[['0', 'Auto'], ['1', '1'], ['2', '2'], ['4', '4'], ['8', '8']]} />
              )}
              <Select label="RAM minimum" value={String(prefs.minRamGB ?? 0)} onChange={(v) => setPrefs({ ...prefs, minRamGB: Number(v) || undefined })} options={[['0', 'Auto'], ['16', '16 Go'], ['32', '32 Go'], ['64', '64 Go'], ['128', '128 Go'], ['256', '256 Go'], ['512', '512 Go'], ['1024', '1 To']]} />
              {(type === 'nas' || profile === 'storage') && (
                <Select label="Capacité brute min." value={String(prefs.minStorageTB ?? 0)} onChange={(v) => setPrefs({ ...prefs, minStorageTB: Number(v) || undefined })} options={[['0', 'Auto'], ['8', '8 To'], ['16', '16 To'], ['32', '32 To'], ['48', '48 To'], ['100', '100 To'], ['200', '200 To']]} />
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                {type === 'desktop' && (
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!prefs.wifi} onChange={(e) => setPrefs({ ...prefs, wifi: e.target.checked })} /> Wi-Fi intégré
                  </label>
                )}
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!prefs.ecc} onChange={(e) => setPrefs({ ...prefs, ecc: e.target.checked })} /> Mémoire ECC
                </label>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <Select label="Marque" value={deviceBrand} onChange={setDeviceBrand} options={[['', 'Toutes'], ...deviceBrands.map((b) => [b, b] as [string, string])]} />
            </div>
          )}
        </aside>

        <section className={cn('min-w-0 transition-opacity', stale && 'opacity-60')}>
          {stale && (
            <div className="muted mb-3 flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Calcul en cours…
            </div>
          )}

          {input.assembled && !stale && variants.length === 0 && (
            <div className="card p-10 text-center">
              <p className="font-semibold">Aucune configuration compatible pour ce budget et ces critères.</p>
              <p className="muted mt-1 text-sm">Augmentez le budget ou assouplissez les préférences.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {variants.map((v) => {
              const b = toBuild(v.build.slots, undefined, v.label)
              const fps = v.build.resolved.gpus.length || profile === 'gaming' ? estimateGamingFps(v.build.resolved) : []
              const ai = estimateAi(v.build.resolved)
              const key = `${v.key}-${v.build.total}`
              return (
                <article key={v.key} className={cn('card flex min-w-0 flex-col p-5', v.key === 'best' && 'gradient-border shadow-[0_20px_50px_-30px_rgba(34,211,238,0.6)]')}>
                  <header className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold">{v.label}</h2>
                        {v.key === 'best' && <span className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-2 py-0.5 text-xs font-semibold text-white">Meilleur choix</span>}
                      </div>
                      <p className="muted text-xs">{v.description}</p>
                      <div className="mt-2 text-3xl font-bold"><Price value={v.build.total} subClassName="text-sm" /></div>
                    </div>
                    <ScoreRing value={v.build.score} size={84} />
                  </header>
                  {(fps.length > 0 || ai) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {fps.map((f) => (
                        <span key={f.resolution} className="chip">
                          {f.resolution} ≈ {f.fps} fps
                        </span>
                      ))}
                      {ai && <span className="chip">LLM ≤ {ai.maxParamsQ4}B (Q4) · {ai.vramGB} Go VRAM</span>}
                    </div>
                  )}
                  <div className="mt-3 flex-1">
                    <BuildParts resolved={v.build.resolved} specs={false} />
                  </div>
                  <footer className="no-print mt-4 flex flex-wrap gap-2 [&>*]:flex-1">
                    <button className="btn btn-primary btn-sm" onClick={() => customize(b)}>
                      <Wrench className="h-3.5 w-3.5" /> Personnaliser
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => save(b, key)} disabled={savedIds.includes(key)}>
                      <Save className="h-3.5 w-3.5" /> {savedIds.includes(key) ? 'Enregistré' : 'Enregistrer'}
                    </button>
                    <ExportMenu build={b} compact />
                  </footer>
                </article>
              )
            })}
          </div>

          {!input.assembled && (
            <>
              {devices.length === 0 ? (
                <div className="card p-10 text-center">
                  <p className="font-semibold">Aucun appareil dans ce budget.</p>
                  <p className="muted mt-1 text-sm">Augmentez le budget ou changez de marque.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {devices.map((r, i) => {
                    const best = [...devices].sort((a, b) => b.value - a.value)[0]
                    const b = toBuild(undefined, r.device.id, r.device.model)
                    return (
                      <DeviceCard
                        key={r.device.id}
                        device={r.device}
                        score={r.score}
                        badge={i === 0 ? 'Meilleur score' : r.device.id === best.device.id ? 'Meilleur rapport qualité/prix' : undefined}
                        onSelect={() => {
                          setDraft(b)
                          navigate(`/configurer/${type}`)
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="grid grid-cols-[8.5rem_1fr] items-center gap-2 text-sm">
      <span className="muted">{label}</span>
      <select className="input py-1.5" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}
