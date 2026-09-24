import { CATEGORY_LABELS } from '../data/catalog'
import { DEVICE_TYPE_BY_ID, PROFILE_BY_ID } from '../data/profiles'
import { displayName, type Catalog } from '../engine/catalog'
import { checkBuild } from '../engine/compatibility'
import { estimatePowerW, lineItems, resolveBuild, totalPrice } from '../engine/resolve'
import { scoreDevice, scoreResolved } from '../engine/scoring'
import type { Build, PCComponent } from '../types'
import { formatPrice } from './format'

export const EXPORT_SCHEMA_VERSION = 1

/** Format d'échange JSON (consommé aussi par le comparateur de prix). */
export interface BuildExport {
  schema: 'enginepc.build'
  version: number
  exportedAt: string
  build: Build
  summary: {
    deviceType: string
    profile: string
    totalPrice: number
    currency: 'EUR'
    score: number
    estimatedPowerW?: number
  }
  items: {
    id: string
    category: string
    brand: string
    model: string
    qty: number
    unitPrice: number
    ean?: string
    mpn?: string
  }[]
}

export function buildToExport(build: Build, catalog: Catalog, price: (c: PCComponent) => number = (c) => c.price): BuildExport {
  const base = {
    schema: 'enginepc.build' as const,
    version: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    build,
  }
  if (build.deviceId) {
    const d = catalog.deviceById.get(build.deviceId)
    return {
      ...base,
      summary: {
        deviceType: build.deviceType,
        profile: build.profile,
        totalPrice: d?.price ?? 0,
        currency: 'EUR',
        score: d ? Math.round(scoreDevice(d, build.profile)) : 0,
      },
      items: d ? [{ id: d.id, category: d.deviceType, brand: d.brand, model: d.model, qty: 1, unitPrice: d.price, ean: d.ean }] : [],
    }
  }
  const r = resolveBuild(build.slots, catalog)
  return {
    ...base,
    summary: {
      deviceType: build.deviceType,
      profile: build.profile,
      totalPrice: Math.round(totalPrice(r, price)),
      currency: 'EUR',
      score: Math.round(scoreResolved(r, build.profile)),
      estimatedPowerW: estimatePowerW(r),
    },
    items: lineItems(r).map(({ item, qty }) => ({
      id: item.id,
      category: item.category,
      brand: item.brand,
      model: item.model,
      qty,
      unitPrice: price(item),
      ean: item.ean,
      mpn: item.mpn,
    })),
  }
}

export function exportJson(build: Build, catalog: Catalog, price?: (c: PCComponent) => number): string {
  return JSON.stringify(buildToExport(build, catalog, price), null, 2)
}

const csvCell = (v: string | number | undefined) => {
  const s = String(v ?? '')
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportCsv(build: Build, catalog: Catalog, price?: (c: PCComponent) => number): string {
  const e = buildToExport(build, catalog, price)
  const rows = [
    ['Catégorie', 'Marque', 'Modèle', 'Quantité', 'Prix unitaire (EUR)', 'Total (EUR)', 'EAN', 'Référence'],
    ...e.items.map((i) => [
      CATEGORY_LABELS[i.category as keyof typeof CATEGORY_LABELS] ?? DEVICE_TYPE_BY_ID[i.category as keyof typeof DEVICE_TYPE_BY_ID]?.label ?? i.category,
      i.brand,
      i.model,
      i.qty,
      i.unitPrice,
      i.unitPrice * i.qty,
      i.ean,
      i.mpn,
    ]),
    ['', '', 'TOTAL', '', '', e.summary.totalPrice, '', ''],
  ]
  // Point-virgule + BOM : ouverture directe dans Excel FR.
  return '﻿' + rows.map((r) => r.map(csvCell).join(';')).join('\n')
}

export function exportMarkdown(build: Build, catalog: Catalog, price?: (c: PCComponent) => number): string {
  const e = buildToExport(build, catalog, price)
  const lines = [
    `# ${build.name}`,
    '',
    `- **Type** : ${DEVICE_TYPE_BY_ID[build.deviceType].label}`,
    `- **Usage** : ${PROFILE_BY_ID[build.profile].label}`,
    `- **Score** : ${e.summary.score}/100`,
    `- **Prix total** : ${formatPrice(e.summary.totalPrice)}`,
    ...(e.summary.estimatedPowerW ? [`- **Consommation estimée** : ~${e.summary.estimatedPowerW} W`] : []),
    '',
    '| Composant | Produit | Qté | Prix |',
    '|---|---|---:|---:|',
    ...e.items.map(
      (i) =>
        `| ${CATEGORY_LABELS[i.category as keyof typeof CATEGORY_LABELS] ?? i.category} | ${displayName(i)} | ${i.qty} | ${formatPrice(i.unitPrice * i.qty)} |`,
    ),
    '',
  ]
  if (!build.deviceId) {
    const issues = checkBuild(build.slots, catalog, build.deviceType).filter((i) => i.severity !== 'info')
    if (issues.length) lines.push('## Points d’attention', '', ...issues.map((i) => `- ${i.message}`), '')
  }
  lines.push(`_Généré avec EnginePC le ${new Date().toLocaleDateString('fr-FR')}_`)
  return lines.join('\n')
}

export function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'configuration'

// --- Lien de partage (encodage compact base64url) --------------------------

type SharePayload = Pick<Build, 'name' | 'deviceType' | 'profile' | 'slots' | 'deviceId'>

export function encodeShare(build: Build): string {
  const payload: SharePayload = {
    name: build.name,
    deviceType: build.deviceType,
    profile: build.profile,
    slots: build.slots,
    deviceId: build.deviceId,
  }
  const bytes = new TextEncoder().encode(JSON.stringify(payload))
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeShare(code: string): SharePayload | null {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    const data = JSON.parse(new TextDecoder().decode(bytes)) as SharePayload
    if (!data || typeof data !== 'object' || !data.deviceType || !data.slots) return null
    return data
  } catch {
    return null
  }
}
