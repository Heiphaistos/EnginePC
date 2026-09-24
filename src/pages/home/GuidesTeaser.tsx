import { ArrowRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { GUIDES } from '../../data/content/guides'

export function GuidesTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="label text-brand-400">Guides d’achat</div>
          <h2 className="mt-1 text-3xl font-bold">Comprendre avant d’acheter</h2>
        </div>
        <Link to="/guides" className="btn btn-ghost btn-sm">
          <BookOpen className="h-3.5 w-3.5" /> Tous les guides
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {GUIDES.slice(0, 3).map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}`} className="card card-glow group flex flex-col p-6">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/15 text-brand-400">
              <Icon name={g.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{g.title}</h3>
            <p className="muted mt-1 flex-1 text-sm">{g.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-400">
              Lire · {g.readingMinutes} min <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
