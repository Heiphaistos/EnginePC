import { ArrowRight, BadgeCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ExplodedScene } from './explodedScene'

const STEPS = [
  { kicker: 'Vue éclatée', title: 'Une tour, des dizaines de contraintes', text: 'Faites défiler : la configuration se démonte pièce par pièce, comme le moteur la vérifie.' },
  { kicker: 'Carte mère', title: 'Le socle de tout le reste', text: 'Socket, chipset, format ATX, mATX ou ITX : elle décide du processeur, de la mémoire et du boîtier possibles.' },
  { kicker: 'Processeur et mémoire', title: 'Même socket, bonne génération', text: 'DDR4 ou DDR5, barrettes RDIMM/ECC pour les serveurs, nombre d’emplacements : tout est contrôlé.' },
  { kicker: 'Carte graphique', title: 'Elle doit tenir dans le boîtier', text: 'Longueur maximale, emplacements occupés et consommation : la carte graphique pèse sur tout le reste.' },
  { kicker: 'Alimentation', title: 'Assez de watts, avec de la marge', text: 'La consommation de chaque pièce est additionnée pour dimensionner l’alimentation.' },
  { kicker: 'Refroidissement', title: 'Ventirad et ventilateurs', text: 'Hauteur du ventirad, compatibilité du socket, flux d’air : la chaleur a aussi son mot à dire.' },
  { kicker: 'Remontage', title: 'Tout s’emboîte.', text: 'Chaque pièce a été vérifiée avec les autres : la configuration est compatible.' },
]

/** Section « vue éclatée » : une tour 3D qui se démonte puis se remonte au fil du défilement. */
export function ExplodedView() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let scene: ExplodedScene | null = null
    let visible = false
    let disposed = false
    let loading = false

    /** Position dans le récit : l'étape dont le centre a passé le milieu de l'écran, plus la fraction vers la suivante. */
    const progress = () => {
      const mid = innerHeight / 2
      const centers = stepRefs.current.map((el) => {
        const r = el!.getBoundingClientRect()
        return r.top + r.height / 2
      })
      if (mid <= centers[0]) return 0
      for (let i = 0; i < centers.length - 1; i++) {
        if (mid < centers[i + 1]) return i + (mid - centers[i]) / (centers[i + 1] - centers[i])
      }
      return centers.length - 1
    }

    const onScroll = () => {
      if (!visible) return
      const t = progress()
      scene?.setProgress(t)
      setActive(Math.round(t))
    }

    let create: ((c: HTMLCanvasElement, o: { reduced: boolean; lowPower: boolean }) => ExplodedScene) | null = null
    const build = () => {
      if (!create || disposed) return
      scene?.dispose()
      const lowPower = innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4
      scene = create(canvas, { reduced, lowPower })
      scene.setActive(visible && !document.hidden)
      scene.setProgress(progress())
    }
    // Thème ou couleur d'accent changés : la scène relit ses couleurs.
    const themeWatch = new MutationObserver(build)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-accent'] })

    const load = () => {
      if (loading) return
      loading = true
      // Le moteur 3D n'arrive qu'à l'approche de la section : rien sur le chemin critique de l'accueil.
      import('./explodedScene')
        .then(({ createExplodedScene }) => {
          create = createExplodedScene
          build()
          setReady(true)
        })
        .catch(() => {
          /* WebGL indisponible : les étapes restent lisibles sans la 3D. */
        })
    }

    // Attend la fin du chargement de la page (et un moment creux) pour ne pas concurrencer le premier affichage.
    const near = new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) {
        near.disconnect()
        const go = () => ('requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 1500 }) : setTimeout(load, 200))
        if (document.readyState === 'complete') go()
        else addEventListener('load', go, { once: true })
      }
    }, { rootMargin: '400px 0px' })
    near.observe(section)

    const seen = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting
      scene?.setActive(visible && !document.hidden)
      if (visible) onScroll()
    }, { rootMargin: '-20% 0px' })
    seen.observe(section)

    const onVisibility = () => scene?.setActive(visible && !document.hidden)
    const onResize = () => scene?.resize()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      disposed = true
      themeWatch.disconnect()
      near.disconnect()
      seen.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      scene?.dispose()
    }
  }, [])

  return (
    <section ref={sectionRef} className="exploded relative mx-auto max-w-7xl px-4 pb-20" aria-label="Vue éclatée d’un PC">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="exploded-stage sticky top-16 z-0 h-[46vh] lg:order-2 lg:h-[calc(100vh-4rem)]">
          <div className="exploded-glow pointer-events-none absolute inset-[12%] rounded-full blur-3xl" />
          <canvas ref={canvasRef} className={`exploded-canvas relative h-full w-full ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
        </div>
        <div className="relative z-10 min-w-0 lg:order-1">
          {STEPS.map((s, i) => (
            <div
              key={s.kicker}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className="flex min-h-[75vh] items-end pb-8 lg:min-h-[78vh] lg:items-center lg:pb-0"
            >
              <div className={`exploded-step glass w-full p-6 ${active === i ? 'is-active' : ''}`}>
                <div className="label text-brand-400">
                  {i > 0 && i < STEPS.length - 1 && <span className="tabular-nums">0{i} · </span>}
                  {s.kicker}
                </div>
                <h2 className="mt-1 text-2xl font-bold md:text-3xl">{s.title}</h2>
                <p className="muted mt-2">{s.text}</p>
                {i === STEPS.length - 1 && (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="chip border-emerald-500/40 text-emerald-400">
                      <BadgeCheck className="h-3.5 w-3.5" /> Compatible
                    </span>
                    <Link to="/configurer/desktop" className="btn btn-primary btn-sm">
                      Configurer pièce par pièce <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
