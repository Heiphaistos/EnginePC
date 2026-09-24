import { BookA, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { GLOSSARY } from '../data/content/glossary'
import { cn } from '../lib/format'

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function Glossary() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const categories = useMemo(() => [...new Set(GLOSSARY.map((t) => t.category))], [])
  const terms = useMemo(
    () =>
      GLOSSARY.filter((t) => !cat || t.category === cat)
        .filter((t) => !q || norm(`${t.term} ${t.definition}`).includes(norm(q)))
        .sort((a, b) => a.term.localeCompare(b.term, 'fr')),
    [q, cat],
  )
  const letters = [...new Set(terms.map((t) => norm(t.term)[0].toUpperCase()))]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="label text-brand-400">Ressources</div>
      <h1 className="mt-1 flex items-center gap-2 text-4xl font-bold">
        <BookA className="h-8 w-8 text-brand-400" /> Glossaire
      </h1>
      <p className="muted mt-2">{GLOSSARY.length} termes du matériel informatique expliqués simplement.</p>
      <div className="card mt-6 grid gap-3 p-4">
        <label className="relative">
          <Search className="muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input className="input pl-9" placeholder="Rechercher un terme (TDP, ECC, VRAM…)" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button className={cn('chip cursor-pointer', !cat && 'border-brand-500 text-brand-400')} onClick={() => setCat('')}>
            Tout
          </button>
          {categories.map((c) => (
            <button key={c} className={cn('chip cursor-pointer', cat === c && 'border-brand-500 text-brand-400')} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {letters.map((l) => (
        <section key={l} className="mt-8">
          <h2 className="font-display gradient-text text-2xl font-bold">{l}</h2>
          <dl className="mt-3 grid gap-3 md:grid-cols-2">
            {terms
              .filter((t) => norm(t.term)[0].toUpperCase() === l)
              .map((t) => (
                <div key={t.term} className="card p-4">
                  <dt className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{t.term}</span>
                    <span className="chip">{t.category}</span>
                  </dt>
                  <dd className="muted mt-2 text-sm leading-relaxed">{t.definition}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
      {terms.length === 0 && <p className="muted mt-10 text-center">Aucun terme trouvé.</p>}
    </div>
  )
}
