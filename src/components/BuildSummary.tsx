import { AlertCircle, AlertTriangle, BrainCircuit, CheckCircle2, Gauge, Info, Save, Zap } from 'lucide-react'
import { Price, PriceBreakdown } from './Price'
import { useMemo } from 'react'
import { PROFILE_BY_ID, profilesFor } from '../data/profiles'
import { checkBuild, hasBlockingIssues } from '../engine/compatibility'
import { estimatePowerW, lineItems, recommendedPsuW, resolveBuild, totalPrice, totalRamGB, totalStorageGB, totalVramGB } from '../engine/resolve'
import { estimateAi, estimateGamingFps, scoreResolved } from '../engine/scoring'
import { cn, formatCapacity } from '../lib/format'
import { useCatalog } from '../store/catalog'
import { useLivePrices } from '../store/usePrices'
import type { Build, BuildSlots } from '../types'
import { AdvicePanel } from './AdvicePanel'
import { ExportMenu } from './ExportMenu'
import { ScoreBar, ScoreRing } from './Score'

export function BuildSummary({ build, onSave, saved, onChangeSlots }: { build: Build; onSave?: () => void; saved?: boolean; onChangeSlots?: (slots: BuildSlots) => void }) {
  const catalog = useCatalog()
  const resolved = useMemo(() => resolveBuild(build.slots, catalog), [build.slots, catalog])
  const items = useMemo(() => lineItems(resolved).map((l) => l.item), [resolved])
  const prices = useLivePrices(items)
  const issues = useMemo(() => checkBuild(build.slots, catalog, build.deviceType), [build.slots, catalog, build.deviceType])
  const total = totalPrice(resolved, prices.price)
  const score = scoreResolved(resolved, build.profile)
  const fps = resolved.gpus.length || build.profile === 'gaming' ? estimateGamingFps(resolved) : []
  const ai = estimateAi(resolved)
  const power = estimatePowerW(resolved)
  const recPsu = recommendedPsuW(resolved)
  const blocking = hasBlockingIssues(issues)
  const shownIssues = issues.filter((i) => !i.message.startsWith('Composants manquants'))
  const missing = issues.find((i) => i.message.startsWith('Composants manquants'))

  return (
    <div className="flex flex-col gap-4">
      <div className="card p-5">
        <div className="flex items-center gap-5">
          <ScoreRing value={score} />
          <div className="min-w-0 flex-1">
            <div className="label">Score {PROFILE_BY_ID[build.profile].label}</div>
            <div className="mt-1 text-3xl font-bold"><Price value={total} subClassName="text-sm" /></div>
            <div className="muted text-xs">
              {items.length} composant(s) · {prices.loading ? 'mise à jour des prix…' : prices.results.size ? `${prices.results.size} prix live` : 'prix indicatifs'}
            </div>
            {prices.error && <div className="text-xs text-amber-400">Comparateur indisponible : prix indicatifs</div>}
          </div>
        </div>
        <div
          className={cn(
            'mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
            blocking ? 'bg-red-500/10 text-red-400' : missing ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400',
          )}
        >
          {blocking ? <AlertCircle className="h-4 w-4" /> : missing ? <Info className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {blocking ? 'Incompatibilités détectées' : missing ? `${missing.categories.length} composant(s) à choisir` : 'Configuration compatible'}
        </div>
        {total > 0 && <PriceBreakdown value={total} className="card-soft mt-4 p-3" />}
        <div className="no-print mt-4 grid grid-cols-2 gap-2">
          {onSave && (
            <button className="btn btn-primary" onClick={onSave}>
              <Save className="h-4 w-4" /> {saved ? 'Enregistré' : 'Enregistrer'}
            </button>
          )}
          <div className={cn(!onSave && 'col-span-2')}>
            <ExportMenu build={build} price={prices.price} compact />
          </div>
        </div>
      </div>

      {shownIssues.length > 0 && (
        <div className="card p-4">
          <div className="label mb-2">Compatibilité</div>
          <ul className="flex flex-col gap-2 text-sm">
            {shownIssues.map((i, k) => (
              <li key={k} className="flex gap-2">
                {i.severity === 'error' ? (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                ) : i.severity === 'warning' ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                ) : (
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                )}
                <span>{i.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AdvicePanel build={build} resolved={resolved} onApply={onChangeSlots} />

      <div className="card p-4">
        <div className="label mb-3">Performances par usage</div>
        <div className="flex flex-col gap-2">
          {profilesFor(build.deviceType)
            .filter((p) => p.id !== 'mobile')
            .map((p) => (
              <ScoreBar key={p.id} label={p.label} value={scoreResolved(resolved, p.id)} highlight={p.id === build.profile} />
            ))}
        </div>
      </div>

      {(fps.length > 0 || ai) && (
        <div className="card p-4">
          {fps.length > 0 && (
            <>
              <div className="label mb-2 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5" /> FPS estimés (AAA, réglages élevés)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {fps.map((f) => (
                  <div key={f.resolution} className="card-soft p-2 text-center">
                    <div className="text-xl font-bold tabular-nums">{f.fps}</div>
                    <div className="muted text-xs">{f.resolution}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {ai && (
            <div className={cn(fps.length > 0 && 'mt-4')}>
              <div className="label mb-2 flex items-center gap-1.5">
                <BrainCircuit className="h-3.5 w-3.5" /> Capacités IA
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="card-soft p-2">
                  <div className="text-xl font-bold tabular-nums">{ai.vramGB}</div>
                  <div className="muted text-xs">Go VRAM</div>
                </div>
                <div className="card-soft p-2">
                  <div className="text-xl font-bold tabular-nums">{ai.maxParamsQ4}B</div>
                  <div className="muted text-xs">LLM max (Q4)</div>
                </div>
                <div className="card-soft p-2">
                  <div className="text-xl font-bold tabular-nums">~{ai.tokensPerSec8B}</div>
                  <div className="muted text-xs">tok/s (8B)</div>
                </div>
              </div>
              <p className="muted mt-2 text-xs">{ai.label}{ai.fp16Tflops ? ` · ${ai.fp16Tflops} TFLOPS FP16` : ''}</p>
            </div>
          )}
        </div>
      )}

      <div className="card grid grid-cols-2 gap-3 p-4 text-sm">
        <Stat label="Consommation" value={`~${power} W`} icon={<Zap className="h-3.5 w-3.5" />} />
        <Stat label="Alim. conseillée" value={`${recPsu} W`} />
        <Stat label="Mémoire" value={totalRamGB(resolved) ? formatCapacity(totalRamGB(resolved)) : '—'} />
        <Stat label="Stockage" value={totalStorageGB(resolved) ? formatCapacity(totalStorageGB(resolved)) : '—'} />
        {totalVramGB(resolved) > 0 && <Stat label="VRAM" value={formatCapacity(totalVramGB(resolved))} />}
        {resolved.cpu && <Stat label="Cœurs / threads" value={`${resolved.cpu.cores} / ${resolved.cpu.threads}`} />}
      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="label flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 font-semibold tabular-nums">{value}</div>
    </div>
  )
}
