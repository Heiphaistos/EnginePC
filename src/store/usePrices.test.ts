import { expect, test } from 'vitest'
import { plausible } from './usePrices'

test('offre live écartée hors de [1/3 ; 3×] du prix catalogue', () => {
  expect(plausible(124.9, 105)).toBe(true)
  expect(plausible(419.38, 115)).toBe(false) // B760M marketplace
  expect(plausible(10, 115)).toBe(false)
  expect(plausible(50, 0)).toBe(true) // pas de prix catalogue : rien à comparer
})
