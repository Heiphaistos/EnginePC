/**
 * TVA : les prix du catalogue sont stockés en euros TTC France (TVA 20 %).
 * On en déduit le HT, puis le TTC du pays choisi.
 */

/** Taux de TVA standard par pays (%). US : taxe de vente variable selon l'État, non incluse. */
export const VAT_BY_COUNTRY: Record<string, number> = {
  FR: 20,
  BE: 21,
  CH: 8.1,
  LU: 17,
  DE: 19,
  ES: 21,
  IT: 22,
  NL: 21,
  PT: 23,
  AT: 20,
  IE: 23,
  PL: 23,
  UK: 20,
  CA: 5,
  US: 0,
}

export const COUNTRY_LABELS: Record<string, string> = {
  FR: 'France',
  BE: 'Belgique',
  CH: 'Suisse',
  LU: 'Luxembourg',
  DE: 'Allemagne',
  ES: 'Espagne',
  IT: 'Italie',
  NL: 'Pays-Bas',
  PT: 'Portugal',
  AT: 'Autriche',
  IE: 'Irlande',
  PL: 'Pologne',
  UK: 'Royaume-Uni',
  CA: 'Canada (TPS)',
  US: 'États-Unis (hors taxe de vente)',
}

/** TVA incluse dans les prix du catalogue. */
export const CATALOG_VAT = 20

export type PriceMode = 'ttc' | 'ht' | 'both'

export interface TaxSettings {
  country: string
  /** Taux forcé (%), sinon celui du pays. */
  vatRate?: number
  /** Franchise en base de TVA (auto-entrepreneur) : TVA non applicable. */
  vatExempt?: boolean
}

export function effectiveVat(s: TaxSettings): number {
  if (s.vatExempt) return 0
  if (typeof s.vatRate === 'number' && Number.isFinite(s.vatRate)) return s.vatRate
  return VAT_BY_COUNTRY[s.country] ?? CATALOG_VAT
}

/** Prix HT à partir d'un prix catalogue (TTC France). */
export const toHT = (catalogTtc: number) => catalogTtc / (1 + CATALOG_VAT / 100)

/** Prix TTC dans le pays / taux choisi à partir d'un prix catalogue. */
export const toTTC = (catalogTtc: number, vatPct: number) => toHT(catalogTtc) * (1 + vatPct / 100)

export interface Breakdown {
  ht: number
  vat: number
  ttc: number
  rate: number
}

export function breakdown(catalogTtc: number, vatPct: number): Breakdown {
  const ht = toHT(catalogTtc)
  const ttc = ht * (1 + vatPct / 100)
  return { ht, vat: ttc - ht, ttc, rate: vatPct }
}
