import { describe, expect, it } from 'vitest'
import { breakdown, effectiveVat, toHT, toTTC } from './tax'

describe('TVA', () => {
  it('déduit le HT d’un prix TTC France', () => {
    expect(toHT(120)).toBeCloseTo(100)
  })
  it('recalcule le TTC pour un autre pays', () => {
    expect(toTTC(120, 21)).toBeCloseTo(121)
    expect(toTTC(120, 0)).toBeCloseTo(100)
  })
  it('décompose HT / TVA / TTC', () => {
    const b = breakdown(1200, 20)
    expect(b.ht).toBeCloseTo(1000)
    expect(b.vat).toBeCloseTo(200)
    expect(b.ttc).toBeCloseTo(1200)
  })
  it('applique taux forcé et franchise', () => {
    expect(effectiveVat({ country: 'BE' })).toBe(21)
    expect(effectiveVat({ country: 'FR', vatRate: 5.5 })).toBe(5.5)
    expect(effectiveVat({ country: 'FR', vatExempt: true })).toBe(0)
  })
})
