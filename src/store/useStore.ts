import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEVICE_TYPE_BY_ID, PROFILE_BY_ID } from '../data/profiles'
import { DEFAULT_PRICE_SETTINGS, type PriceSettings } from '../services/pricing'
import type { Build, BuildSlots, Device, DeviceType, PCComponent, UsageProfile } from '../types'
import { uid } from '../lib/id'

export interface QuoteInfo {
  company: string
  address: string
  siret: string
  vatNumber: string
  email: string
  phone: string
  /** Durée de validité du devis (jours). */
  validityDays: number
  /** Montage, tests et installation logicielle (TTC catalogue, 0 = non facturé). */
  assemblyFee: number
  /** Remise globale (%). */
  discountPct: number
  paymentTerms: string
  notes: string
}

export const DEFAULT_QUOTE_INFO: QuoteInfo = {
  company: '',
  address: '',
  siret: '',
  vatNumber: '',
  email: '',
  phone: '',
  validityDays: 30,
  assemblyFee: 0,
  discountPct: 0,
  paymentTerms: 'Paiement à la commande. Pénalités de retard : 3 fois le taux d’intérêt légal. Indemnité forfaitaire de recouvrement : 40 €.',
  notes: '',
}

export function newBuild(deviceType: DeviceType, profile?: UsageProfile): Build {
  const p = profile ?? DEVICE_TYPE_BY_ID[deviceType].defaultProfile
  const now = Date.now()
  return {
    id: uid(),
    name: `${DEVICE_TYPE_BY_ID[deviceType].label} ${PROFILE_BY_ID[p].label}`,
    deviceType,
    profile: p,
    slots: {},
    createdAt: now,
    updatedAt: now,
  }
}

interface State {
  /** Configuration en cours d'édition (une par type d'appareil). */
  drafts: Partial<Record<DeviceType, Build>>
  saved: Build[]
  compare: string[]
  priceSettings: PriceSettings
  /** Composants / appareils importés par l'utilisateur ou synchronisés depuis le comparateur. */
  customComponents: PCComponent[]
  customDevices: Device[]
  theme: 'dark' | 'light'
  /** Coordonnées du vendeur et options des devis. */
  quoteInfo: QuoteInfo
  quoteCounter: number
  /** Inclure la base étendue (données ouvertes) dans le configurateur et le catalogue. */
  useExtended: boolean
  /** Base étendue chargée depuis /data/extra-catalog.json (non persistée). */
  extra: PCComponent[]
  extraMeta: { generatedAt?: string; source?: string; status: 'idle' | 'loading' | 'ready' | 'error' }
  /** Taux de change depuis l'euro (non persistés). */
  rates: { base: 'EUR'; rates: Record<string, number>; source: string; date?: string }

  getDraft: (t: DeviceType) => Build
  setDraft: (b: Build) => void
  updateDraft: (t: DeviceType, patch: Partial<Build>) => void
  setSlots: (t: DeviceType, slots: BuildSlots) => void
  resetDraft: (t: DeviceType) => void
  saveBuild: (b: Build) => Build
  deleteBuild: (id: string) => void
  toggleCompare: (id: string) => void
  setPriceSettings: (s: Partial<PriceSettings>) => void
  importCatalog: (components: PCComponent[], devices: Device[]) => void
  clearCustomCatalog: () => void
  toggleTheme: () => void
  setQuoteInfo: (q: Partial<QuoteInfo>) => void
  nextQuoteNumber: () => string
  setUseExtended: (v: boolean) => void
  setExtra: (extra: PCComponent[], meta: State['extraMeta']) => void
  setRates: (r: State['rates']) => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      drafts: {},
      saved: [],
      compare: [],
      priceSettings: DEFAULT_PRICE_SETTINGS,
      customComponents: [],
      customDevices: [],
      theme: 'dark',
      quoteInfo: DEFAULT_QUOTE_INFO,
      quoteCounter: 0,
      useExtended: true,
      extra: [],
      extraMeta: { status: 'idle' },
      rates: { base: 'EUR', rates: { EUR: 1 }, source: 'aucune' },

      getDraft: (t) => get().drafts[t] ?? newBuild(t),
      setDraft: (b) => set((s) => ({ drafts: { ...s.drafts, [b.deviceType]: { ...b, updatedAt: Date.now() } } })),
      updateDraft: (t, patch) => {
        const cur = get().getDraft(t)
        get().setDraft({ ...cur, ...patch })
      },
      setSlots: (t, slots) => get().updateDraft(t, { slots }),
      resetDraft: (t) => set((s) => ({ drafts: { ...s.drafts, [t]: newBuild(t, s.drafts[t]?.profile) } })),
      saveBuild: (b) => {
        const exists = get().saved.some((x) => x.id === b.id)
        const build = { ...b, updatedAt: Date.now() }
        set((s) => ({ saved: exists ? s.saved.map((x) => (x.id === b.id ? build : x)) : [build, ...s.saved] }))
        return build
      },
      deleteBuild: (id) => set((s) => ({ saved: s.saved.filter((b) => b.id !== id), compare: s.compare.filter((c) => c !== id) })),
      toggleCompare: (id) =>
        set((s) => ({ compare: s.compare.includes(id) ? s.compare.filter((c) => c !== id) : [...s.compare, id].slice(-4) })),
      setPriceSettings: (p) => set((s) => ({ priceSettings: { ...s.priceSettings, ...p } })),
      importCatalog: (components, devices) =>
        set((s) => {
          const comp = new Map(s.customComponents.map((c) => [c.id, c]))
          components.forEach((c) => comp.set(c.id, c))
          const dev = new Map(s.customDevices.map((d) => [d.id, d]))
          devices.forEach((d) => dev.set(d.id, d))
          return { customComponents: [...comp.values()], customDevices: [...dev.values()] }
        }),
      clearCustomCatalog: () => set({ customComponents: [], customDevices: [] }),
      setQuoteInfo: (q) => set((s) => ({ quoteInfo: { ...DEFAULT_QUOTE_INFO, ...s.quoteInfo, ...q } })),
      nextQuoteNumber: () => {
        const n = get().quoteCounter + 1
        set({ quoteCounter: n })
        const d = new Date()
        return `DEV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}-${String(n).padStart(4, '0')}`
      },
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setUseExtended: (v) => set({ useExtended: v }),
      setExtra: (extra, extraMeta) => set({ extra, extraMeta }),
      setRates: (rates) => set({ rates }),
    }),
    {
      name: 'enginepc',
      version: 1,
      partialize: ({ extra: _e, extraMeta: _m, rates: _r, ...rest }) => rest,
    },
  ),
)
