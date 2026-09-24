import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { decodeShare } from '../lib/export'
import { newBuild, useStore } from '../store/useStore'

/** Ouvre une configuration partagée par lien (/partage/<code>). */
export function Share() {
  const { code } = useParams()
  const navigate = useNavigate()
  const setDraft = useStore((s) => s.setDraft)
  const payload = code ? decodeShare(code) : null

  useEffect(() => {
    if (!payload) return
    setDraft({ ...newBuild(payload.deviceType, payload.profile), ...payload })
    navigate(`/configurer/${payload.deviceType}`, { replace: true })
  }, [payload, setDraft, navigate])

  if (payload) return null
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Lien de partage invalide</h1>
      <p className="muted mt-2">Le lien est incomplet ou corrompu.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Retour à l’accueil
      </Link>
    </div>
  )
}
