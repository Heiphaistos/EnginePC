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
  getPrices(items: PriceQueryItem[], signal?: AbortSignal): Promise<PriceResult[]>
  /** Lien vers la fiche produit / recherche sur le comparateur. */
  productUrl(item: PriceQueryItem): string | null
  /** Lien pour envoyer une configuration complète au comparateur. */
  buildUrl?(encodedBuild: string): string | null
}

export interface PriceSettings {
  /** URL de base du comparateur, ex: https://prix.enginepc.fr */
  baseUrl: string
  apiKey?: string
  currency: string
  country: string
}

export class StaticPriceProvider implements PriceProvider {
  readonly name = 'Prix indicatifs'
  async getPrices(): Promise<PriceResult[]> {
    return []
  }
  productUrl(): string | null {
    return null
  }
}

export class HttpPriceProvider implements PriceProvider {
  readonly name = 'Comparateur de prix'
  private readonly settings: PriceSettings

  constructor(settings: PriceSettings) {
    this.settings = settings
  }

  private url(path: string): string {
    return `${this.settings.baseUrl.replace(/\/+$/, '')}${path}`
  }

  async getPrices(items: PriceQueryItem[], signal?: AbortSignal): Promise<PriceResult[]> {
    if (!items.length) return []
    const res = await fetch(this.url('/api/v1/prices/lookup'), {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(this.settings.apiKey ? { Authorization: `Bearer ${this.settings.apiKey}` } : {}),
      },
      body: JSON.stringify({ currency: this.settings.currency, country: this.settings.country, items }),
    })
    if (!res.ok) throw new Error(`Comparateur : HTTP ${res.status}`)
    const data = (await res.json()) as { results?: PriceResult[] }
    return (data.results ?? []).map((r) => ({ ...r, best: r.best ?? pickBest(r.offers ?? []) }))
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

export function pickBest(offers: Offer[]): Offer | undefined {
  const total = (o: Offer) => o.price + (o.shipping ?? 0)
  const inStock = offers.filter((o) => o.inStock)
  return [...(inStock.length ? inStock : offers)].sort((a, b) => total(a) - total(b))[0]
}

export function createPriceProvider(settings: PriceSettings): PriceProvider {
  return settings.baseUrl ? new HttpPriceProvider(settings) : new StaticPriceProvider()
}

export const DEFAULT_PRICE_SETTINGS: PriceSettings = {
  baseUrl: (import.meta.env.VITE_PRICE_API_URL as string | undefined) ?? '',
  currency: 'EUR',
  country: 'FR',
}
