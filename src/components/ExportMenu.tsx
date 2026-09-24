import { Check, ChevronDown, Download, FileJson, FileSpreadsheet, FileText, Link2, Printer, Receipt, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { vatRate } from '../lib/format'
import { useEffect, useRef, useState } from 'react'
import { download, encodeShare, exportCsv, exportJson, exportMarkdown, slug } from '../lib/export'
import { useCatalog } from '../store/catalog'
import { usePriceProvider } from '../store/usePrices'
import type { Build, PCComponent } from '../types'

export function shareUrl(build: Build): string {
  return `${window.location.origin}/partage/${encodeShare(build)}`
}

export function ExportMenu({ build, price, compact }: { build: Build; price?: (c: PCComponent) => number; compact?: boolean }) {
  const catalog = useCatalog()
  const provider = usePriceProvider()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const name = slug(build.name)
  const actions = [
    { icon: FileJson, label: 'JSON (format EnginePC)', run: () => download(`${name}.json`, exportJson(build, catalog, { price, vatRate: vatRate() }), 'application/json') },
    { icon: FileSpreadsheet, label: 'CSV (Excel)', run: () => download(`${name}.csv`, exportCsv(build, catalog, { price, vatRate: vatRate() }), 'text/csv;charset=utf-8') },
    { icon: FileText, label: 'Markdown', run: () => download(`${name}.md`, exportMarkdown(build, catalog, { price, vatRate: vatRate() }), 'text/markdown') },
    { icon: Receipt, label: 'Devis HT / TTC (PDF)', run: () => navigate(`/devis/${encodeShare(build)}`) },
    { icon: Printer, label: 'Imprimer la page', run: () => window.print() },
    {
      icon: copied ? Check : Link2,
      label: copied ? 'Lien copié !' : 'Copier le lien de partage',
      run: async () => {
        await navigator.clipboard.writeText(shareUrl(build))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      keepOpen: true,
    },
  ]
  const buildLink = provider.buildUrl?.(encodeShare(build))

  return (
    <div className="relative" ref={ref}>
      <button className="btn btn-ghost w-full" onClick={() => setOpen(!open)}>
        <Download className="h-4 w-4" /> {compact ? 'Exporter' : 'Exporter / partager'} <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="card absolute right-0 z-30 mt-2 w-64 overflow-hidden p-1 shadow-2xl">
          {actions.map((a) => (
            <button
              key={a.label}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--bg-soft)]"
              onClick={() => {
                void a.run()
                if (!a.keepOpen) setOpen(false)
              }}
            >
              <a.icon className="h-4 w-4 text-brand-400" /> {a.label}
            </button>
          ))}
          {buildLink && (
            <a href={buildLink} target="_blank" rel="noreferrer" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-[var(--bg-soft)]">
              <ShoppingCart className="h-4 w-4 text-emerald-400" /> Envoyer au comparateur
            </a>
          )}
        </div>
      )}
    </div>
  )
}
