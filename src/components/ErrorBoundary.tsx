import { Component, type ReactNode } from 'react'

interface State {
  error: Error | null
}

/** Évite l'écran blanc : affiche l'erreur et propose de repartir d'un état propre. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('EnginePC :', error)
  }

  private resetStorage = () => {
    try {
      localStorage.removeItem('enginepc')
    } catch {
      /* stockage indisponible */
    }
    window.location.href = '/'
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
        <p className="muted mt-2 text-sm">{this.state.error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Recharger la page
          </button>
          <button className="btn btn-ghost" onClick={this.resetStorage} title="Supprime les configurations et réglages enregistrés dans ce navigateur">
            Réinitialiser les données locales
          </button>
        </div>
      </div>
    )
  }
}
