import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { displayName } from '../engine/catalog'
import { createPriceProvider, type Offer, type PriceProvider, type PriceResult } from '../services/pricing'
import type { PCComponent } from '../types'
import { useStore } from './useStore'

/**
 * Cache partagé des prix live (durée de la session), clé = `<url du comparateur>|<id produit>`.
 * `null` = produit absent chez le comparateur : on ne le redemande pas.
 */
const cache = new Map<string, PriceResult | null>()
const pending = new Set<string>()
/** Après un échec (réseau, timeout, HTTP), pause avant de réinterroger ce comparateur. */
const failures = new Map<string, { until: number; message: string }>()
const health = new Map<string, { demo: boolean } | 'pending' | 'error'>()

const RETRY_AFTER_MS = 60_000
const DEBOUNCE_MS = 300
const BATCH_SIZE = 100

let version = 0
const listeners = new Set<() => void>()
const notify = () => {
  version++
  listeners.forEach((l) => l())
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
const useCacheVersion = () => useSyncExternalStore(subscribe, () => version)

export function usePriceProvider(): PriceProvider {
  const settings = useStore((s) => s.priceSettings)
  return useMemo(() => createPriceProvider(settings), [settings])
}

function requestPrices(provider: PriceProvider, items: PCComponent[]) {
  const base = provider.baseUrl
  if ((failures.get(base)?.until ?? 0) > Date.now()) return
  const missing = items.filter((i) => !cache.has(`${base}|${i.id}`) && !pending.has(`${base}|${i.id}`))
  for (let k = 0; k < missing.length; k += BATCH_SIZE) {
    const chunk = missing.slice(k, k + BATCH_SIZE)
    chunk.forEach((i) => pending.add(`${base}|${i.id}`))
    provider
      .getPrices(chunk.map((i) => ({ id: i.id, name: displayName(i), category: i.category, ean: i.ean, mpn: i.mpn })))
      .then((res) => {
        const byId = new Map(res.map((r) => [r.id, r]))
        chunk.forEach((i) => {
          const r = byId.get(i.id)
          cache.set(`${base}|${i.id}`, r?.best ? r : null)
        })
        failures.delete(base)
      })
      .catch((e: unknown) => {
        const timeout = e instanceof DOMException && e.name === 'TimeoutError'
        // fetch rejette en TypeError pour une panne réseau ou un refus CORS.
        const message = timeout ? 'délai dépassé' : e instanceof TypeError ? 'injoignable' : e instanceof Error ? e.message : String(e)
        failures.set(base, { until: Date.now() + RETRY_AFTER_MS, message })
      })
      .finally(() => {
        chunk.forEach((i) => pending.delete(`${base}|${i.id}`))
        notify()
      })
  }
}

/** Vérifie une fois par session si le comparateur est en mode démonstration (`GET /api/health`). */
export function useComparatorHealth(): { demo: boolean } | null {
  const provider = usePriceProvider()
  useCacheVersion()
  const base = provider.baseUrl
  useEffect(() => {
    if (!provider.health || health.has(base)) return
    health.set(base, 'pending')
    provider
      .health()
      .then((h) => health.set(base, h))
      .catch(() => health.set(base, 'error'))
      .finally(notify)
  }, [provider, base])
  const h = health.get(base)
  return h && typeof h === 'object' ? h : null
}

export interface LivePrices {
  provider: PriceProvider
  results: Map<string, PriceResult>
  loading: boolean
  error: string | null
  /** Prix live (meilleure offre) sinon prix catalogue. */
  price: (c: PCComponent) => number
  isLive: (id: string) => boolean
  /** Meilleure offre live du comparateur, si connue. */
  offer: (id: string) => Offer | undefined
}

/** Prix live du comparateur pour une liste de composants (cache partagé, requêtes groupées et temporisées). */
export function useLivePrices(items: PCComponent[]): LivePrices {
  const provider = usePriceProvider()
  const v = useCacheVersion()
  const base = provider.baseUrl
  const key = items.map((i) => i.id).sort().join(',')

  useEffect(() => {
    if (!base) return
    const t = setTimeout(() => requestPrices(provider, items), DEBOUNCE_MS)
    return () => clearTimeout(t)
    // `key` résume `items` : inutile de relancer à chaque nouveau tableau.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, provider, base])

  return useMemo(() => {
    const results = new Map<string, PriceResult>()
    let loading = false
    let unresolved = false
    items.forEach((i) => {
      const k = `${base}|${i.id}`
      const r = cache.get(k)
      if (r) results.set(i.id, r)
      if (pending.has(k)) loading = true
      if (!cache.has(k)) unresolved = true
    })
    const failure = failures.get(base)
    return {
      provider,
      results,
      loading,
      error: base && unresolved && failure ? failure.message : null,
      price: (c) => results.get(c.id)?.best?.price ?? c.price,
      isLive: (id) => !!results.get(id)?.best,
      offer: (id) => results.get(id)?.best,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, provider, base, v])
}
