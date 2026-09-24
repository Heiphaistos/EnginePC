import { ArrowRight, Lightbulb, PiggyBank, Plug, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { CATEGORY_LABELS } from '../data/catalog'
import { analyzeBottleneck, estimateEnergy, suggestUpgrades } from '../engine/advice'
import { displayName } from '../engine/catalog'
import type { ResolvedBuild } from '../engine/resolve'
import { cn, formatMoney, formatPrice } from '../lib/format'
import { useCatalog } from '../store/catalog'
import { useStore } from '../store/useStore'
import type { Build, BuildSlots } from '../types'

/** Conseils : goulot d'étranglement, améliorations au meilleur coût, économies possibles, coût électrique. */
export function AdvicePanel({ build, resolved, onApply }: { build: Build; resolved: ResolvedBuild; onApply?: (slots: BuildSlots) => void }) {
  const catalog = useCatalog()
  const energySettings = useStore((s) => s.energy)
  const setEnergy = useStore((s) => s.setEnergy)
  const alwaysOn = build.deviceType === 'server' || build.deviceType === 'nas'
  const hours = alwaysOn ? 24 : energySettings.hoursPerDay
  const bottleneck = analyzeBottleneck(resolved)
  const suggestions = useMemo(
    () => (resolved.cpu ? suggestUpgrades(build.slots, catalog, build.deviceType, build.profile) : []),
    [build.slots, build.deviceType, build.profile, catalog, resolved.cpu],
  )
  const energy = estimateEnergy(resolved, hours, energySettings.kWhPrice)

  const apply = (from: string, to: string, category: string) => {
    if (!onApply) return
    const slots = { ...build.slots }
    if (category === 'gpu' || category === 'storage') {
      const list = [...(slots[category] ?? [])]
      const i = list.indexOf(from)
      if (i >= 0) list[i] = to
      slots[category] = list
    } else (slots as Record<string, unknown>)[category] = to
    onApply(slots)
  }

  if (!resolved.cpu) return null

  return (
    <div className="card p-4">
      <div className="label mb-3 flex items-center gap-1.5">
        <Lightbulb className="h-3.5 w-3.5" /> Conseils
      </div>

      {bottleneck && (
        <p className={cn('mb-3 rounded-lg p-2.5 text-sm', bottleneck.limitedBy === 'cpu' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300')}>
          {bottleneck.message}
        </p>
      )}

      {suggestions.length > 0 && (
        <ul className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <li key={`${s.kind}-${s.to.id}`} className="card-soft p-2.5 text-sm">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {s.kind === 'upgrade' ? <TrendingUp className="h-3.5 w-3.5 text-brand-400" /> : <PiggyBank className="h-3.5 w-3.5 text-emerald-400" />}
                {s.kind === 'upgrade' ? `Meilleur gain — ${CATEGORY_LABELS[s.category]}` : `Économie — ${CATEGORY_LABELS[s.category]}`}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="muted truncate">{displayName(s.from)}</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span className="truncate font-medium">{displayName(s.to)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="muted text-xs">
                  {s.kind === 'upgrade'
                    ? `+${Math.round(s.scoreDelta)} pts pour ${formatPrice(s.priceDelta)}`
                    : `${formatPrice(-s.priceDelta)} économisés, performances ${s.scoreDelta >= 0.5 ? 'en hausse' : 'équivalentes'}`}
                </span>
                {onApply && (
                  <button className="btn btn-ghost btn-sm" onClick={() => apply(s.from.id, s.to.id, s.category)}>
                    Appliquer
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 border-t border-[var(--border)] pt-3 text-sm">
        <div className="flex items-center gap-1.5 font-semibold">
          <Plug className="h-3.5 w-3.5 text-brand-400" /> ~{formatMoney(energy.costPerYear)} d’électricité par an
        </div>
        <div className="muted mt-1 text-xs">
          {energy.kWhPerYear} kWh/an · ~{energy.averageW} W en moyenne ·{' '}
          {alwaysOn ? (
            '24 h/24'
          ) : (
            <label className="inline-flex items-center gap-1">
              <input className="input w-12 px-1 py-0 text-xs" type="number" min={1} max={24} value={hours} onChange={(e) => setEnergy({ hoursPerDay: Math.min(24, Math.max(1, Number(e.target.value) || 1)) })} />
              h/jour
            </label>
          )}{' '}
          ·{' '}
          <label className="inline-flex items-center gap-1">
            <input className="input w-16 px-1 py-0 text-xs" type="number" min={0} step={0.01} value={energySettings.kWhPrice} onChange={(e) => setEnergy({ kWhPrice: Math.max(0, Number(e.target.value) || 0) })} />
            €/kWh
          </label>
        </div>
      </div>
    </div>
  )
}
