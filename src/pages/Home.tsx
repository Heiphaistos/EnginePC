import { ArrowRight, BadgeCheck, Download, Gauge, Receipt, ShoppingCart, Sparkles, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryIcon, Icon } from '../components/Icon'
import { Price } from '../components/Price'
import { ScoreRing } from '../components/Score'
import { CATEGORY_LABELS } from '../data/catalog'
import { DEVICE_TYPES, PROFILE_BY_ID, PROFILES } from '../data/profiles'
import { POPULAR_PRESETS } from '../data/presets'
import { displayName } from '../engine/catalog'
import { lineItems } from '../engine/resolve'
import { estimateGamingFps } from '../engine/scoring'
import { useCatalog } from '../store/catalog'
import { useGeneratedVariants } from '../store/useGenerator'
import { GuidesTeaser } from './home/GuidesTeaser'

const HERO_INPUT = { deviceType: 'desktop' as const, profile: 'gaming' as const, budget: 1600 }

export function Home() {
  const catalog = useCatalog()
  const brands = new Set([...catalog.components.map((c) => c.brand), ...catalog.devices.map((d) => d.brand)])

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="grid-pattern pointer-events-none absolute inset-0" />
        <div className="orb pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="orb pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl [animation-delay:-6s]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <span className="chip border-brand-500/40 text-brand-400">
              <Sparkles className="h-3 w-3" /> Compatibilité et performances calculées en temps réel
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] md:text-6xl">
              La meilleure configuration, <span className="gradient-text">générée en un clic.</span>
            </h1>
            <p className="muted mt-5 max-w-xl text-lg">
              PC fixe, portable, serveur, NAS, tablette ou smartphone : indiquez votre usage et votre budget, EnginePC compose la configuration optimale — ou
              construisez-la pièce par pièce, avec prix HT/TTC, devis et export.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/generer" className="btn btn-primary px-6 py-3 text-base">
                <Sparkles className="h-5 w-5" /> Générer automatiquement
              </Link>
              <Link to="/configurer/desktop" className="btn btn-ghost px-6 py-3 text-base">
                <Wrench className="h-5 w-5" /> Configurer manuellement
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <Kpi value={catalog.components.length} label="composants" />
              <Kpi value={catalog.devices.length} label="appareils complets" />
              <Kpi value={brands.size} label="marques" />
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionTitle kicker="Tous les appareils" title="Que voulez-vous configurer ?" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEVICE_TYPES.map((d) => (
            <div key={d.id} className="card card-glow group overflow-hidden p-6">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-brand-500/15 to-accent-500/15 blur-2xl transition duration-500 group-hover:scale-150" />
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/25 text-brand-300">
                <Icon name={d.icon} className="h-6 w-6" />
              </span>
              <h3 className="relative mt-4 text-lg font-semibold">{d.label}</h3>
              <p className="muted relative mt-1 text-sm">{d.description}</p>
              <div className="relative mt-5 flex gap-2">
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

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionTitle kicker="Prêtes à personnaliser" title="Configurations populaires" subtitle="Un clic pour générer la meilleure configuration du moment dans chaque catégorie." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_PRESETS.map((p) => (
            <Link key={p.title} to={`/generer?type=${p.type}&profile=${p.profile}&budget=${p.budget}`} className="card card-glow group flex flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-500/15 text-accent-400">
                  <Icon name={PROFILE_BY_ID[p.profile].icon} className="h-5 w-5" />
                </span>
                <span className="chip">{p.budget.toLocaleString('fr-FR')} €</span>
              </div>
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="muted mt-1 flex-1 text-sm">{p.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-400">
                Générer <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionTitle kicker="Simple" title="Comment ça marche" />
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['Décrivez votre besoin', 'Type d’appareil, usage principal, budget HT ou TTC et quelques préférences (marque, format, ECC…).'],
            ['Comparez les propositions', 'Quatre configurations compatibles, notées par usage, avec FPS, capacités IA, consommation et conseils d’amélioration.'],
            ['Personnalisez et exportez', 'Changez chaque pièce, puis exportez en CSV/JSON/PDF, partagez un lien ou éditez un devis HT/TTC.'],
          ].map(([t, d], i) => (
            <li key={t} className="card p-6">
              <span className="font-display gradient-text text-4xl font-bold">0{i + 1}</span>
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="muted mt-1 text-sm">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionTitle kicker="11 profils" title="Optimisé pour chaque usage" subtitle="Chaque profil possède son propre modèle de score et sa répartition de budget." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROFILES.map((p) => (
            <Link key={p.id} to={`/generer?profile=${p.id}&type=${p.devices[0]}`} className="card-soft card-glow flex gap-3 p-4">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Feature icon={<BadgeCheck className="h-5 w-5" />} title="Compatibilité totale" text="Socket, mémoire, RDIMM/ECC, formats, longueur GPU, ventirad, alimentation, baies disques…" />
          <Feature icon={<Gauge className="h-5 w-5" />} title="Aperçu temps réel" text="Score par usage, FPS 1080p/1440p/4K, taille de LLM exécutable, goulot d’étranglement." />
          <Feature icon={<Receipt className="h-5 w-5" />} title="HT / TTC et devis" text="TVA par pays, franchise en base, devis numéroté imprimable." />
          <Feature icon={<Download className="h-5 w-5" />} title="Export complet" text="JSON, CSV Excel, Markdown, PDF et lien de partage." />
          <Feature icon={<ShoppingCart className="h-5 w-5" />} title="Meilleurs prix" text="Liens vers les marchands et connexion au comparateur de prix." />
        </div>
      </section>

      <GuidesTeaser />

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="gradient-border relative overflow-hidden rounded-2xl p-8 md:p-12">
          <div className="orb pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <h2 className="relative text-3xl font-bold">Prêt à trouver votre configuration idéale ?</h2>
          <p className="muted relative mt-2 max-w-xl">Gratuit, sans inscription. Vos configurations restent dans votre navigateur.</p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <Link to="/generer" className="btn btn-primary px-6 py-3">
              <Sparkles className="h-4 w-4" /> Lancer le générateur
            </Link>
            <Link to="/catalogue" className="btn btn-ghost px-6 py-3">
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/** Aperçu vivant : une vraie configuration générée par le moteur. */
function HeroPreview() {
  const { variants, loading } = useGeneratedVariants(HERO_INPUT)
  const best = variants.find((v) => v.key === 'best')
  const fps = best ? estimateGamingFps(best.build.resolved) : []
  return (
    <div className="animate-fade-up relative [animation-delay:120ms]">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 blur-2xl" />
      <div className="glass relative p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="label">Exemple en direct</div>
            <div className="font-display text-lg font-semibold">PC Gaming · budget 1 600 €</div>
          </div>
          {best ? <ScoreRing value={best.build.score} size={78} /> : <div className="h-[78px] w-[78px] animate-pulse rounded-full bg-[var(--bg-soft)]" />}
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {best
            ? lineItems(best.build.resolved)
                .slice(0, 6)
                .map(({ item }) => (
                  <li key={item.id} className="card-soft flex items-center gap-3 px-3 py-2">
                    <CategoryIcon category={item.category} className="h-4 w-4 shrink-0 text-brand-400" />
                    <div className="min-w-0 flex-1">
                      <div className="muted text-[10px] uppercase tracking-wider">{CATEGORY_LABELS[item.category]}</div>
                      <div className="truncate text-sm font-medium">{displayName(item)}</div>
                    </div>
                  </li>
                ))
            : Array.from({ length: 6 }, (_, i) => <li key={i} className="card-soft h-12 animate-pulse" />)}
        </ul>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {fps.map((f) => (
              <span key={f.resolution} className="chip">
                {f.resolution} ≈ {f.fps} fps
              </span>
            ))}
            {loading && !best && <span className="muted text-xs">Génération…</span>}
          </div>
          {best && (
            <div className="text-right text-2xl font-bold">
              <Price value={best.build.total} />
            </div>
          )}
        </div>
        <Link to="/generer?type=desktop&profile=gaming&budget=1600" className="btn btn-primary mt-4 w-full">
          Voir et personnaliser <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div>
      <div className="label text-brand-400">{kicker}</div>
      <h2 className="mt-1 text-3xl font-bold">{title}</h2>
      {subtitle && <p className="muted mt-1">{subtitle}</p>}
    </div>
  )
}

function Kpi({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold tabular-nums">{value.toLocaleString('fr-FR')}</div>
      <div className="muted text-sm">{label}</div>
    </div>
  )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card card-glow p-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/15 text-brand-400">{icon}</span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="muted mt-1 text-sm">{text}</p>
    </div>
  )
}
