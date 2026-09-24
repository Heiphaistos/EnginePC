import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="gradient-text text-6xl font-extrabold">404</div>
      <h1 className="mt-4 text-2xl font-bold">Page introuvable</h1>
      <p className="muted mt-2">Cette page n’existe pas ou a été déplacée.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/" className="btn btn-primary">
          Accueil
        </Link>
        <Link to="/generer" className="btn btn-ghost">
          Générateur
        </Link>
      </div>
    </div>
  )
}
