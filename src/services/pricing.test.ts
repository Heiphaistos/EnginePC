import { describe, expect, it } from 'vitest'
import { createPriceProvider, parseLookup } from './pricing'

const offer = { merchant: 'LDLC', price: 469.95, currency: 'EUR', url: 'https://www.ldlc.com/x', inStock: true, shipping: 0, updatedAt: '2026-09-24T10:00:00Z' }

describe('comparateur de prix', () => {
  it('lit une réponse conforme au contrat et choisit la meilleure offre si `best` est absent', () => {
    const [r] = parseLookup({ results: [{ id: 'a', offers: [offer, { ...offer, merchant: 'Amazon', price: 450, shipping: 5 }] }] })
    expect(r.best?.merchant).toBe('Amazon')
    expect(r.offers).toHaveLength(2)
  })

  it('écarte les offres invalides (lien non http, prix absent, autre devise)', () => {
    const [r] = parseLookup({
      results: [{ id: 'a', best: { ...offer, url: 'javascript:alert(1)' }, offers: [{ ...offer, price: 'x' }, { ...offer, currency: 'USD' }, offer] }],
    })
    expect(r.offers).toHaveLength(1)
    expect(r.best?.url).toBe('https://www.ldlc.com/x')
  })

  it('tolère une réponse inattendue', () => {
    expect(parseLookup(null)).toEqual([])
    expect(parseLookup({ results: 'x' })).toEqual([])
    expect(parseLookup({ results: [{ nope: 1 }] })).toEqual([])
  })

  it('sans URL (ou URL invalide), prix indicatifs uniquement', () => {
    expect(createPriceProvider({ baseUrl: '', currency: 'EUR', country: 'FR' }).baseUrl).toBe('')
    expect(createPriceProvider({ baseUrl: 'pas une url', currency: 'EUR', country: 'FR' }).baseUrl).toBe('')
  })

  it('construit les liens profonds du contrat', () => {
    const p = createPriceProvider({ baseUrl: 'https://searchit.heiphaistos.org/', currency: 'EUR', country: 'FR' })
    expect(p.productUrl({ id: 'a', name: 'AMD Ryzen 7 9800X3D', category: 'cpu' })).toBe(
      'https://searchit.heiphaistos.org/recherche?q=AMD+Ryzen+7+9800X3D&ref=a&category=cpu',
    )
    expect(p.buildUrl?.('abc')).toBe('https://searchit.heiphaistos.org/configuration?data=abc&source=enginepc')
  })
})
