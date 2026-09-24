import { ArrowLeft, Plus, Printer, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CATEGORY_LABELS } from '../data/catalog'
import { DEVICE_TYPE_BY_ID } from '../data/profiles'
import { displayName } from '../engine/catalog'
import { lineItems, resolveBuild } from '../engine/resolve'
import { decodeShare } from '../lib/export'
import { componentSpecs, deviceSpecs } from '../lib/specs'
import { effectiveVat, toHT } from '../lib/tax'
import { useCatalog } from '../store/catalog'
import { useStore } from '../store/useStore'

interface Line {
  key: string
  label: string
  detail: string
  qty: number
  /** Prix unitaire HT (EUR). */
  puHT: number
}

const round2 = (v: number) => Math.round(v * 100) / 100
const eurFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
/** Le devis est toujours établi en euros, au centime. */
const formatMoney = (v: number) => eurFormat.format(v)

/** Devis imprimable (HT / TVA / TTC) à partir d'une configuration encodée dans l'URL. */
export function Quote() {
  const { code } = useParams()
  const payload = useMemo(() => (code ? decodeShare(code) : null), [code])
  const catalog = useCatalog()
  const extraStatus = useStore((s) => s.extraMeta.status)
  const settings = useStore((s) => s.priceSettings)
  const info = useStore((s) => s.quoteInfo)
  const [number] = useState(() => useStore.getState().nextQuoteNumber())
  const [client, setClient] = useState({ name: '', company: '', address: '', email: '' })
  const [discountPct, setDiscountPct] = useState(info.discountPct)
  const [edited, setEdited] = useState<Line[] | null>(null)
  const vat = effectiveVat(settings)
  const today = new Date()
  const validUntil = new Date(today.getTime() + info.validityDays * 86400_000)

  const initial = useMemo<Line[]>(() => {
    if (!payload) return []
    const lines: Line[] = []
    if (payload.deviceId) {
      const d = catalog.deviceById.get(payload.deviceId)
      if (d) lines.push({ key: d.id, label: `${d.brand} ${d.model}`, detail: `${DEVICE_TYPE_BY_ID[d.deviceType].label} · ${deviceSpecs(d).slice(0, 5).join(' · ')}`, qty: 1, puHT: round2(toHT(d.price)) })
    } else {
      for (const { item, qty } of lineItems(resolveBuild(payload.slots, catalog))) {
        lines.push({ key: item.id, label: displayName(item), detail: `${CATEGORY_LABELS[item.category]} · ${componentSpecs(item).slice(0, 4).join(' · ')}`, qty, puHT: round2(toHT(item.price)) })
      }
    }
    if (info.assemblyFee > 0) lines.push({ key: 'assembly', label: 'Montage, tests et configuration', detail: 'Prestation de service', qty: 1, puHT: round2(toHT(info.assemblyFee)) })
    return lines
  }, [payload, catalog, info.assemblyFee])

  const lines = edited ?? initial
  const setLines = (next: Line[]) => setEdited(next)
  const update = (i: number, patch: Partial<Line>) => setLines(lines.map((l, k) => (k === i ? { ...l, ...patch } : l)))

  const grossHT = lines.reduce((s, l) => s + l.qty * l.puHT, 0)
  const discount = (grossHT * discountPct) / 100
  const netHT = grossHT - discount
  const vatAmount = (netHT * vat) / 100
  const ttc = netHT + vatAmount

  if (!payload) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Devis introuvable</h1>
        <p className="muted mt-2">Le lien est incomplet. Générez un devis depuis le menu « Exporter ».</p>
        <Link to="/configurer/desktop" className="btn btn-primary mt-6">
          Configurer
        </Link>
      </div>
    )
  }

  const input = 'w-full bg-transparent outline-none focus:bg-[var(--bg-soft)] rounded px-1 print:p-0'

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 print:max-w-none print:p-0">
      <div className="no-print mb-6 flex flex-wrap items-center gap-2">
        <Link to={`/configurer/${payload.deviceType}`} className="btn btn-ghost btn-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à la configuration
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            Remise
            <input className="input w-20 py-1" type="number" min={0} max={100} value={discountPct} onChange={(e) => setDiscountPct(Math.min(100, Math.max(0, Number(e.target.value) || 0)))} />%
          </label>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Imprimer / PDF
          </button>
        </div>
      </div>
      {extraStatus === 'loading' && !payload.deviceId && <p className="no-print muted mb-3 text-sm">Chargement de la base étendue…</p>}

      <article className="card bg-white p-8 text-slate-900 print:border-0 print:p-0" style={{ colorScheme: 'light' }}>
        <header className="flex flex-wrap justify-between gap-6">
          <div>
            <div className="text-xl font-bold">{info.company || 'Votre société'}</div>
            <div className="whitespace-pre-line text-sm text-slate-600">{info.address || 'Adresse (à renseigner dans Paramètres → Devis)'}</div>
            <div className="mt-1 text-xs text-slate-500">
              {[info.email, info.phone].filter(Boolean).join(' · ')}
              {info.siret && <div>SIRET : {info.siret}</div>}
              {info.vatNumber && <div>TVA intracom. : {info.vatNumber}</div>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold tracking-tight">DEVIS</div>
            <div className="text-sm">N° {number}</div>
            <div className="text-sm text-slate-600">Date : {today.toLocaleDateString('fr-FR')}</div>
            <div className="text-sm text-slate-600">Valable jusqu’au {validUntil.toLocaleDateString('fr-FR')}</div>
          </div>
        </header>

        <section className="mt-6 ml-auto max-w-xs rounded-lg border border-slate-200 p-3 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client</div>
          <input className={input} placeholder="Nom du client" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
          <input className={input} placeholder="Société" value={client.company} onChange={(e) => setClient({ ...client, company: e.target.value })} />
          <textarea className={`${input} resize-none`} rows={2} placeholder="Adresse" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
          <input className={input} placeholder="E-mail" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
        </section>

        <h1 className="mt-6 text-lg font-semibold">Objet : {payload.name}</h1>

        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-300 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="py-2">Désignation</th>
              <th className="w-16 py-2 text-right">Qté</th>
              <th className="w-28 py-2 text-right">PU HT</th>
              <th className="w-28 py-2 text-right">Total HT</th>
              <th className="no-print w-8" />
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={`${l.key}-${i}`} className="border-b border-slate-200 align-top">
                <td className="py-2 pr-3">
                  <input className={`${input} font-medium`} value={l.label} onChange={(e) => update(i, { label: e.target.value })} />
                  <input className={`${input} text-xs text-slate-500`} value={l.detail} onChange={(e) => update(i, { detail: e.target.value })} />
                </td>
                <td className="py-2 text-right">
                  <input className={`${input} text-right`} type="number" min={0} value={l.qty} onChange={(e) => update(i, { qty: Math.max(0, Number(e.target.value) || 0) })} />
                </td>
                <td className="py-2 text-right">
                  <input className={`${input} text-right`} type="number" min={0} step={0.01} value={l.puHT} onChange={(e) => update(i, { puHT: Math.max(0, Number(e.target.value) || 0) })} />
                </td>
                <td className="py-2 text-right font-medium tabular-nums">{formatMoney(l.qty * l.puHT)}</td>
                <td className="no-print py-2 text-right">
                  <button className="text-slate-400 hover:text-red-500" onClick={() => setLines(lines.filter((_, k) => k !== i))} aria-label="Supprimer la ligne">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="no-print mt-2 inline-flex items-center gap-1 text-sm text-cyan-700 hover:underline"
          onClick={() => setLines([...lines, { key: `custom-${lines.length}`, label: 'Nouvelle ligne', detail: '', qty: 1, puHT: 0 }])}
        >
          <Plus className="h-3.5 w-3.5" /> Ajouter une ligne (prestation, garantie, livraison…)
        </button>

        <dl className="mt-6 ml-auto grid max-w-xs grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm tabular-nums">
          <dt className="text-slate-600">Total HT</dt>
          <dd className="text-right">{formatMoney(grossHT)}</dd>
          {discountPct > 0 && (
            <>
              <dt className="text-slate-600">Remise {discountPct} %</dt>
              <dd className="text-right">− {formatMoney(discount)}</dd>
              <dt className="text-slate-600">Net HT</dt>
              <dd className="text-right">{formatMoney(netHT)}</dd>
            </>
          )}
          <dt className="text-slate-600">TVA {vat.toLocaleString('fr-FR')} %</dt>
          <dd className="text-right">{formatMoney(vatAmount)}</dd>
          <dt className="border-t border-slate-300 pt-1 text-base font-bold">Total TTC</dt>
          <dd className="border-t border-slate-300 pt-1 text-right text-base font-bold">{formatMoney(ttc)}</dd>
        </dl>

        <footer className="mt-8 space-y-2 text-xs text-slate-500">
          {settings.vatExempt && <p className="font-semibold text-slate-700">TVA non applicable, art. 293 B du CGI.</p>}
          {info.paymentTerms && <p className="whitespace-pre-line">{info.paymentTerms}</p>}
          <p>Prix et disponibilités susceptibles d’évoluer ; devis établi à partir de prix indicatifs.</p>
          <div className="mt-6 grid grid-cols-2 gap-8 pt-4">
            <div>Date et signature du client, précédées de la mention « Bon pour accord » :</div>
            <div className="h-16 border-b border-slate-300" />
          </div>
        </footer>
      </article>
    </div>
  )
}
