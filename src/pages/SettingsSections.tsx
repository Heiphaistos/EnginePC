import { FileText, Percent } from 'lucide-react'
import { formatPrice } from '../lib/format'
import { COUNTRY_LABELS, effectiveVat, VAT_BY_COUNTRY, type PriceMode } from '../lib/tax'
import { useStore, type QuoteInfo } from '../store/useStore'

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'CAD', 'JPY', 'PLN', 'SEK', 'DKK', 'NOK', 'CZK', 'AUD']

/** Prix, TVA et devise : appliqués immédiatement. */
export function TaxSection() {
  const settings = useStore((s) => s.priceSettings)
  const set = useStore((s) => s.setPriceSettings)
  const rates = useStore((s) => s.rates)
  const vat = effectiveVat(settings)

  return (
    <section className="card mt-6 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Percent className="h-5 w-5 text-brand-400" /> Prix, TVA et devise
      </h2>
      <p className="muted mt-1 text-sm">
        Les prix du catalogue sont des prix TTC France (TVA 20 %). EnginePC en déduit le HT puis applique la TVA du pays choisi.
        Exemple : {formatPrice(1200)} pour un article à 1 200 € TTC France.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="label">Affichage des prix</span>
          <select className="input" value={settings.priceMode ?? 'ttc'} onChange={(e) => set({ priceMode: e.target.value as PriceMode })}>
            <option value="ttc">TTC (particuliers)</option>
            <option value="ht">HT (professionnels)</option>
            <option value="both">HT et TTC</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="label">Pays (taux de TVA)</span>
          <select className="input" value={settings.country} onChange={(e) => set({ country: e.target.value, vatRate: undefined })}>
            {Object.entries(COUNTRY_LABELS).map(([c, l]) => (
              <option key={c} value={c}>
                {l} — {VAT_BY_COUNTRY[c]} %
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="label">Taux de TVA appliqué (%)</span>
          <input
            className="input"
            type="number"
            min={0}
            max={30}
            step={0.1}
            value={vat}
            disabled={settings.vatExempt}
            onChange={(e) => set({ vatRate: e.target.value === '' ? undefined : Number(e.target.value) })}
          />
          <span className="muted text-xs">Taux réduits possibles (ex. 5,5 %, 10 %) ; videz pour revenir au taux du pays.</span>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="label">Devise d’affichage</span>
          <select className="input" value={settings.currency} onChange={(e) => set({ currency: e.target.value })}>
            {CURRENCIES.filter((c) => c === 'EUR' || rates.rates[c]).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <span className="muted text-xs">Taux {rates.source}{rates.date ? ` du ${rates.date}` : ''}.</span>
        </label>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!settings.vatExempt} onChange={(e) => set({ vatExempt: e.target.checked })} />
        Franchise en base de TVA (micro-entreprise) — « TVA non applicable, art. 293 B du CGI » sur les devis
      </label>
    </section>
  )
}

/** Coordonnées vendeur et options par défaut des devis. */
export function QuoteSection() {
  const q = useStore((s) => s.quoteInfo)
  const set = useStore((s) => s.setQuoteInfo)
  const field = (key: keyof QuoteInfo, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="grid gap-1 text-sm">
      <span className="label">{label}</span>
      <input
        className="input"
        value={String(q[key] ?? '')}
        {...props}
        onChange={(e) => set({ [key]: props.type === 'number' ? Number(e.target.value) || 0 : e.target.value } as Partial<QuoteInfo>)}
      />
    </label>
  )
  return (
    <section className="card mt-6 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <FileText className="h-5 w-5 text-brand-400" /> Devis
      </h2>
      <p className="muted mt-1 text-sm">Ces informations apparaissent sur les devis (menu Exporter → Devis HT / TTC). Enregistrées dans votre navigateur.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {field('company', 'Société / nom')}
        {field('email', 'E-mail', { type: 'email' })}
        {field('phone', 'Téléphone')}
        {field('siret', 'SIRET')}
        {field('vatNumber', 'N° de TVA intracommunautaire')}
        {field('validityDays', 'Validité (jours)', { type: 'number', min: 1 })}
        {field('assemblyFee', 'Montage et tests par défaut (€ TTC)', { type: 'number', min: 0 })}
        {field('discountPct', 'Remise par défaut (%)', { type: 'number', min: 0, max: 100 })}
      </div>
      <label className="mt-3 grid gap-1 text-sm">
        <span className="label">Adresse</span>
        <textarea className="input min-h-16" value={q.address} onChange={(e) => set({ address: e.target.value })} />
      </label>
      <label className="mt-3 grid gap-1 text-sm">
        <span className="label">Conditions de paiement</span>
        <textarea className="input min-h-16" value={q.paymentTerms} onChange={(e) => set({ paymentTerms: e.target.value })} />
      </label>
    </section>
  )
}
