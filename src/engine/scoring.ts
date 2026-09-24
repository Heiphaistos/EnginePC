import type { CPU, Device, UsageProfile } from '../types'
import { totalRamGB, totalStorageGB, totalVramGB, type ResolvedBuild } from './resolve'

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v))

/** Le score multi-thread brut est à l'échelle serveur (100 = EPYC haut de gamme) : on le compresse. */
export const mtIndex = (mt: number) => clamp(100 * Math.sqrt(Math.max(0, mt) / 100))

/** Somme des performances multi-GPU avec rendement décroissant. */
function multiGpu(values: number[]): number {
  const sorted = [...values].sort((a, b) => b - a)
  return sorted.reduce((sum, v, i) => sum + v * Math.pow(0.9, i), 0)
}

function ramFactor(gb: number, ideal: number): number {
  if (gb <= 0) return 0.4
  return clamp(0.6 + 0.4 * Math.min(1, gb / ideal), 0, 1)
}

/** Capacité du CPU à alimenter le GPU en jeu (cœurs, cache 3D V-Cache). */
export function cpuGamingIndex(cpu: CPU | undefined): number {
  if (!cpu) return 0
  const coreF = cpu.cores >= 8 ? 1 : cpu.cores >= 6 ? 0.92 : cpu.cores >= 4 ? 0.75 : 0.55
  const cache = /x3d/i.test(cpu.model) ? 1.12 : 1
  return cpu.singleThreadScore * coreF * cache
}

const FPS_MULT = { '1080p': 2.6, '1440p': 1.85, '4K': 1.1 } as const
const CPU_FPS_MULT = 2.0
/** FPS de référence (RTX 5090 + Ryzen 7 9800X3D) pour normaliser le score gaming. */
const REF_FPS = { '1080p': 204, '1440p': 185, '4K': 110 } as const

function fpsAt(b: ResolvedBuild, res: keyof typeof FPS_MULT): number {
  const gpu = b.gpus.length ? Math.max(...b.gpus.map((g) => g.gamingScore)) : b.cpu?.integratedGraphics ? 5 : 0
  return Math.min(gpu * FPS_MULT[res], cpuGamingIndex(b.cpu) * CPU_FPS_MULT)
}

/** Score gaming 0-100 pondéré 1080p / 1440p / 4K, goulet d'étranglement CPU inclus. */
export function gamingIndex(b: ResolvedBuild): number {
  const r = (res: keyof typeof FPS_MULT) => Math.min(1, fpsAt(b, res) / REF_FPS[res])
  return clamp(100 * (0.3 * r('1080p') + 0.45 * r('1440p') + 0.25 * r('4K')))
}

/** Score 0-100 d'une configuration assemblée pour un usage donné. */
export function scoreResolved(b: ResolvedBuild, profile: UsageProfile): number {
  const st = b.cpu?.singleThreadScore ?? 0
  const mt = mtIndex(b.cpu?.multiThreadScore ?? 0)
  const gaming = b.gpus.length ? Math.max(...b.gpus.map((g) => g.gamingScore)) : b.cpu?.integratedGraphics ? 6 : 0
  const ai = multiGpu(b.gpus.map((g) => g.aiScore))
  const vram = totalVramGB(b)
  const ram = totalRamGB(b)
  const storageTB = totalStorageGB(b) / 1000
  const fastStorage = b.storage.some((d) => d.interface.includes('4.0') || d.interface.includes('5.0') || d.interface === 'U.2')
  const cores = b.cpu?.cores ?? 0

  switch (profile) {
    case 'gaming': {
      const s = gamingIndex(b)
      return clamp(s * ramFactor(ram, 32) * (fastStorage ? 1 : 0.97))
    }
    case 'ai': {
      const vramScore = clamp((Math.log2(Math.max(1, vram)) / Math.log2(640)) * 100)
      const s = 0.58 * clamp(ai) + 0.3 * vramScore + 0.05 * mt + 0.07 * clamp((ram / 256) * 100)
      return clamp(s * ramFactor(ram, Math.max(64, vram * 2)))
    }
    case 'workstation': {
      const s = 0.55 * mt + 0.15 * st + 0.2 * Math.max(gaming, clamp(ai)) + 0.1 * clamp((ram / 256) * 100)
      return clamp(s * ramFactor(ram, 64) * (fastStorage ? 1 : 0.95))
    }
    case 'streaming': {
      const s = 0.5 * gamingIndex(b) + 0.35 * mt + 0.15 * st
      return clamp(s * ramFactor(ram, 32))
    }
    case 'dev': {
      const s = 0.4 * st + 0.4 * mt + 0.2 * clamp((ram / 64) * 100)
      return clamp(s * (fastStorage ? 1 : 0.92))
    }
    case 'office': {
      const hot = b.cpu ? Math.max(0, b.cpu.tdp - 65) * 0.1 : 0
      const s = 55 + 0.3 * st + 0.15 * clamp((ram / 16) * 100) * (ram >= 8 ? 1 : 0.5) - hot
      return clamp(s * (b.storage.some((d) => d.kind !== 'hdd') ? 1 : 0.7))
    }
    case 'media': {
      const s = 0.3 * st + 0.2 * mt + 0.2 * Math.max(gaming, b.cpu?.integratedGraphics ? 40 : 0) + 0.3 * clamp((storageTB / 20) * 100)
      return clamp(s)
    }
    case 'homelab': {
      const eff = b.cpu ? clamp(100 - Math.max(0, b.cpu.tdp - 65) * 0.5) : 0
      const s = 0.3 * mt + 0.25 * clamp((ram / 128) * 100) + 0.2 * eff + 0.15 * clamp((storageTB / 40) * 100) + (b.ram?.ecc ? 10 : 0)
      return clamp(s)
    }
    case 'virtualization': {
      const net = b.nic ? clamp(b.nic.speedGbps * 2 + 40) : b.motherboard?.lan.includes('10G') ? 60 : 30
      const s = 0.4 * mt + 0.3 * clamp((ram / 512) * 100) + 0.1 * clamp(cores * 1.5) + 0.1 * net + (b.ram?.ecc ? 10 : 0)
      return clamp(s)
    }
    case 'storage': {
      const hdds = b.storage.filter((d) => d.kind === 'hdd')
      const redundancy = hdds.length >= 4 ? 1 : hdds.length >= 2 ? 0.85 : 0.6
      const s = clamp((Math.log10(Math.max(1, storageTB)) / Math.log10(500)) * 100) * 0.7 * redundancy + (b.ram?.ecc ? 15 : 0) + 0.15 * clamp(mt * 2)
      return clamp(s)
    }
    case 'mobile':
      return 0
  }
}

