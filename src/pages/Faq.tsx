import { ChevronDown, HelpCircle } from 'lucide-react'
import { FAQ } from '../data/content/faq'

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="label text-brand-400">Aide</div>
      <h1 className="mt-1 flex items-center gap-2 text-4xl font-bold">
        <HelpCircle className="h-8 w-8 text-brand-400" /> Questions fréquentes
      </h1>
      <div className="mt-8 flex flex-col gap-3">
        {FAQ.map((f) => (
          <details key={f.q} className="card group p-5 open:border-brand-500/50">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {f.q}
              <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
            </summary>
            <p className="muted mt-3 text-sm leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
