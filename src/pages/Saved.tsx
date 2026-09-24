import { Columns3, Pencil, Trash2, Upload } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExportMenu } from '../components/ExportMenu'
import { Icon } from '../components/Icon'
import { ScoreRing } from '../components/Score'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../data/catalog'
import { DEVICE_TYPE_BY_ID, PROFILE_BY_ID } from '../data/profiles'
import { displayName, type Catalog } from '../engine/catalog'
import { checkBuild, hasBlockingIssues } from '../engine/compatibility'
import { estimatePowerW, lineItems, resolveBuild, totalPrice, totalRamGB, totalStorageGB, totalVramGB } from '../engine/resolve'
import { estimateAi, estimateGamingFps, scoreDevice, scoreResolved } from '../engine/scoring'
import type { BuildExport } from '../lib/export'
import { cn, formatCapacity, formatPrice } from '../lib/format'
import { uid } from '../lib/id'
import { useCatalog } from '../store/catalog'
import { useStore } from '../store/useStore'
import type { Build } from '../types'

function summarize(b: Build, catalog: Catalog) {
  if (b.deviceId) {
    const d = catalog.deviceById.get(b.deviceId)
    return { price: d?.price ?? 0, score: d ? scoreDevice(d, b.profile) : 0, ok: !!d, parts: d ? [`${d.brand} ${d.model}`] : [] }
  }
  const r = resolveBuild(b.slots, catalog)
  return {
    price: totalPrice(r),
    score: scoreResolved(r, b.profile),
    ok: !hasBlockingIssues(checkBuild(b.slots, catalog, b.deviceType)),
    parts: lineItems(r).map(({ item, qty }) => `${qty > 1 ? qty + '× ' : ''}${displayName(item)}`),
  }
}

export function Saved() {
  const catalog = useCatalog()
  const saved = useStore((s) => s.saved)
  const compare = useStore((s) => s.compare)
  const toggleCompare = useStore((s) => s.toggleCompare)
  const deleteBuild = useStore((s) => s.deleteBuild)
  const setDraft = useStore((s) => s.setDraft)
  const saveBuild = useStore((s) => s.saveBuild)
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const compared = useMemo(() => saved.filter((b) => compare.includes(b.id)), [saved, compare])

  const importFile = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as BuildExport
      if (data.schema !== 'enginepc.build' || !data.build) throw new Error('format')
      saveBuild({ ...data.build, id: uid() })
    } catch {
      alert('Fichier invalide : un export JSON EnginePC est attendu.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Mes configurations</h1>
          <p className="muted mt-1">Enregistrées localement dans votre navigateur. Cochez jusqu’à 4 configurations pour les comparer.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" /> Importer un JSON
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
      </div>

      {saved.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="font-semibold">Aucune configuration enregistrée.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/generer" className="btn btn-primary">
              Générer une configuration
            </Link>
            <Link to="/configurer/desktop" className="btn btn-ghost">
              Configurer
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {saved.map((b) => {
            const s = summarize(b, catalog)
            return (
              <div key={b.id} className={cn('card flex flex-col p-5', compare.includes(b.id) && 'border-brand-500')}>
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="muted flex items-center gap-1.5 text-xs">
                      <Icon name={DEVICE_TYPE_BY_ID[b.deviceType].icon} className="h-3.5 w-3.5" /> {DEVICE_TYPE_BY_ID[b.deviceType].label} · {PROFILE_BY_ID[b.profile].label}
                    </div>
                    <h3 className="mt-1 font-semibold">{b.name}</h3>
                    <div className="mt-1 text-2xl font-bold tabular-nums">{formatPrice(s.price)}</div>
                    {!s.ok && <div className="text-xs text-red-400">Incompatibilités à corriger</div>}
                  </div>
                  <ScoreRing value={s.score} size={70} />
                </div>
                <ul className="muted mt-3 flex-1 text-xs leading-relaxed">
                  {s.parts.slice(0, 8).map((p) => (
                    <li key={p} className="truncate">
                      • {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => { setDraft(b); navigate(`/configurer/${b.deviceType}`) }}>
                    <Pencil className="h-3.5 w-3.5" /> Modifier
                  </button>
                  <button className={cn('btn btn-sm', compare.includes(b.id) ? 'btn-primary' : 'btn-ghost')} onClick={() => toggleCompare(b.id)}>
                    <Columns3 className="h-3.5 w-3.5" /> Comparer
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => confirm('Supprimer cette configuration ?') && deleteBuild(b.id)} aria-label="Supprimer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="ml-auto">
                    <ExportMenu build={b} compact />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {compared.length >= 2 && <Comparison builds={compared} />}
    </div>
  )
}

function Comparison({ builds }: { builds: Build[] }) {
  const catalog = useCatalog()
  const data = builds.map((b) => {
    const r = resolveBuild(b.slots, catalog)
    const d = b.deviceId ? catalog.deviceById.get(b.deviceId) : undefined
    const fps = estimateGamingFps(r)
    const ai = estimateAi(r)
    return { b, r, d, s: summarize(b, catalog), fps, ai }
  })
  const rows: [string, (x: (typeof data)[number]) => string][] = [
    ['Prix', (x) => formatPrice(x.s.price)],
    ['Score (usage)', (x) => `${Math.round(x.s.score)}/100`],
    ['Type', (x) => DEVICE_TYPE_BY_ID[x.b.deviceType].label],
    ...CATEGORY_ORDER.map(
      (c) =>
        [CATEGORY_LABELS[c], (x: (typeof data)[number]) => {
          if (x.d) return c === 'cpu' ? x.d.cpu : c === 'gpu' ? x.d.gpu ?? '—' : '—'
          return lineItems(x.r).filter((l) => l.item.category === c).map((l) => `${l.qty > 1 ? l.qty + '× ' : ''}${displayName(l.item)}`).join(', ') || '—'
        }] as [string, (x: (typeof data)[number]) => string],
    ),
    ['RAM totale', (x) => (x.d ? `${x.d.ramGB} Go` : formatCapacity(totalRamGB(x.r)))],
    ['Stockage total', (x) => (x.d ? formatCapacity(x.d.storageGB) : formatCapacity(totalStorageGB(x.r)))],
    ['VRAM', (x) => (totalVramGB(x.r) ? formatCapacity(totalVramGB(x.r)) : '—')],
    ['FPS 1440p', (x) => (x.fps.find((f) => f.resolution === '1440p')?.fps.toString() ?? '—')],
    ['LLM max (Q4)', (x) => (x.ai ? `${x.ai.maxParamsQ4}B` : '—')],
    ['Consommation', (x) => (x.d ? '—' : `~${estimatePowerW(x.r)} W`)],
  ]
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-bold">Comparaison</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-soft)]">
            <tr>
              <th className="px-4 py-3 text-left"></th>
              {data.map((x) => (
                <th key={x.b.id} className="px-4 py-3 text-left font-semibold">
                  {x.b.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map(([label, fn]) => (
              <tr key={label}>
                <td className="muted whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">{label}</td>
                {data.map((x) => (
                  <td key={x.b.id} className="px-4 py-2.5">
                    {fn(x)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
