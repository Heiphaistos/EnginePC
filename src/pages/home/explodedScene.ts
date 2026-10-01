// Scène Three.js de la « vue éclatée » : une tour PC en primitives simples (aucun modèle à télécharger).
// Chargée à la demande (import dynamique) quand la section approche de l'écran.
import {
  AmbientLight,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Object3D,
} from 'three'

/** Étapes du récit : 0 = tour montée, 1..5 = une famille de pièces à la fois, 6 = remontée. */
export const STEP_COUNT = 7

type PartKey = 'board' | 'cpu' | 'gpu' | 'psu' | 'cooling'

interface Part {
  group: Group
  home: Vector3
  /** Direction de l'éclatement (pièce sortie du boîtier). */
  out: Vector3
  /** Étape du récit où la pièce passe au premier plan. */
  step: number
  mats: MeshStandardMaterial[]
  /** Arêtes propres à la pièce : elles s'allument quand la pièce est sous le projecteur. */
  edges: LineBasicMaterial
}

const PART_STEP: Record<PartKey, number> = { board: 1, cpu: 2, gpu: 3, psu: 4, cooling: 5 }

function cssColor(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return new Color(v || fallback)
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export interface ExplodedScene {
  /** Position dans le récit (0 → STEP_COUNT - 1), interpolée en douceur. */
  setProgress(t: number): void
  setActive(on: boolean): void
  resize(): void
  dispose(): void
}

export function createExplodedScene(canvas: HTMLCanvasElement, opts: { reduced: boolean; lowPower: boolean }): ExplodedScene {
  const renderer = new WebGLRenderer({ canvas, antialias: !opts.lowPower, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 50)

  const brand = cssColor('--color-brand-500', '#06b6d4')
  const accent = cssColor('--color-accent-500', '#8b5cf6')
  const dark = document.documentElement.classList.contains('dark')
  const body = new Color(dark ? '#2b3856' : '#cfd6e4')
  const pcb = new Color(dark ? '#0f2a2e' : '#1f4f55')

  scene.add(new AmbientLight(0xffffff, dark ? 0.55 : 0.9))
  const key = new DirectionalLight(0xffffff, 2.2)
  key.position.set(4, 5, 6)
  scene.add(key)
  const rim = new DirectionalLight(accent, 1.6)
  rim.position.set(-5, 2, -4)
  scene.add(rim)

  const geos: BufferGeometry[] = []
  const mats: Material[] = []
  const track = <T extends BufferGeometry>(g: T) => (geos.push(g), g)
  const mat = (color: Color, extra: Partial<{ emissive: Color; emissiveIntensity: number; metalness: number; roughness: number }> = {}) => {
    const m = new MeshStandardMaterial({ color, metalness: 0.45, roughness: 0.45, transparent: true, ...extra })
    mats.push(m)
    return m
  }
  const edgeMat = new LineBasicMaterial({ color: brand, transparent: true, opacity: 0.55 })
  mats.push(edgeMat)

  /** Boîte pleine + arêtes lumineuses : le style « plan technique » de toute la scène. */
  const box = (w: number, h: number, d: number, m: MeshStandardMaterial, edges = true) => {
    const g = track(new BoxGeometry(w, h, d))
    const mesh = new Mesh(g, m)
    if (edges) mesh.add(new LineSegments(track(new EdgesGeometry(g)), edgeMat))
    return mesh
  }
  /** Ventilateur : anneau + moyeu + pales. */
  const fan = (r: number, m: MeshStandardMaterial, axis: 'x' | 'y' | 'z') => {
    const f = new Group()
    f.add(new Mesh(track(new TorusGeometry(r, r * 0.08, 8, 28)), m))
    const hub = new Mesh(track(new CylinderGeometry(r * 0.28, r * 0.28, r * 0.12, 16)), m)
    hub.rotation.x = Math.PI / 2
    f.add(hub)
    const blades = new Group()
    for (let i = 0; i < 7; i++) {
      const b = new Mesh(track(new BoxGeometry(r * 0.62, r * 0.2, r * 0.03)), m)
      b.position.set(Math.cos((i / 7) * Math.PI * 2) * r * 0.55, Math.sin((i / 7) * Math.PI * 2) * r * 0.55, 0)
      b.rotation.z = (i / 7) * Math.PI * 2
      b.rotation.y = 0.5
      blades.add(b)
    }
    f.add(blades)
    f.userData.blades = blades
    if (axis === 'x') f.rotation.y = Math.PI / 2
    if (axis === 'y') f.rotation.x = Math.PI / 2
    return f
  }

  const tower = new Group()
  scene.add(tower)

  // Boîtier : arêtes seules + panneau arrière plein, pour voir l'intérieur.
  const shell = new Group()
  const shellGeo = track(new BoxGeometry(1.1, 2.3, 2.1))
  const shellEdges = new LineSegments(track(new EdgesGeometry(shellGeo)), new LineBasicMaterial({ color: brand, transparent: true, opacity: 0.9 }))
  mats.push(shellEdges.material as Material)
  shell.add(shellEdges)
  const backPanelMat = mat(body, { metalness: 0.2, roughness: 0.8 })
  backPanelMat.opacity = 0.55
  const backPanel = box(0.02, 2.3, 2.1, backPanelMat, false)
  backPanel.position.x = -0.55
  shell.add(backPanel)
  tower.add(shell)

  const parts: Record<PartKey, Part> = {} as Record<PartKey, Part>
  const addPart = (k: PartKey, group: Group, home: Vector3, out: Vector3) => {
    group.position.copy(home)
    const pm: MeshStandardMaterial[] = []
    const edges = edgeMat.clone()
    mats.push(edges)
    group.traverse((o: Object3D) => {
      const m = (o as Mesh).material
      if (m instanceof MeshStandardMaterial && !pm.includes(m)) {
        m.userData.baseEmissive = m.emissive.clone()
        m.userData.baseIntensity = m.emissiveIntensity
        pm.push(m)
      }
      if (m === edgeMat) (o as LineSegments).material = edges
    })
    tower.add(group)
    parts[k] = { group, home, out, step: PART_STEP[k], mats: pm, edges }
  }

  // Carte mère (contre le panneau arrière) + SSD M.2.
  const board = new Group()
  board.add(box(0.05, 1.55, 1.35, mat(pcb, { metalness: 0.3, roughness: 0.6 })))
  const m2 = box(0.03, 0.06, 0.45, mat(new Color('#0b0f19')))
  m2.position.set(0.04, -0.15, 0.05)
  board.add(m2)
  addPart('board', board, new Vector3(-0.48, 0.25, -0.1), new Vector3(-0.25, 0, 0))

  // Processeur + barrettes de mémoire.
  const cpu = new Group()
  const chip = box(0.06, 0.32, 0.32, mat(new Color('#c9ced8'), { metalness: 0.9, roughness: 0.25 }))
  cpu.add(chip)
  const ramMat = mat(accent, { emissive: accent, emissiveIntensity: 0.15 })
  for (let i = 0; i < 4; i++) {
    const stick = box(0.12, 0.55, 0.03, ramMat)
    stick.position.set(0.04, 0, 0.32 + i * 0.07)
    cpu.add(stick)
  }
  addPart('cpu', cpu, new Vector3(-0.42, 0.55, -0.25), new Vector3(0.55, 0.55, 0.15))

  // Carte graphique : longue, trois ventilateurs.
  const gpu = new Group()
  gpu.add(box(0.42, 0.16, 1.15, mat(body, { metalness: 0.6, roughness: 0.35 })))
  const gpuFanMat = mat(brand, { emissive: brand, emissiveIntensity: 0.25 })
  for (let i = 0; i < 3; i++) {
    const f = fan(0.15, gpuFanMat, 'y')
    f.position.set(0, -0.09, -0.36 + i * 0.36)
    gpu.add(f)
  }
  addPart('gpu', gpu, new Vector3(-0.22, -0.18, 0.05), new Vector3(0.6, -0.15, -0.45))

  // Alimentation, en bas.
  const psu = new Group()
  psu.add(box(0.9, 0.42, 0.75, mat(new Color('#0b0f19'), { metalness: 0.5, roughness: 0.5 })))
  const psuFan = fan(0.17, mat(brand, { emissive: brand, emissiveIntensity: 0.2 }), 'y')
  psuFan.position.y = 0.22
  psu.add(psuFan)
  addPart('psu', psu, new Vector3(0, -0.88, -0.6), new Vector3(0.25, -0.5, -0.45))

  // Refroidissement : ventirad tour + ventilateurs façade et arrière.
  const cooling = new Group()
  const coolerMat = mat(new Color('#aab3c5'), { metalness: 0.85, roughness: 0.3 })
  const cooler = new Group()
  for (let i = 0; i < 9; i++) {
    const fin = box(0.4, 0.42, 0.012, coolerMat, false)
    fin.position.z = -0.12 + i * 0.03
    cooler.add(fin)
  }
  const coolerFan = fan(0.2, mat(accent, { emissive: accent, emissiveIntensity: 0.35 }), 'z')
  coolerFan.position.z = 0.17
  cooler.add(coolerFan)
  cooler.position.set(-0.22, 0.55, -0.25)
  cooling.add(cooler)
  const caseFanMat = mat(accent, { emissive: accent, emissiveIntensity: 0.22 })
  const caseFans: Group[] = []
  for (let i = 0; i < 3; i++) {
    const f = fan(0.24, caseFanMat, 'z')
    f.position.set(0, 0.62 - i * 0.6, 1.0)
    cooling.add(f)
    caseFans.push(f)
  }
  const rear = fan(0.24, caseFanMat, 'z')
  rear.position.set(0, 0.7, -1.0)
  cooling.add(rear)
  caseFans.push(rear, coolerFan, ...gpu.children.filter((c) => c.userData.blades) as Group[], psuFan)
  addPart('cooling', cooling, new Vector3(0, 0, 0), new Vector3(0.1, 0.25, 0.55))

  let target = 0
  let shown = 0
  let active = false
  let raf = 0
  let last = performance.now()
  let spin = 0
  let dirty = true
  let idleTick = 0

  function layout(t: number, now: number) {
    // Éclaté entre les étapes 0→1, remonté entre 5→6.
    const explode = smooth(0, 1, t) * (1 - smooth(5, 6, t))
    for (const p of Object.values(parts)) {
      const focus = Math.max(0, 1 - Math.abs(t - p.step))
      const f = smooth(0, 1, focus)
      // La pièce sous le projecteur sort un peu plus et s'avance vers la caméra (+x = face vitrée).
      const lift = f * explode
      p.group.position.set(p.home.x + p.out.x * explode + 0.45 * lift, p.home.y + p.out.y * explode, p.home.z + p.out.z * explode)
      p.group.scale.setScalar(1 + 0.1 * lift)
      // Les autres deviennent des fantômes pendant l'éclaté ; la pièce suivie s'illumine.
      const dim = explode * (1 - f) * 0.72
      for (const m of p.mats) {
        m.opacity = 1 - dim
        m.emissive.copy(m.userData.baseEmissive as Color).lerp(brand, 0.7 * lift)
        m.emissiveIntensity = (m.userData.baseIntensity as number) + 0.32 * lift
      }
      p.edges.opacity = 0.55 * (1 - explode) + explode * (0.12 + 0.88 * f)
    }
    ;(shellEdges.material as LineBasicMaterial).opacity = 0.9 - explode * 0.55
    backPanelMat.opacity = 0.55 - explode * 0.35

    const sway = opts.reduced ? 0 : Math.sin(now / 4200) * 0.12
    tower.rotation.y = -0.85 + sway
    tower.rotation.x = 0.12
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const prev = shown
    shown += (target - shown) * (1 - Math.exp(-dt * 6))
    if (Math.abs(target - shown) < 0.0005) shown = target
    if (!opts.reduced) {
      spin += dt * 4
      for (const f of caseFans) (f.userData.blades as Group).rotation.z = spin
    }
    // Au repos (pas de défilement), seuls les ventilateurs bougent : une image sur deux suffit (≈ 30 i/s).
    idleTick = shown === prev ? idleTick + 1 : 0
    if (dirty || shown !== prev || idleTick % 2 === 0) {
      layout(shown, now)
      renderer.render(scene, camera)
      dirty = false
    }
    raf = active && !opts.reduced ? requestAnimationFrame(frame) : 0
  }

  function kick() {
    if (opts.reduced) {
      shown = target
      layout(shown, 0)
      renderer.render(scene, camera)
      return
    }
    if (!raf && active) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }

  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Recule la caméra sur un cadre étroit (mobile) pour garder la tour éclatée entière.
    const dist = w / h < 0.9 ? 8.6 : 7.3
    camera.position.set(0, 0.55, dist)
    camera.lookAt(0, -0.05, 0)
    camera.updateProjectionMatrix()
    dirty = true
    if (opts.reduced || !raf) {
      layout(shown, performance.now())
      renderer.render(scene, camera)
    }
  }

  resize()

  return {
    setProgress(t) {
      target = Math.min(STEP_COUNT - 1, Math.max(0, t))
      kick()
    },
    setActive(on) {
      active = on
      if (on) kick()
      else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    },
    resize,
    dispose() {
      cancelAnimationFrame(raf)
      geos.forEach((g) => g.dispose())
      mats.forEach((m) => m.dispose())
      renderer.dispose()
    },
  }
}
