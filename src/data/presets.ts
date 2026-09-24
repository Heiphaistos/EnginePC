import type { DeviceType, UsageProfile } from '../types'

export interface Preset {
  title: string
  description: string
  type: DeviceType
  profile: UsageProfile
  budget: number
}

/** Raccourcis de la page d'accueil vers le générateur. */
export const POPULAR_PRESETS: Preset[] = [
  { title: 'PC gamer 1080p', description: 'Plus de 100 fps en Full HD dans les jeux récents.', type: 'desktop', profile: 'gaming', budget: 900 },
  { title: 'PC gamer 1440p', description: 'Le meilleur rapport performances/prix en QHD haute fréquence.', type: 'desktop', profile: 'gaming', budget: 1600 },
  { title: 'PC gamer 4K ultime', description: 'RTX haut de gamme, X3D et refroidissement premium.', type: 'desktop', profile: 'gaming', budget: 4000 },
  { title: 'Station IA locale', description: 'Maximum de VRAM pour faire tourner des LLM 30-70B.', type: 'desktop', profile: 'ai', budget: 4500 },
  { title: 'Station de création', description: 'Montage 4K, 3D et rendu : cœurs et mémoire à volonté.', type: 'desktop', profile: 'workstation', budget: 3500 },
  { title: 'Serveur Proxmox', description: 'Virtualisation avec RAM ECC et réseau 10 GbE.', type: 'server', profile: 'virtualization', budget: 5000 },
  { title: 'NAS familial', description: 'Sauvegardes, photos et Plex/Jellyfin, faible consommation.', type: 'nas', profile: 'storage', budget: 1200 },
  { title: 'Portable étudiant', description: 'Léger, autonome et polyvalent pour les cours.', type: 'laptop', profile: 'office', budget: 800 },
]
