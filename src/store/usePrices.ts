import { useEffect, useMemo, useState } from 'react'
import { displayName } from '../engine/catalog'
import { createPriceProvider, type PriceProvider, type PriceResult } from '../services/pricing'
import type { PCComponent } from '../types'
import { useStore } from './useStore'

const cache = new Map<string, PriceResult>()

export function usePriceProvider(): PriceProvider {
  const settings = useStore((s) => s.priceSettings)
  return useMemo(() => createPriceProvider(settings), [settings])
}

export interface LivePrices {
  provider: PriceProvider
  results: Map<string, PriceResult>
  loading: boolean
  error: string | null
  /** Prix live (meilleure offre) sinon prix catalogue. */
  price: (c: PCComponent) => number
  isLive: (id: string) => boolean
}

/** Récupère les prix live du comparateur pour une liste de composants (avec cache mémoire). */
export function useLivePrices(items: PCComponent[]): LivePrices {
  const provider = usePriceProvider()
  const [version, setVersion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const key = items.map((i) => i.id).sort().join(',')

  useEffect(() => {
    const missing = items.filter((i) => !cache.has(i.id))
    if (!missing.length || provider.name === 'Prix indicatifs') return
    const ctrl = new AbortController()
    setLoading(true)
    setError(null)
    provider
      .getPrices(
        missing.map((i) => ({ id: i.id, name: displayName(i), category: i.category, ean: i.ean, mpn: i.mpn })),
        ctrl.signal,
      )
      .then((res) => {
        res.forEach((r) => cache.set(r.id, r))
        setVersion((v) => v + 1)
      })
      .catch((e: unknown) => {
        if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : String(e))
      })
      .finally(() => !ctrl.signal.aborted && setLoading(false))
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, provider])

  return useMemo(() => {
    const results = new Map<string, PriceResult>()
    items.forEach((i) => {
      const r = cache.get(i.id)
      if (r) results.set(i.id, r)
    })
    return {
      provider,
      results,
      loading,
      error,
      price: (c) => results.get(c.id)?.best?.price ?? c.price,
      isLive: (id) => !!results.get(id)?.best,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, provider, version, loading, error])
}
