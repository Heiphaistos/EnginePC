import { ArrowLeft, ArrowRight, BookOpen, Clock, Lightbulb, Sparkles } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { GUIDES } from '../data/content/guides'

export function Guides() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="label text-brand-400">Ressources</div>
      <h1 className="mt-1 flex items-center gap-2 text-4xl font-bold">
        <BookOpen className="h-8 w-8 text-brand-400" /> Guides d’achat
      </h1>
      <p className="muted mt-2 max-w-2xl">Des conseils concrets et à jour pour choisir chaque type de machine, puis générer la configuration adaptée en un clic.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}`} className="card card-glow group flex flex-col p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/25 text-brand-300">
              <Icon name={g.icon} className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{g.title}</h2>
            <p className="muted mt-1 flex-1 text-sm">{g.excerpt}</p>
            <div className="muted mt-4 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {g.readingMinutes} min
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-brand-400">
                Lire <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function GuideDetail() {
  const { slug } = useParams()
  const guide = GUIDES.find((g) => g.slug === slug)
  if (!guide) return <Navigate to="/guides" replace />
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3)
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/guides" className="btn btn-ghost btn-sm">
        <ArrowLeft className="h-3.5 w-3.5" /> Tous les guides
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/25 text-brand-300">
            <Icon name={guide.icon} className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight">{guide.title}</h1>
          <p className="muted mt-2 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {guide.readingMinutes} min de lecture
            </span>
            <span>Mis à jour le {new Date(guide.updated).toLocaleDateString('fr-FR')}</span>
          </p>
          <p className="mt-6 text-lg leading-relaxed">{guide.excerpt}</p>
          {guide.sections.map((s, i) => (
            <section key={s.heading} id={`s${i}`} className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-bold">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-[var(--text)]/90">
                  {p}
                </p>
              ))}
              {s.tips && s.tips.length > 0 && (
                <ul className="card-soft mt-5 flex flex-col gap-2 p-4 text-sm">
                  {s.tips.map((t) => (
                    <li key={t} className="flex gap-2">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /> {t}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <div className="gradient-border mt-12 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Passez à la pratique</h2>
            <p className="muted mt-1 text-sm">Le générateur applique ces conseils automatiquement à votre budget.</p>
            <Link to={guide.cta.to} className="btn btn-primary mt-4">
              <Sparkles className="h-4 w-4" /> {guide.cta.label}
            </Link>
          </div>
        </article>
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-5">
            <div className="label mb-3">Sommaire</div>
            <ol className="flex flex-col gap-2 text-sm">
              {guide.sections.map((s, i) => (
                <li key={s.heading}>
                  <a href={`#s${i}`} className="muted hover:text-brand-400">
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="card mt-4 p-5">
            <div className="label mb-3">À lire aussi</div>
            <ul className="flex flex-col gap-3 text-sm">
              {others.map((g) => (
                <li key={g.slug}>
                  <Link to={`/guides/${g.slug}`} className="font-medium hover:text-brand-400">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
