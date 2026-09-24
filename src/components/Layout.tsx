import { Code2, Cpu, Menu, Moon, Settings2, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '../lib/format'
import { fetchExtraCatalog, fetchRates } from '../services/openData'
import { useStore } from '../store/useStore'

/** Charge la base étendue et les taux de change une fois par session. */
function useOpenData() {
  useEffect(() => {
    const ctrl = new AbortController()
    const { setExtra, setRates } = useStore.getState()
    setExtra([], { status: 'loading' })
    fetchExtraCatalog(ctrl.signal)
      .then((d) => setExtra(d.components, { status: 'ready', generatedAt: d.generatedAt, source: d.source }))
      .catch(() => !ctrl.signal.aborted && setExtra([], { status: 'error' }))
    fetchRates(ctrl.signal)
      .then(setRates)
      .catch(() => undefined)
    return () => ctrl.abort()
  }, [])
}

const NAV = [
  { to: '/generer', label: 'Générateur auto' },
  { to: '/configurer/desktop', label: 'Configurateur' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/comparer', label: 'Comparer' },
  { to: '/guides', label: 'Guides' },
  { to: '/mes-configs', label: 'Mes configs' },
]

const FOOTER: { title: string; links: [string, string][] }[] = [
  { title: 'Configurer', links: [['/generer', 'Générateur automatique'], ['/configurer/desktop', 'PC fixe'], ['/configurer/laptop', 'PC portable'], ['/configurer/server', 'Serveur'], ['/configurer/nas', 'NAS'], ['/configurer/phone', 'Smartphone']] },
  { title: 'Explorer', links: [['/catalogue', 'Catalogue'], ['/comparer', 'Comparer des composants'], ['/mes-configs', 'Mes configurations'], ['/parametres', 'Paramètres']] },
  { title: 'Ressources', links: [['/guides', 'Guides d’achat'], ['/glossaire', 'Glossaire'], ['/faq', 'Questions fréquentes']] },
]

export function Layout() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const saved = useStore((s) => s.saved.length)
  const compareCount = useStore((s) => s.compareParts.length)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    const p = location.pathname
    const page =
      p === '/' ? 'Configurateur intelligent'
      : p.startsWith('/generer') ? 'Générateur automatique'
      : p.startsWith('/configurer') ? 'Configurateur'
      : p.startsWith('/catalogue') ? 'Catalogue'
      : p.startsWith('/comparer') ? 'Comparer des composants'
      : p.startsWith('/mes-configs') ? 'Mes configurations'
      : p.startsWith('/parametres') ? 'Paramètres'
      : p.startsWith('/devis') ? 'Devis'
      : p.startsWith('/guides') ? 'Guides d’achat'
      : p.startsWith('/glossaire') ? 'Glossaire'
      : p.startsWith('/faq') ? 'Questions fréquentes'
      : 'Page introuvable'
    document.title = `EnginePC — ${page}`
  }, [location.pathname])
  useOpenData()
  const currency = useStore((s) => s.priceSettings.currency)
  const ratesDate = useStore((s) => s.rates.date)
  const mode = useStore((s) => s.priceSettings.priceMode ?? 'ttc')
  const vatKey = useStore((s) => `${s.priceSettings.country}-${s.priceSettings.vatRate ?? ''}-${s.priceSettings.vatExempt ?? ''}`)
  const setPriceSettings = useStore((s) => s.setPriceSettings)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
          <NavLink to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/20">
              <Cpu className="h-5 w-5" />
            </span>
            <span className="font-display text-lg tracking-tight">
              Engine<span className="gradient-text">PC</span>
            </span>
          </NavLink>
          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive || (n.to.startsWith('/configurer') && location.pathname.startsWith('/configurer'))
                      ? 'bg-[var(--bg-soft)] text-[var(--text)]'
                      : 'muted hover:text-[var(--text)]',
                  )
                }
              >
                {n.label}
                {n.to === '/comparer' && compareCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-brand-500/20 px-1.5 text-xs text-brand-400">{compareCount}</span>
                )}
                {n.to === '/mes-configs' && saved > 0 && (
                  <span className="ml-1.5 rounded-full bg-brand-500/20 px-1.5 text-xs text-brand-400">{saved}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="card-soft hidden p-0.5 text-xs font-semibold sm:flex" role="group" aria-label="Affichage des prix">
              {(['ttc', 'ht', 'both'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPriceSettings({ priceMode: m })}
                  className={cn('rounded-md px-2 py-1 transition', mode === m ? 'bg-brand-500 text-white' : 'muted hover:text-[var(--text)]')}
                  title={m === 'both' ? 'Afficher HT et TTC' : `Prix ${m.toUpperCase()}`}
                >
                  {m === 'both' ? 'HT+TTC' : m.toUpperCase()}
                </button>
              ))}
            </div>
            <NavLink to="/parametres" className="btn btn-ghost btn-sm hidden sm:inline-flex" aria-label="Paramètres" title="Paramètres">
              <Settings2 className="h-4 w-4" />
            </NavLink>
            <button className="btn btn-ghost btn-sm" onClick={toggleTheme} aria-label="Changer de thème">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="btn btn-ghost btn-sm lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-[var(--border)] px-4 py-3 lg:hidden">
            <div className="flex gap-1 pb-2 sm:hidden">
              {(['ttc', 'ht', 'both'] as const).map((m) => (
                <button key={m} onClick={() => setPriceSettings({ priceMode: m })} className={cn('btn btn-sm flex-1', mode === m ? 'btn-primary' : 'btn-ghost')}>
                  {m === 'both' ? 'HT+TTC' : m.toUpperCase()}
                </button>
              ))}
            </div>
            {[...NAV, { to: '/parametres', label: 'Paramètres' }].map((n) => (
              <NavLink key={n.to} to={n.to} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--bg-soft)]">
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">
        {/* Re-rendu des prix quand l'affichage change (sauf Paramètres, pour ne pas perdre la saisie en cours) */}
        <Outlet key={location.pathname === '/parametres' ? 'settings' : `${mode}-${vatKey}-${currency === 'EUR' ? 'EUR' : `${currency}-${ratesDate ?? ''}`}`} />
      </main>
      <footer className="no-print border-t border-[var(--border)] pt-12 pb-8 text-sm">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <NavLink to="/" className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <Cpu className="h-4 w-4" />
              </span>
              <span className="font-display text-lg">
                Engine<span className="gradient-text">PC</span>
              </span>
            </NavLink>
            <p className="muted mt-3 max-w-xs">Le configurateur intelligent de PC, serveurs, NAS, portables, tablettes et smartphones.</p>
            <p className="muted mt-3 text-xs">
              Données : catalogue EnginePC, <a className="underline" href="https://github.com/docyx/pc-part-dataset" target="_blank" rel="noreferrer">pc-part-dataset</a> (MIT), taux BCE, Wikipédia.
            </p>
          </div>
          {FOOTER.map((col) => (
            <div key={col.title}>
              <div className="label mb-3">{col.title}</div>
              <ul className="flex flex-col gap-2">
                {col.links.map(([to, label]) => (
                  <li key={to}>
                    <NavLink to={to} className="muted hover:text-[var(--text)]">
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="muted mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-[var(--border)] px-4 pt-6 text-xs md:flex-row">
          <p>© {new Date().getFullYear()} EnginePC — Prix indicatifs ; estimations de performance données à titre indicatif.</p>
          <a className="flex items-center gap-1.5 hover:text-[var(--text)]" href="https://github.com/Heiphaistos/EnginePC" target="_blank" rel="noreferrer">
            <Code2 className="h-4 w-4" /> Code source
          </a>
        </div>
      </footer>
    </div>
  )
}
