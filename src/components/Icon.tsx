import {
  Box,
  BrainCircuit,
  Briefcase,
  Clapperboard,
  Code2,
  Cpu,
  Fan,
  Film,
  Gamepad2,
  HardDrive,
  Keyboard,
  Laptop,
  Layers,
  MemoryStick,
  Monitor,
  Network,
  Plane,
  Plug,
  Radio,
  Server,
  Smartphone,
  Tablet,
  CircuitBoard,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { ComponentCategory } from '../types'

const ICONS: Record<string, LucideIcon> = {
  BrainCircuit,
  Briefcase,
  Clapperboard,
  Code2,
  Film,
  Gamepad2,
  HardDrive,
  Laptop,
  Layers,
  Monitor,
  Plane,
  Radio,
  Server,
  Smartphone,
  Tablet,
}

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Box
  return <C className={className} />
}

export const CATEGORY_ICONS: Record<ComponentCategory, LucideIcon> = {
  cpu: Cpu,
  gpu: Monitor,
  motherboard: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  psu: Plug,
  case: Box,
  cooler: Fan,
  nic: Network,
  hba: Zap,
  accessory: Keyboard,
}

export function CategoryIcon({ category, className }: { category: ComponentCategory; className?: string }) {
  const C = CATEGORY_ICONS[category]
  return <C className={className} />
}