export function scoreDevice(d: Device, profile: UsageProfile): number {
  const direct = d.scores[profile]
  if (direct !== undefined) return direct
  const vals = Object.values(d.scores).filter((v): v is number => typeof v === 'number')
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) * 0.8 : 0
}

// ---------------------------------------------------------------------------
// Estimations de performance (aperçu en temps réel)
// ---------------------------------------------------------------------------

export interface GamingEstimate {
  resolution: '1080p' | '1440p' | '4K'
  fps: number
}

/**
 * Estimation FPS moyens (jeux AAA récents, réglages élevés, sans upscaling).
 * Calibré approximativement : RTX 5090 ≈ 110 fps en 4K.
 */
export function estimateGamingFps(b: ResolvedBuild): GamingEstimate[] {
  if (!b.gpus.length && !b.cpu?.integratedGraphics) return []
  return (['1080p', '1440p', '4K'] as const).map((resolution) => ({ resolution, fps: Math.round(fpsAt(b, resolution)) }))
}

export interface AiEstimate {
  vramGB: number
  /** Taille max (milliards de paramètres) d'un LLM chargé entièrement en VRAM en 4 bits. */
  maxParamsQ4: number
  /** Taille max en FP16. */
  maxParamsFp16: number
  /** Débit indicatif de génération (tokens/s) sur un modèle 8B Q4. */
  tokensPerSec8B: number
  fp16Tflops: number
  label: string
}

export function estimateAi(b: ResolvedBuild): AiEstimate | null {
  const vram = totalVramGB(b)
  if (!vram) return null
  const usable = vram * 0.85
  const maxParamsQ4 = Math.floor(usable / 0.6)
  const maxParamsFp16 = Math.floor(usable / 2.1)
  const tflops = b.gpus.reduce((s, g) => s + (g.fp16Tflops ?? 0), 0)
  const best = Math.max(...b.gpus.map((g) => g.aiScore))
  const tokensPerSec8B = Math.round(20 + best * 2.4)
  const tiers: [number, string][] = [
    [400, 'Modèles frontière (400B+) quantifiés'],
    [120, 'Llama 3.1 405B / DeepSeek quantifié partiellement'],
    [70, 'Modèles 70B (Llama 3.3 70B, Qwen 72B) en 4 bits'],
    [30, 'Modèles 30-34B en 4 bits'],
    [13, 'Modèles 13-14B, Stable Diffusion XL / Flux'],
    [7, 'Modèles 7-8B, Stable Diffusion 1.5/SDXL'],
    [0, 'Petits modèles (≤ 3B)'],
  ]
  const label = tiers.find(([min]) => maxParamsQ4 >= min)?.[1] ?? ''
  return { vramGB: vram, maxParamsQ4, maxParamsFp16, tokensPerSec8B, fp16Tflops: Math.round(tflops), label }
}

export function scoreLabel(score: number): string {
  if (score >= 90) return 'Exceptionnel'
  if (score >= 75) return 'Excellent'
  if (score >= 60) return 'Très bon'
  if (score >= 45) return 'Bon'
  if (score >= 30) return 'Correct'
  return 'Limité'
}
