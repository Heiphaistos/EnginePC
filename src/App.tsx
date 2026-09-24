import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Builder } from './pages/Builder'
import { Catalog } from './pages/Catalog'
import { Generator } from './pages/Generator'
import { Home } from './pages/Home'
import { Saved } from './pages/Saved'
import { Settings } from './pages/Settings'
import { Share } from './pages/Share'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="generer" element={<Generator />} />
          <Route path="configurer/:type" element={<Builder />} />
          <Route path="catalogue" element={<Catalog />} />
          <Route path="mes-configs" element={<Saved />} />
          <Route path="parametres" element={<Settings />} />
          <Route path="partage/:code" element={<Share />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
