import { Check, ExternalLink, Info } from 'lucide-react'
import { Price } from './Price'
import { useState } from 'react'
import { ProductDetails } from './ProductDetails'
import { cn } from '../lib/format'
import { deviceSpecs } from '../lib/specs'
import { usePriceProvider } from '../store/usePrices'
import type { Device } from '../types'
import { ScoreRing } from './Score'

export function DeviceCard({
  device,
  score,
  selected,
  onSelect,
  badge,
}: {
  device: Device
  score: number
  selected?: boolean
  onSelect?: () => void
  badge?: string
}) {
  const provider = usePriceProvider()
  const [details, setDetails] = useState(false)
  const link = provider.productUrl({ id: device.id, name: `${device.brand} ${device.model}`, category: device.deviceType, ean: device.ean })
  return (
    <div className={cn('card relative flex flex-col p-5 transition hover:border-brand-500/60', selected && 'border-brand-500 ring-1 ring-brand-500')}>
      {badge && <span className="absolute -top-2.5 left-4 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-2.5 py-0.5 text-xs font-semibold text-white">{badge}</span>}
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="muted text-xs">
            {device.brand} · {device.releaseYear}
          </div>
          <h3 className="mt-0.5 font-semibold leading-snug">{device.model}</h3>
          <div className="mt-2 text-2xl font-bold"><Price value={device.price} /></div>
        </div>
        <ScoreRing value={score} size={72} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {deviceSpecs(device).map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>
      {device.highlights.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 text-sm">
          {device.highlights.map((h) => (
            <li key={h} className="flex gap-1.5">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> {h}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex gap-2 pt-4">
        {onSelect && (
          <button className={cn('btn btn-sm flex-1', selected ? 'btn-primary' : 'btn-ghost')} onClick={onSelect}>
            {selected ? 'Sélectionné' : 'Choisir'}
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => setDetails(true)} title="Fiche produit et prix">
          <Info className="h-3.5 w-3.5" /> Fiche
        </button>
        {link && (
          <a className="btn btn-ghost btn-sm" href={link} target="_blank" rel="noopener noreferrer">
            Prix <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      {details && <ProductDetails item={device} onClose={() => setDetails(false)} />}
    </div>
  )
}
