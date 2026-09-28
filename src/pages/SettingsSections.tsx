import { Bot, Check, FileText, Moon, Palette, Percent, Sun } from 'lucide-react'
import { cn, formatPrice } from '../lib/format'
import { COUNTRY_LABELS, effectiveVat, VAT_BY_COUNTRY, type PriceMode } from '../lib/tax'
import { ACCENTS, useStore, type QuoteInfo } from '../store/useStore'

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

/** Thème clair / sombre et couleur d'accent de l'interface. */
export function AppearanceSection() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const accent = useStore((s) => s.accent)
  const setAccent = useStore((s) => s.setAccent)

  return (
    <section className="card mt-6 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Palette className="h-5 w-5 text-brand-400" /> Apparence
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div className="grid gap-2 text-sm">
          <span className="label">Thème</span>
          <div className="flex gap-2">
            {(['dark', 'light'] as const).map((t) => (
              <button key={t} type="button" aria-pressed={theme === t} className={cn('btn', theme === t ? 'btn-primary' : 'btn-ghost')} onClick={() => theme !== t && toggleTheme()}>
                {t === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} {t === 'dark' ? 'Sombre' : 'Clair'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-2 text-sm">
          <span className="label">Couleur d’accent</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Couleur d’accent">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={accent === a.id}
                title={a.label}
                onClick={() => setAccent(a.id)}
                className={cn('grid h-9 w-9 place-items-center rounded-full border-2 transition', accent === a.id ? 'scale-110 border-[var(--text)]' : 'border-transparent hover:scale-105')}
                style={{ background: a.color }}
              >
                {accent === a.id && <Check className="h-4 w-4 text-white" />}
                <span className="sr-only">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const BOT_COMMANDS: [string, string][] = [
  ['/pc build link:<lien de partage>', 'chiffre une configuration EnginePC au meilleur prix, pièce par pièce'],
  ['/pc generate budget:1500 usage:Gaming', 'ouvre le générateur prérempli'],
  ['/pc price query:RTX 5070', 'meilleurs prix neuf, reconditionné et occasion'],
  ['/pc specs query:Ryzen 7 9800X3D', 'fiche technique'],
  ['/pc compare a:… b:…', 'caractéristiques et prix côte à côte'],
  ['/pc watch add query:… target:399', 'alerte quand le prix passe sous la cible'],
  ['/pc deals', 'bons plans du moment'],
]

/** Liaison avec le bot Discord HeiphaisBot (module « pc »). */
export function DiscordSection() {
  const invite = import.meta.env.VITE_DISCORD_INVITE_URL as string | undefined
  return (
    <section className="card mt-6 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Bot className="h-5 w-5 text-brand-400" /> Bot Discord HeiphaisBot
      </h2>
      <p className="muted mt-1 text-sm">
        EnginePC et le comparateur SearchIT sont reliés au bot Discord. Copiez une configuration avec « Exporter / partager → Copier pour
        Discord », collez-la dans un salon : le bot la chiffre au meilleur prix du moment.
      </p>
      <ul className="mt-4 grid gap-2 text-sm">
        {BOT_COMMANDS.map(([cmd, desc]) => (
          <li key={cmd} className="flex flex-wrap items-baseline gap-2">
            <code className="rounded-md bg-[var(--bg-soft)] px-2 py-0.5 font-mono text-xs text-brand-400">{cmd}</code>
            <span className="muted">{desc}</span>
          </li>
        ))}
      </ul>
      {invite && /^https:\/\//.test(invite) && (
        <a className="btn btn-primary mt-4" href={invite} target="_blank" rel="noopener noreferrer">
          <Bot className="h-4 w-4" /> Ajouter le bot à mon serveur
        </a>
      )}
    </section>
  )
}
