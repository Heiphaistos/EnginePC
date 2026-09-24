import { CheckCircle2, Loader2, Plug, Trash2, Upload, XCircle } from 'lucide-react'
import { useRef, useState } from 'react'
import { createPriceProvider } from '../services/pricing'
import { useCatalog } from '../store/catalog'
import { useStore } from '../store/useStore'
import type { Device, PCComponent } from '../types'

export function Settings() {
  const settings = useStore((s) => s.priceSettings)
  const setPriceSettings = useStore((s) => s.setPriceSettings)
  const importCatalog = useStore((s) => s.importCatalog)
  const clearCustomCatalog = useStore((s) => s.clearCustomCatalog)
  const custom = useStore((s) => s.customComponents.length + s.customDevices.length)
  const catalog = useCatalog()
  const [form, setForm] = useState(settings)
  const [test, setTest] = useState<{ state: 'idle' | 'loading' | 'ok' | 'error'; message?: string }>({ state: 'idle' })
  const [syncMsg, setSyncMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const runTest = async () => {
    setTest({ state: 'loading' })
    try {
      const provider = createPriceProvider(form)
      const sample = catalog.components.slice(0, 3)
      const res = await provider.getPrices(sample.map((c) => ({ id: c.id, name: `${c.brand} ${c.model}`, category: c.category, ean: c.ean, mpn: c.mpn })))
      setTest({ state: 'ok', message: `${res.length} résultat(s) reçu(s) du comparateur.` })
    } catch (e) {
      setTest({ state: 'error', message: e instanceof Error ? e.message : String(e) })
    }
  }

  const syncCatalog = async () => {
    setSyncMsg('Synchronisation…')
    try {
      const res = await fetch(`${form.baseUrl.replace(/\/+$/, '')}/api/v1/catalog`, { headers: form.apiKey ? { Authorization: `Bearer ${form.apiKey}` } : {} })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as { components?: PCComponent[]; devices?: Device[] }
      importCatalog(data.components ?? [], data.devices ?? [])
      setSyncMsg(`${(data.components?.length ?? 0) + (data.devices?.length ?? 0)} produit(s) synchronisé(s).`)
    } catch (e) {
      setSyncMsg(`Échec : ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const importFile = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as { components?: PCComponent[]; devices?: Device[] }
      if (!Array.isArray(data.components) && !Array.isArray(data.devices)) throw new Error('format')
      importCatalog(data.components ?? [], data.devices ?? [])
      setSyncMsg(`${(data.components?.length ?? 0) + (data.devices?.length ?? 0)} produit(s) importé(s).`)
    } catch {
      setSyncMsg('Fichier invalide : { "components": [...], "devices": [...] } attendu.')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Paramètres</h1>

      <section className="card mt-6 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Plug className="h-5 w-5 text-brand-400" /> Connexion au comparateur de prix
        </h2>
        <p className="muted mt-1 text-sm">
          Renseignez l’URL de votre site comparateur. EnginePC appellera <code>POST /api/v1/prices/lookup</code> pour afficher les prix live et
          proposera l’envoi des configurations vers <code>/configuration</code>. Laissez vide pour utiliser les prix indicatifs.
        </p>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="label">URL du comparateur</span>
            <input className="input" placeholder="https://prix.heiphaistos.org" value={form.baseUrl} onChange={(e) => setForm({ ...form, baseUrl: e.target.value.trim() })} />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="label">Clé d’API (optionnelle)</span>
            <input className="input" type="password" value={form.apiKey ?? ''} onChange={(e) => setForm({ ...form, apiKey: e.target.value || undefined })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span className="label">Pays</span>
              <select className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                {['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'CA', 'US', 'UK'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="label">Devise</span>
              <select className="input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                {['EUR', 'CHF', 'CAD', 'USD', 'GBP'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button className="btn btn-primary" onClick={() => setPriceSettings(form)}>
            Enregistrer
          </button>
          <button className="btn btn-ghost" onClick={runTest} disabled={!form.baseUrl}>
            {test.state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Tester la connexion
          </button>
          <button className="btn btn-ghost" onClick={syncCatalog} disabled={!form.baseUrl}>
            Synchroniser le catalogue
          </button>
        </div>
        {test.state === 'ok' && (
          <p className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> {test.message}
          </p>
        )}
        {test.state === 'error' && (
          <p className="mt-3 flex items-center gap-2 text-sm text-red-400">
            <XCircle className="h-4 w-4" /> {test.message}
          </p>
        )}
      </section>

      <section className="card mt-6 p-6">
        <h2 className="text-lg font-semibold">Catalogue personnalisé</h2>
        <p className="muted mt-1 text-sm">
          Ajoutez ou mettez à jour des produits (même format que l’export du catalogue). Les produits importés remplacent ceux de même identifiant.
          {custom > 0 && ` ${custom} produit(s) personnalisé(s) actif(s).`}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Importer un JSON
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
          {custom > 0 && (
            <button className="btn btn-ghost" onClick={clearCustomCatalog}>
              <Trash2 className="h-4 w-4" /> Supprimer les imports
            </button>
          )}
        </div>
        {syncMsg && <p className="muted mt-3 text-sm">{syncMsg}</p>}
      </section>
    </div>
  )
}
