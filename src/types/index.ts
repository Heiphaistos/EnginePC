// Modèle de données central d'EnginePC.
// Tous les catalogues (src/data/catalog) et le moteur (src/engine) s'appuient sur ces types.

export type DeviceType = 'desktop' | 'laptop' | 'server' | 'nas' | 'tablet' | 'phone'

/** Profils d'usage utilisés pour le scoring et la génération automatique. */
export type UsageProfile =
  | 'gaming'
  | 'ai'
  | 'workstation'
  | 'streaming'
  | 'office'
  | 'dev'
  | 'homelab'
  | 'virtualization'
  | 'storage'
  | 'media'
  | 'mobile'

export type Tier = 'entry' | 'mainstream' | 'performance' | 'enthusiast' | 'flagship'

/** Catégories de composants pour les machines assemblées (desktop, server, nas). */
export type ComponentCategory =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooler'
  | 'nic'
  | 'hba'
  | 'accessory'

export type FormFactor = 'E-ATX' | 'ATX' | 'mATX' | 'ITX' | 'SSI-EEB' | 'Rack-1U' | 'Rack-2U' | 'Rack-4U'
export type MemoryType = 'DDR4' | 'DDR5'
export type Segment = 'consumer' | 'server' | 'workstation'

interface BaseComponent {
  /** Identifiant unique et stable (kebab-case), ex: "amd-ryzen-7-9800x3d". */
  id: string
  category: ComponentCategory
  brand: string
  model: string
  /** Prix indicatif (EUR TTC). Remplacé par le prix live du comparateur si disponible. */
  price: number
  releaseYear: number
  tier: Tier
  segment?: Segment
  /** EAN / MPN pour le câblage avec le comparateur de prix. */
  ean?: string
  mpn?: string
  /** Provenance des données (absent = catalogue EnginePC vérifié). */
  source?: string
  /** Champs déduits/estimés automatiquement (non issus d'une fiche technique). */
  estimated?: string[]
  /** Le prix est une conversion (ex : USD → EUR TTC) et non un prix constaté en France. */
  priceEstimated?: boolean
}

export interface CPU extends BaseComponent {
  category: 'cpu'
  socket: string // AM4, AM5, LGA1700, LGA1851, SP5, SP6, LGA4677, LGA4710, sTR5
  cores: number
  threads: number
  baseClock: number // GHz
  boostClock: number // GHz
  tdp: number // W
  memoryTypes: MemoryType[]
  integratedGraphics: boolean
  /** Score relatif mono-thread (0-100, référence = meilleur desktop actuel ≈ 100). */
  singleThreadScore: number
  /** Score relatif multi-thread (0-100, 100 ≈ Threadripper/EPYC haut de gamme). */
  multiThreadScore: number
  /** Performance NPU en TOPS si présente. */
  npuTops?: number
  maxMemoryGB?: number
  pcieLanes?: number
  eccSupport?: boolean
}

export interface GPU extends BaseComponent {
  category: 'gpu'
  chipset: string // ex: "GeForce RTX 5090"
  vramGB: number
  vramType: string // GDDR6, GDDR6X, GDDR7, HBM3...
  tdp: number // W (TBP)
  lengthMm: number
  slots: number
  /** Score raster gaming relatif (0-100). */
  gamingScore: number
  /** Score calcul IA relatif (0-100), tient compte des tensor cores/écosystème CUDA/ROCm. */
  aiScore: number
  /** Performance FP16 / tenseur approximative en TFLOPS. */
  fp16Tflops?: number
  recommendedPsuW: number
  powerConnector?: string // "12V-2x6", "2x 8-pin"...
}

export interface Motherboard extends BaseComponent {
  category: 'motherboard'
  socket: string
  chipset: string
  formFactor: FormFactor
  memoryType: MemoryType
  memorySlots: number
  maxMemoryGB: number
  m2Slots: number
  sataPorts: number
  pcieX16Slots: number
  wifi: boolean
  lan: string // "2.5GbE", "10GbE", "2x 1GbE"
  eccSupport?: boolean
  ipmi?: boolean
}

export interface RAM extends BaseComponent {
  category: 'ram'
  memoryType: MemoryType
  capacityGB: number // capacité totale du kit
  modules: number
  speedMTs: number
  casLatency: number
  ecc: boolean
  registered: boolean
}

export type StorageInterface = 'NVMe PCIe 3.0' | 'NVMe PCIe 4.0' | 'NVMe PCIe 5.0' | 'SATA' | 'SAS' | 'U.2'

