import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'

// Pages chargées à la demande : le premier affichage ne télécharge que l'accueil.
const Generator = lazy(() => import('./pages/Generator').then((m) => ({ default: m.Generator })))
const Builder = lazy(() => import('./pages/Builder').then((m) => ({ default: m.Builder })))
const Catalog = lazy(() => import('./pages/Catalog').then((m) => ({ default: m.Catalog })))
const Compare = lazy(() => import('./pages/Compare').then((m) => ({ default: m.Compare })))
const Saved = lazy(() => import('./pages/Saved').then((m) => ({ default: m.Saved })))
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })))
const Share = lazy(() => import('./pages/Share').then((m) => ({ default: m.Share })))
const Quote = lazy(() => import('./pages/Quote').then((m) => ({ default: m.Quote })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function PageLoader() {
  return (
    <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-16">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <span className="muted text-sm">Chargement…</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="generer" element={<Generator />} />
              <Route path="configurer/:type" element={<Builder />} />
              <Route path="catalogue" element={<Catalog />} />
              <Route path="comparer" element={<Compare />} />
              <Route path="mes-configs" element={<Saved />} />
              <Route path="parametres" element={<Settings />} />
              <Route path="partage/:code" element={<Share />} />
              <Route path="devis/:code" element={<Quote />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
