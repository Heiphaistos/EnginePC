/**
 * Chargement des données ouvertes et API gratuites (sans clé, CORS autorisé) :
 *  - /data/extra-catalog.json : base étendue générée par `npm run sync` (pc-part-dataset, MIT)
 *  - /data/rates.json          : taux BCE générés par la synchro (secours hors ligne)
 *  - api.frankfurter.app       : taux de change BCE en direct
 *  - Wikipédia (REST)          : description et photo des produits
 */
import type { PCComponent } from '../types'

export interface ExtraCatalog {
  generatedAt?: string
  source?: string
  components: PCComponent[]
}

export async function fetchExtraCatalog(signal?: AbortSignal): Promise<ExtraCatalog> {
  const res = await fetch('/data/extra-catalog.json', { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as ExtraCatalog
  return { ...data, components: Array.isArray(data.components) ? data.components : [] }
}

export interface Rates {
  base: 'EUR'
  rates: Record<string, number>
  source: string
  date?: string
}

const RATES_KEY = 'enginepc-rates'

export async function fetchRates(signal?: AbortSignal): Promise<Rates> {
  try {
    const cached = JSON.parse(localStorage.getItem(RATES_KEY) ?? 'null') as (Rates & { at: number }) | null
    if (cached && Date.now() - cached.at < 12 * 3600_000) return cached
  } catch {
    /* cache illisible : on recharge */
  }
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR', { signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const d = (await res.json()) as { date: string; rates: Record<string, number> }
    const rates: Rates = { base: 'EUR', rates: { EUR: 1, ...d.rates }, source: 'BCE via Frankfurter', date: d.date }
    try {
      localStorage.setItem(RATES_KEY, JSON.stringify({ ...rates, at: Date.now() }))
    } catch {
      /* stockage indisponible */
    }
    return rates
  } catch {
    const res = await fetch('/data/rates.json', { signal })
    const d = (await res.json()) as { rates: Record<string, number>; generatedAt?: string }
    return { base: 'EUR', rates: { EUR: 1, ...d.rates }, source: 'BCE (instantané local)', date: d.generatedAt?.slice(0, 10) }
  }
}

export interface WikiSummary {
  title: string
  extract: string
  thumbnail?: string
  url: string
  lang: string
}

/** Cherche l'article Wikipédia le plus pertinent (fr puis en) et renvoie son résumé. */
export async function fetchWikiSummary(query: string, signal?: AbortSignal): Promise<WikiSummary | null> {
  for (const lang of ['fr', 'en']) {
    const search = await fetch(
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&format=json&origin=*&srsearch=${encodeURIComponent(query)}`,
      { signal },
    ).then((r) => (r.ok ? r.json() : null))
    const title: string | undefined = search?.query?.search?.[0]?.title
    if (!title) continue
    const sum = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, { signal }).then((r) =>
      r.ok ? r.json() : null,
    )
    if (sum?.extract) {
      return { title: sum.title, extract: sum.extract, thumbnail: sum.thumbnail?.source, url: sum.content_urls?.desktop?.page ?? '', lang }
    }
  }
  return null
}

/** Liens de recherche chez les principaux marchands et comparateurs (aucune API requise). */
export function merchantLinks(name: string): { label: string; url: string }[] {
  const q = encodeURIComponent(name)
  return [
    { label: 'Idealo', url: `https://www.idealo.fr/prechcat.html?q=${q}` },
    { label: 'LDLC', url: `https://www.ldlc.com/recherche/${q}/` },
    { label: 'Materiel.net', url: `https://www.materiel.net/recherche/${q}/` },
    { label: 'Amazon', url: `https://www.amazon.fr/s?k=${q}` },
    { label: 'Top Achat', url: `https://www.topachat.com/pages/recherche.php?q=${q}` },
    { label: 'Ledenicheur', url: `https://ledenicheur.fr/search?search=${q}` },
    { label: 'Rue du Commerce', url: `https://www.rueducommerce.fr/r/${q}.html` },
    { label: 'Boulanger', url: `https://www.boulanger.com/resultats?tr=${q}` },
    { label: 'Fnac', url: `https://www.fnac.com/SearchResult/ResultList.aspx?Search=${q}` },
    { label: 'Back Market (reconditionné)', url: `https://www.backmarket.fr/fr-fr/search?q=${q}` },
    { label: 'leboncoin (occasion)', url: `https://www.leboncoin.fr/recherche?text=${q}` },
  ]
}
