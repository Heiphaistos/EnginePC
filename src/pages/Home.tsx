import { ArrowRight, BadgeCheck, Download, Gauge, ShoppingCart, Sparkles, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { DEVICE_TYPES, PROFILES } from '../data/profiles'
import { useCatalog } from '../store/catalog'

export function Home() {
  const catalog = useCatalog()
  const brands = new Set([...catalog.components.map((c) => c.brand), ...catalog.devices.map((d) => d.brand)])

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 md:pt-24">
          <div className="max-w-3xl">
            <span className="chip border-brand-500/40 text-brand-400">
              <Sparkles className="h-3 w-3" /> Moteur de compatibilité et de performance en temps réel
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              La meilleure configuration, <span className="gradient-text">générée en un clic.</span>
            </h1>
            <p className="muted mt-5 text-lg">
              PC fixe, portable, serveur, NAS, tablette ou smartphone : indiquez votre usage et votre budget, EnginePC compose automatiquement la configuration optimale — ou construisez-la pièce par pièce avec vérification de compatibilité instantanée.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/generer" className="btn btn-primary px-6 py-3 text-base">
                <Sparkles className="h-5 w-5" /> Générer automatiquement
              </Link>
              <Link to="/configurer/desktop" className="btn btn-ghost px-6 py-3 text-base">
                <Wrench className="h-5 w-5" /> Configurer manuellement
              </Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <Kpi value={catalog.components.length} label="composants" />
              <Kpi value={catalog.devices.length} label="appareils complets" />
              <Kpi value={brands.size} label="marques" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-2xl font-bold">Que voulez-vous configurer ?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEVICE_TYPES.map((d) => (
            <div key={d.id} className="card group relative overflow-hidden p-6 transition hover:-translate-y-0.5 hover:border-brand-500/60">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-brand-500/10 to-accent-500/10 blur-2xl transition group-hover:scale-150" />
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-brand-400">
                <Icon name={d.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{d.label}</h3>
              <p className="muted mt-1 text-sm">{d.description}</p>
              <div className="mt-5 flex gap-2">
                <Link to={`/generer?type=${d.id}`} className="btn btn-primary btn-sm">
                  <Sparkles className="h-3.5 w-3.5" /> Auto
                </Link>
                <Link to={`/configurer/${d.id}`} className="btn btn-ghost btn-sm">
                  {d.assembled ? 'Sur mesure' : 'Parcourir'} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-2xl font-bold">Optimisé pour chaque usage</h2>
        <p className="muted mt-1">Chaque profil possède son propre modèle de score et sa répartition de budget.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROFILES.map((p) => (
            <Link key={p.id} to={`/generer?profile=${p.id}&type=${p.devices[0]}`} className="card-soft flex gap-3 p-4 transition hover:border-brand-500/60">
              <Icon name={p.icon} className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" />
              <div>
                <div className="font-semibold">{p.label}</div>
                <div className="muted mt-0.5 text-xs">{p.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-4 md:grid-cols-4">
          <Feature icon={<BadgeCheck className="h-5 w-5" />} title="Compatibilité totale" text="Socket, mémoire, RDIMM/ECC, format, longueur GPU, hauteur ventirad, alimentation, baies disques…" />
          <Feature icon={<Gauge className="h-5 w-5" />} title="Aperçu temps réel" text="Score par usage, FPS estimés en 1080p/1440p/4K, taille de LLM exécutable, consommation." />
          <Feature icon={<Download className="h-5 w-5" />} title="Export complet" text="JSON, CSV Excel, Markdown, PDF et lien de partage en un clic." />
          <Feature icon={<ShoppingCart className="h-5 w-5" />} title="Connecté au comparateur" text="Prix live et envoi de la configuration au comparateur de prix via une API ouverte." />
        </div>
      </section>
    </div>
  )
}

function Kpi({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="muted text-sm">{label}</div>
    </div>
  )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card p-5">
      <span className="text-brand-400">{icon}</span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="muted mt-1 text-sm">{text}</p>
    </div>
  )
}
