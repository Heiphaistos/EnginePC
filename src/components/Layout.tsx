import { Code2, Cpu, Menu, Moon, Sun, X } from 'lucide-react'
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
  { to: '/mes-configs', label: 'Mes configs' },
  { to: '/parametres', label: 'Paramètres' },
]

export function Layout() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const saved = useStore((s) => s.saved.length)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  useEffect(() => setOpen(false), [location.pathname])
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
            <span className="text-lg tracking-tight">
              Engine<span className="gradient-text">PC</span>
            </span>
          </NavLink>
          <nav className="hidden flex-1 items-center gap-1 md:flex">
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
                {n.to === '/mes-configs' && saved > 0 && (
                  <span className="ml-1.5 rounded-full bg-brand-500/20 px-1.5 text-xs text-brand-400">{saved}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="card-soft flex p-0.5 text-xs font-semibold" role="group" aria-label="Affichage des prix">
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
            <button className="btn btn-ghost btn-sm" onClick={toggleTheme} aria-label="Changer de thème">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="btn btn-ghost btn-sm md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-[var(--border)] px-4 py-3 md:hidden">
            {NAV.map((n) => (
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
      <footer className="no-print border-t border-[var(--border)] py-8 text-sm">
        <div className="muted mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 md:flex-row">
          <p>© {new Date().getFullYear()} EnginePC — Prix indicatifs, estimations de performance données à titre indicatif.</p>
          <a className="flex items-center gap-1.5 hover:text-[var(--text)]" href="https://github.com/Heiphaistos/EnginePC" target="_blank" rel="noreferrer">
            <Code2 className="h-4 w-4" /> Code source
          </a>
        </div>
      </footer>
    </div>
  )
}