export interface Storage extends BaseComponent {
  category: 'storage'
  kind: 'nvme' | 'ssd' | 'hdd'
  interface: StorageInterface
  formFactorDrive: 'M.2 2280' | 'M.2 2230' | '2.5"' | '3.5"' | 'U.2'
  capacityGB: number
  readMBs: number
  writeMBs: number
  /** Endurance en TBW (SSD) — optionnel. */
  tbw?: number
  rpm?: number
  /** Conçu pour NAS/serveur (CMR, fonctionnement 24/7). */
  nasRated?: boolean
}

export interface PSU extends BaseComponent {
  category: 'psu'
  wattage: number
  efficiency: '80+ White' | '80+ Bronze' | '80+ Gold' | '80+ Platinum' | '80+ Titanium'
  modular: 'full' | 'semi' | 'none'
  formFactor: 'ATX' | 'SFX' | 'SFX-L' | 'Redundant'
  atx31: boolean
}

export interface Case extends BaseComponent {
  category: 'case'
  supportedFormFactors: FormFactor[]
  maxGpuLengthMm: number
  maxCoolerHeightMm: number
  driveBays35: number
  driveBays25: number
  psuFormFactor: 'ATX' | 'SFX' | 'SFX-L' | 'Redundant'
  /** Radiateur max supporté (mm), 0 si aucun. */
  maxRadiatorMm: number
  type: 'tower' | 'mid-tower' | 'mini' | 'rack' | 'nas'
}

export interface Cooler extends BaseComponent {
  category: 'cooler'
  type: 'air' | 'aio'
  sockets: string[]
  heightMm?: number // air uniquement
  radiatorMm?: number // AIO uniquement
  /** TDP max dissipable (W). */
  maxTdp: number
}

export interface NIC extends BaseComponent {
  category: 'nic'
  speedGbps: number
  ports: number
  connector: 'RJ45' | 'SFP+' | 'SFP28' | 'QSFP28' | 'QSFP56' | 'QSFP112'
}

export interface HBA extends BaseComponent {
  category: 'hba'
  kind: 'hba' | 'raid'
  ports: number
  interface: 'SAS3' | 'SAS4' | 'Tri-mode'
}

export type AccessoryKind =
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'headphones'
  | 'speakers'
  | 'webcam'
  | 'case-fan'
  | 'thermal-paste'
  | 'wifi-card'
  | 'sound-card'
  | 'ups'
  | 'os'
  | 'external-storage'

/** Périphériques et accessoires : ajoutés au prix, sans règle de compatibilité. */
export interface Accessory extends BaseComponent {
  category: 'accessory'
  kind: AccessoryKind
  /** Caractéristiques libres déjà formatées (ex : "27\"", "2560×1440", "165 Hz"). */
  specs: string[]
  /** Moniteurs : fréquence de rafraîchissement (Hz) et hauteur de définition (px). */
  refreshHz?: number
  resolutionY?: number
}

export type PCComponent = CPU | GPU | Motherboard | RAM | Storage | PSU | Case | Cooler | NIC | HBA | Accessory

/** Appareils complets (portable, tablette, téléphone, NAS clé en main). */
export interface Device {
  id: string
  deviceType: 'laptop' | 'tablet' | 'phone' | 'nas'
  brand: string
  model: string
  price: number
  releaseYear: number
  tier: Tier
  os: string
  cpu: string
  gpu?: string
  ramGB: number
  storageGB: number
  /** Taille d'écran en pouces (0 pour un NAS). */
  screenInches: number
  screenSpec?: string // "2560x1600 OLED 120Hz"
  batteryWh?: number // portables/tablettes ; mAh pour téléphones dans batteryMah
  batteryMah?: number
  weightKg: number
  /** NAS : nombre de baies. */
  bays?: number
  /** Scores relatifs 0-100 par usage pertinent. */
  scores: Partial<Record<UsageProfile, number>>
  highlights: string[]
  ean?: string
}

/** Emplacements d'une configuration assemblée. */
export interface BuildSlots {
  cpu?: string
  gpu?: string[] // plusieurs GPU possibles (IA / serveur)
  motherboard?: string
  ram?: string
  ramKits?: number // nombre de kits identiques
  storage?: string[]
  psu?: string
  case?: string
  cooler?: string
  nic?: string
  hba?: string
  accessories?: string[]
}

export interface Build {
  id: string
  name: string
  deviceType: DeviceType
  profile: UsageProfile
  /** Configuration assemblée (desktop / server / nas DIY). */
  slots: BuildSlots
  /** Appareil complet (laptop / tablet / phone / nas clé en main). */
  deviceId?: string
  createdAt: number
  updatedAt: number
  notes?: string
}

export type IssueSeverity = 'error' | 'warning' | 'info'

export interface CompatibilityIssue {
  severity: IssueSeverity
  message: string
  categories: ComponentCategory[]
}
