import { cn } from '../lib/format'
import { scoreLabel } from '../engine/scoring'

export function scoreColor(v: number): string {
  if (v >= 75) return '#22d3ee'
  if (v >= 55) return '#34d399'
  if (v >= 35) return '#fbbf24'
  return '#f87171'
}

export function ScoreRing({ value, size = 96, label }: { value: number; size?: number; label?: string }) {
  const r = (size - 10) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={8} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={scoreColor(v)}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          style={{ transition: 'stroke-dashoffset .6s ease, stroke .3s' }}
        />
      </svg>
      <div className="absolute text-center leading-tight">
        <div className={cn('font-bold tabular-nums', size >= 90 ? 'text-2xl' : 'text-xl')}>{Math.round(v)}</div>
        {size >= 90 && <div className="muted text-[10px] uppercase tracking-wider">{label ?? scoreLabel(v)}</div>}
      </div>
    </div>
  )
}

export function ScoreBar({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('grid grid-cols-[7.5rem_1fr_2.2rem] items-center gap-2 text-sm', highlight && 'font-semibold')}>
      <span className={cn('truncate', !highlight && 'muted')}>{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-soft)]">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${v}%`, background: scoreColor(v) }} />
      </div>
      <span className="text-right tabular-nums">{Math.round(v)}</span>
    </div>
  )
}
