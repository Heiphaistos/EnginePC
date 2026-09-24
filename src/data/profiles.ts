import type { DeviceType, UsageProfile } from '../types'

export interface ProfileInfo {
  id: UsageProfile
  label: string
  short: string
  description: string
  icon: string // nom d'icône lucide
  devices: DeviceType[]
}

export const PROFILES: ProfileInfo[] = [
  { id: 'gaming', label: 'Gaming', short: 'Jeux', icon: 'Gamepad2', description: 'Framerate maximal en 1080p, 1440p et 4K, ray tracing.', devices: ['desktop', 'laptop', 'tablet', 'phone'] },
  { id: 'ai', label: 'IA & Machine Learning', short: 'IA', icon: 'BrainCircuit', description: 'LLM locaux, entraînement, inférence, Stable Diffusion : VRAM et puissance tensorielle.', devices: ['desktop', 'laptop', 'server', 'tablet', 'phone'] },
  { id: 'workstation', label: 'Station de travail', short: 'Création', icon: 'Clapperboard', description: '3D, montage vidéo, CAO, rendu : beaucoup de cœurs et de mémoire.', devices: ['desktop', 'laptop', 'server'] },
  { id: 'streaming', label: 'Streaming', short: 'Stream', icon: 'Radio', description: 'Jouer et diffuser en même temps : CPU multi-cœurs et encodeur GPU.', devices: ['desktop', 'laptop'] },
  { id: 'dev', label: 'Développement', short: 'Dev', icon: 'Code2', description: 'Compilation, conteneurs, IDE : mono-thread rapide et RAM confortable.', devices: ['desktop', 'laptop'] },
  { id: 'office', label: 'Bureautique', short: 'Bureau', icon: 'Briefcase', description: 'Navigation, bureautique, visio : silence, fiabilité et petit prix.', devices: ['desktop', 'laptop', 'tablet', 'phone'] },
  { id: 'media', label: 'Multimédia', short: 'Média', icon: 'Film', description: 'Films, photo, musique, Plex / Jellyfin : décodage et stockage.', devices: ['desktop', 'laptop', 'nas', 'tablet', 'phone'] },
  { id: 'homelab', label: 'Homelab', short: 'Homelab', icon: 'Server', description: 'Services auto-hébergés, domotique, conteneurs 24/7 à faible consommation.', devices: ['server', 'nas'] },
  { id: 'virtualization', label: 'Virtualisation', short: 'VM', icon: 'Layers', description: 'Proxmox, ESXi, Kubernetes : cœurs, RAM ECC, réseau rapide.', devices: ['server', 'nas'] },
  { id: 'storage', label: 'Stockage', short: 'Stockage', icon: 'HardDrive', description: 'Capacité brute, redondance, disques certifiés 24/7.', devices: ['nas', 'server'] },
  { id: 'mobile', label: 'Mobilité', short: 'Mobile', icon: 'Plane', description: 'Autonomie, poids et compacité avant tout.', devices: ['laptop', 'tablet', 'phone'] },
]

export const PROFILE_BY_ID = Object.fromEntries(PROFILES.map((p) => [p.id, p])) as Record<UsageProfile, ProfileInfo>

export interface DeviceTypeInfo {
  id: DeviceType
  label: string
  plural: string
  icon: string
  description: string
  /** Assemblé composant par composant (vs appareil complet). */
  assembled: boolean
  defaultProfile: UsageProfile
  defaultBudget: number
  budgetRange: [number, number]
}

export const DEVICE_TYPES: DeviceTypeInfo[] = [
  { id: 'desktop', label: 'PC fixe', plural: 'PC fixes', icon: 'Monitor', assembled: true, defaultProfile: 'gaming', defaultBudget: 1500, budgetRange: [400, 12000], description: 'Tour sur mesure, du PC bureautique au monstre RTX 5090.' },
  { id: 'laptop', label: 'PC portable', plural: 'PC portables', icon: 'Laptop', assembled: false, defaultProfile: 'gaming', defaultBudget: 1500, budgetRange: [300, 6000], description: 'Ultraportables, gaming, créateurs et stations mobiles.' },
  { id: 'server', label: 'Serveur', plural: 'Serveurs', icon: 'Server', assembled: true, defaultProfile: 'virtualization', defaultBudget: 5000, budgetRange: [800, 150000], description: 'Rack ou tour : EPYC, Xeon, Threadripper, GPU IA, RDIMM ECC.' },
  { id: 'nas', label: 'NAS', plural: 'NAS', icon: 'HardDrive', assembled: true, defaultProfile: 'storage', defaultBudget: 1500, budgetRange: [300, 20000], description: 'NAS DIY sur mesure ou clé en main (Synology, QNAP, UGREEN…).' },
  { id: 'tablet', label: 'Tablette', plural: 'Tablettes', icon: 'Tablet', assembled: false, defaultProfile: 'media', defaultBudget: 700, budgetRange: [100, 3000], description: 'iPad, Galaxy Tab, Surface, Android et Windows.' },
  { id: 'phone', label: 'Smartphone', plural: 'Smartphones', icon: 'Smartphone', assembled: false, defaultProfile: 'mobile', defaultBudget: 800, budgetRange: [100, 2500], description: 'iPhone, Galaxy, Pixel, Xiaomi, OnePlus et bien d’autres.' },
]

export const DEVICE_TYPE_BY_ID = Object.fromEntries(DEVICE_TYPES.map((d) => [d.id, d])) as Record<DeviceType, DeviceTypeInfo>

export function profilesFor(deviceType: DeviceType): ProfileInfo[] {
  return PROFILES.filter((p) => p.devices.includes(deviceType))
}
