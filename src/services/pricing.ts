import type { PriceMode } from '../lib/tax'

/**
 * Câblage avec le comparateur de prix (site séparé).
 *
 * EnginePC ne dépend d'aucune implémentation : il parle à un `PriceProvider`.
 *  - `StaticPriceProvider` : prix indicatifs du catalogue (fonctionne hors ligne).
 *  - `HttpPriceProvider`   : interroge l'API du comparateur (contrat dans docs/INTEGRATION.md).
 *
 * Le contrat est volontairement simple pour que le comparateur puisse l'implémenter tel quel.
 */

export interface PriceQueryItem {
  id: string
  name: string
  category: string
  ean?: string
  mpn?: string
}

export interface Offer {
  merchant: string
  price: number
  currency: string
  url: string
  inStock: boolean
  shipping?: number
  updatedAt?: string
}

export interface PriceResult {
  id: string
  /** Meilleure offre (prix + livraison le plus bas, en stock en priorité). */
  best?: Offer
  offers: Offer[]
}

export interface PriceProvider {
  readonly name: string
  /** URL de base du comparateur ('' = prix indicatifs uniquement). */
  readonly baseUrl: string
  getPrices(items: PriceQueryItem[], signal?: AbortSignal): Promise<PriceResult[]>
  /** Lien vers la fiche produit / recherche sur le comparateur. */
  productUrl(item: PriceQueryItem): string | null
  /** Lien pour envoyer une configuration complète au comparateur. */
  buildUrl?(encodedBuild: string): string | null
  /** État du comparateur (`GET /api/health`), si disponible. */
  health?(signal?: AbortSignal): Promise<{ demo: boolean }>
}

export interface PriceSettings {
  /** URL de base du comparateur, ex: https://prix.enginepc.fr */
  baseUrl: string
  apiKey?: string
  currency: string
  country: string
  /** Taux de TVA forcé (%) ; sinon taux du pays. */
  vatRate?: number
  /** Franchise en base de TVA (art. 293 B du CGI). */
  vatExempt?: boolean
  /** Affichage des prix : TTC, HT ou les deux. */
  priceMode?: PriceMode
}

export class StaticPriceProvider implements PriceProvider {
  readonly name = 'Prix indicatifs'
  readonly baseUrl = ''
  async getPrices(): Promise<PriceResult[]> {
    return []
  }
  productUrl(): string | null {
    return null
  }
}

export class HttpPriceProvider implements PriceProvider {
  readonly name = 'Comparateur de prix'
  readonly baseUrl: string
  private readonly settings: PriceSettings

  constructor(settings: PriceSettings) {
    this.settings = settings
    this.baseUrl = settings.baseUrl.replace(/\/+$/, '')
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`
  }

  async getPrices(items: PriceQueryItem[], signal?: AbortSignal): Promise<PriceResult[]> {
    if (!items.length) return []
    // Les prix du catalogue sont en EUR : on demande toujours de l'EUR, la conversion d'affichage est faite localement.
    const res = await fetch(this.url('/api/v1/prices/lookup'), {
      method: 'POST',
      signal: withTimeout(signal, LOOKUP_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        ...(this.settings.apiKey ? { Authorization: `Bearer ${this.settings.apiKey}` } : {}),
      },
      body: JSON.stringify({ currency: 'EUR', country: this.settings.country, items }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return parseLookup(await res.json())
  }

  /** `GET /api/health` : indique notamment si le comparateur sert des prix de démonstration. */
  async health(signal?: AbortSignal): Promise<{ demo: boolean }> {
    const res = await fetch(this.url('/api/health'), { signal: withTimeout(signal, HEALTH_TIMEOUT_MS) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: unknown = await res.json()
    return { demo: isRecord(data) && data.demo === true }
  }

  productUrl(item: PriceQueryItem): string {
    const q = new URLSearchParams({ q: item.name, ref: item.id, category: item.category })
    if (item.ean) q.set('ean', item.ean)
    if (item.mpn) q.set('mpn', item.mpn)
    return this.url(`/recherche?${q}`)
  }

  buildUrl(encodedBuild: string): string {
    return this.url(`/configuration?data=${encodeURIComponent(encodedBuild)}&source=enginepc`)
  }
}

const LOOKUP_TIMEOUT_MS = 10_000
const HEALTH_TIMEOUT_MS = 5_000

/** Signal annulé par l'appelant ou au bout de `ms` millisecondes. */
function withTimeout(signal: AbortSignal | undefined, ms: number): AbortSignal {
  const timeout = AbortSignal.timeout(ms)
  return signal ? AbortSignal.any([signal, timeout]) : timeout
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

/** N'accepte que des liens http(s) : la réponse vient d'un autre site (pas de `javascript:`). */
function safeUrl(v: unknown): string | null {
  if (typeof v !== 'string') return null
  try {
    const u = new URL(v)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null
  } catch {
    return null
  }
}

/** Valide une offre reçue du comparateur ; seules les offres en EUR sont retenues. */
function parseOffer(v: unknown): Offer | null {
  if (!isRecord(v)) return null
  const url = safeUrl(v.url)
  const price = v.price
  if (!url || typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return null
  if (v.currency !== undefined && v.currency !== 'EUR') return null
  const shipping = typeof v.shipping === 'number' && Number.isFinite(v.shipping) && v.shipping >= 0 ? v.shipping : undefined
  const updatedAt = typeof v.updatedAt === 'string' && !Number.isNaN(Date.parse(v.updatedAt)) ? v.updatedAt : undefined
  return {
    merchant: typeof v.merchant === 'string' && v.merchant.trim() ? v.merchant.trim().slice(0, 60) : 'Marchand',
    price,
    currency: 'EUR',
    url,
    inStock: v.inStock === true,
    shipping,
    updatedAt,
  }
}

/** Valide la réponse de `POST /api/v1/prices/lookup` (données externes : rien n'est supposé). */
export function parseLookup(data: unknown): PriceResult[] {
  if (!isRecord(data) || !Array.isArray(data.results)) return []
  const out: PriceResult[] = []
  for (const r of data.results) {
    if (!isRecord(r) || typeof r.id !== 'string') continue
    const offers = (Array.isArray(r.offers) ? r.offers : []).map(parseOffer).filter((o): o is Offer => !!o)
    const best = parseOffer(r.best) ?? pickBest(offers)
    out.push({ id: r.id, best: best ?? undefined, offers })
  }
  return out
}

export function pickBest(offers: Offer[]): Offer | undefined {
  const total = (o: Offer) => o.price + (o.shipping ?? 0)
  const inStock = offers.filter((o) => o.inStock)
  return [...(inStock.length ? inStock : offers)].sort((a, b) => total(a) - total(b))[0]
}

export function createPriceProvider(settings: PriceSettings): PriceProvider {
  return safeUrl(settings.baseUrl) ? new HttpPriceProvider(settings) : new StaticPriceProvider()
}

export const DEFAULT_PRICE_SETTINGS: PriceSettings = {
  baseUrl: ((import.meta.env.VITE_PRICE_API_URL as string | undefined) ?? '').trim(),
  currency: 'EUR',
  country: 'FR',
  priceMode: 'ttc',
}
