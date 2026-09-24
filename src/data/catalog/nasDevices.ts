import type { Device } from '../../types'

// NAS clé en main (livrés sans disques sauf mention contraire : storageGB = 0).
export const nasDevices: Device[] = [
  // ── Synology ────────────────────────────────────────────────────────────
  { id: 'synology-ds224-plus', deviceType: 'nas', brand: 'Synology', model: 'DiskStation DS224+', price: 349, releaseYear: 2023, tier: 'entry', os: 'DSM 7', cpu: 'Intel Celeron J4125', ramGB: 2, storageGB: 0, screenInches: 0, weightKg: 1.3, bays: 2,
    scores: { storage: 45, media: 60, homelab: 45, virtualization: 20 }, highlights: ['Écosystème DSM complet', 'Transcodage matériel Intel', '2x 1GbE'] },
  { id: 'synology-ds225-plus', deviceType: 'nas', brand: 'Synology', model: 'DiskStation DS225+', price: 379, releaseYear: 2025, tier: 'entry', os: 'DSM 7', cpu: 'Intel Celeron J4125', ramGB: 2, storageGB: 0, screenInches: 0, weightKg: 1.3, bays: 2,
    scores: { storage: 47, media: 62, homelab: 47, virtualization: 20 }, highlights: ['Port 2,5GbE', 'Transcodage matériel', 'Sauvegarde Active Backup'] },
  { id: 'synology-ds725-plus', deviceType: 'nas', brand: 'Synology', model: 'DiskStation DS725+', price: 499, releaseYear: 2025, tier: 'mainstream', os: 'DSM 7', cpu: 'AMD Ryzen R1600', ramGB: 4, storageGB: 0, screenInches: 0, weightKg: 1.5, bays: 2,
    scores: { storage: 50, media: 45, homelab: 55, virtualization: 38 }, highlights: ['Ryzen R1600', '2 emplacements M.2', 'RAM ECC extensible 32 Go'] },
  { id: 'synology-ds425-plus', deviceType: 'nas', brand: 'Synology', model: 'DiskStation DS425+', price: 529, releaseYear: 2025, tier: 'mainstream', os: 'DSM 7', cpu: 'Intel Celeron J4125', ramGB: 2, storageGB: 0, screenInches: 0, weightKg: 2.2, bays: 4,
    scores: { storage: 62, media: 64, homelab: 50, virtualization: 22 }, highlights: ['4 baies + 2 M.2', 'Port 2,5GbE', 'Transcodage matériel'] },
  { id: 'synology-ds923-plus', deviceType: 'nas', brand: 'Synology', model: 'DiskStation DS923+', price: 599, releaseYear: 2022, tier: 'mainstream', os: 'DSM 7', cpu: 'AMD Ryzen R1600', ramGB: 4, storageGB: 0, screenInches: 0, weightKg: 2.2, bays: 4,
    scores: { storage: 64, media: 48, homelab: 60, virtualization: 42 }, highlights: ['Extensible à 9 baies', 'Emplacement 10GbE optionnel', 'RAM ECC'] },
  { id: 'synology-ds1522-plus', deviceType: 'nas', brand: 'Synology', model: 'DiskStation DS1522+', price: 799, releaseYear: 2022, tier: 'performance', os: 'DSM 7', cpu: 'AMD Ryzen R1600', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 2.7, bays: 5,
    scores: { storage: 70, media: 48, homelab: 64, virtualization: 46 }, highlights: ['5 baies extensibles à 15', '4x 1GbE + 10GbE optionnel', '8 Go ECC'] },
  { id: 'synology-ds1825-plus', deviceType: 'nas', brand: 'Synology', model: 'DiskStation DS1825+', price: 1199, releaseYear: 2025, tier: 'enthusiast', os: 'DSM 7', cpu: 'AMD Ryzen V1500B', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 6.1, bays: 8,
    scores: { storage: 82, media: 45, homelab: 68, virtualization: 52 }, highlights: ['8 baies extensibles à 18', '2x 2,5GbE + PCIe', '2 emplacements M.2'] },
  { id: 'synology-rs1221-plus', deviceType: 'nas', brand: 'Synology', model: 'RackStation RS1221+', price: 1399, releaseYear: 2021, tier: 'enthusiast', os: 'DSM 7', cpu: 'AMD Ryzen V1500B', ramGB: 4, storageGB: 0, screenInches: 0, weightKg: 9.5, bays: 8,
    scores: { storage: 80, media: 42, homelab: 66, virtualization: 50 }, highlights: ['Format rack 2U', '8 baies extensibles à 12', 'Slot PCIe 10GbE'] },

  // ── UGREEN ──────────────────────────────────────────────────────────────
  { id: 'ugreen-nasync-dxp2800', deviceType: 'nas', brand: 'UGREEN', model: 'NASync DXP2800', price: 349, releaseYear: 2024, tier: 'entry', os: 'UGOS Pro', cpu: 'Intel N100', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 1.8, bays: 2,
    scores: { storage: 48, media: 70, homelab: 55, virtualization: 30 }, highlights: ['Intel N100 économe', '8 Go DDR5', '2,5GbE + 2 M.2'] },
  { id: 'ugreen-nasync-dxp4800-plus', deviceType: 'nas', brand: 'UGREEN', model: 'NASync DXP4800 Plus', price: 649, releaseYear: 2024, tier: 'mainstream', os: 'UGOS Pro', cpu: 'Intel Pentium Gold 8505', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 3.3, bays: 4,
    scores: { storage: 66, media: 76, homelab: 66, virtualization: 45 }, highlights: ['10GbE + 2,5GbE', '4 baies + 2 M.2', 'Compatible TrueNAS/Unraid'] },
  { id: 'ugreen-nasync-dxp6800-pro', deviceType: 'nas', brand: 'UGREEN', model: 'NASync DXP6800 Pro', price: 1099, releaseYear: 2024, tier: 'performance', os: 'UGOS Pro', cpu: 'Intel Core i5-1235U', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 4.6, bays: 6,
    scores: { storage: 76, media: 84, homelab: 76, virtualization: 62 }, highlights: ['Core i5 10 cœurs', '2x 10GbE', 'Extension PCIe'] },
  { id: 'ugreen-nasync-dxp8800-plus', deviceType: 'nas', brand: 'UGREEN', model: 'NASync DXP8800 Plus', price: 1399, releaseYear: 2024, tier: 'enthusiast', os: 'UGOS Pro', cpu: 'Intel Core i5-1235U', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 6.9, bays: 8,
    scores: { storage: 84, media: 84, homelab: 78, virtualization: 64 }, highlights: ['8 baies + 2 M.2', '2x 10GbE', 'RAM jusqu\'à 64 Go'] },

  // ── QNAP ────────────────────────────────────────────────────────────────
  { id: 'qnap-ts-464-8g', deviceType: 'nas', brand: 'QNAP', model: 'TS-464-8G', price: 599, releaseYear: 2022, tier: 'mainstream', os: 'QTS 5', cpu: 'Intel Celeron N5095', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 2.2, bays: 4,
    scores: { storage: 62, media: 72, homelab: 62, virtualization: 40 }, highlights: ['2x 2,5GbE', 'Sortie HDMI 4K', 'Slot PCIe + 2 M.2'] },
  { id: 'qnap-ts-873a-8g', deviceType: 'nas', brand: 'QNAP', model: 'TS-873A-8G', price: 1199, releaseYear: 2021, tier: 'performance', os: 'QTS 5', cpu: 'AMD Ryzen V1500B', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 5.3, bays: 8,
    scores: { storage: 80, media: 45, homelab: 66, virtualization: 54 }, highlights: ['8 baies + 2 M.2', '2x 2,5GbE + 2 slots PCIe', 'RAM jusqu\'à 64 Go'] },
  { id: 'qnap-ts-h973ax-8g', deviceType: 'nas', brand: 'QNAP', model: 'TS-h973AX-8G', price: 1399, releaseYear: 2021, tier: 'performance', os: 'QuTS hero (ZFS)', cpu: 'AMD Ryzen V1500B', ramGB: 8, storageGB: 0, screenInches: 0, weightKg: 5.6, bays: 9,
    scores: { storage: 80, media: 45, homelab: 68, virtualization: 55 }, highlights: ['Système ZFS QuTS hero', '10GbE + 2x 2,5GbE', 'Baies U.2 NVMe'] },
  { id: 'qnap-tvs-h874-i5-32g', deviceType: 'nas', brand: 'QNAP', model: 'TVS-h874-i5-32G', price: 2399, releaseYear: 2022, tier: 'flagship', os: 'QuTS hero (ZFS)', cpu: 'Intel Core i5-12400', ramGB: 32, storageGB: 0, screenInches: 0, weightKg: 7.6, bays: 8,
    scores: { storage: 86, media: 88, homelab: 84, virtualization: 78 }, highlights: ['Core i5 12e gén.', 'ZFS + PCIe Gen 4', '32 Go de RAM'] },

  // ── Asustor / TerraMaster / Minisforum ──────────────────────────────────
  { id: 'asustor-lockerstor-4-gen3-as6804t', deviceType: 'nas', brand: 'Asustor', model: 'Lockerstor 4 Gen3 (AS6804T)', price: 1099, releaseYear: 2025, tier: 'performance', os: 'ADM', cpu: 'AMD Ryzen Embedded V3C14', ramGB: 16, storageGB: 0, screenInches: 0, weightKg: 3.3, bays: 4,
    scores: { storage: 70, media: 50, homelab: 76, virtualization: 70 }, highlights: ['2x 10GbE', 'DDR5 ECC', 'USB4 et 4 M.2 NVMe'] },
  { id: 'asustor-flashstor-12-pro-gen2-fs6812x', deviceType: 'nas', brand: 'Asustor', model: 'Flashstor 12 Pro Gen2 (FS6812X)', price: 1199, releaseYear: 2024, tier: 'enthusiast', os: 'ADM', cpu: 'AMD Ryzen Embedded V3C14', ramGB: 16, storageGB: 0, screenInches: 0, weightKg: 2.5, bays: 12,
    scores: { storage: 72, media: 50, homelab: 78, virtualization: 70 }, highlights: ['12 emplacements M.2 NVMe', '100 % flash silencieux', '2x 10GbE'] },
  { id: 'terramaster-f4-424-pro', deviceType: 'nas', brand: 'TerraMaster', model: 'F4-424 Pro', price: 699, releaseYear: 2024, tier: 'mainstream', os: 'TOS 6', cpu: 'Intel Core i3-N300', ramGB: 32, storageGB: 0, screenInches: 0, weightKg: 2.5, bays: 4,
    scores: { storage: 64, media: 74, homelab: 70, virtualization: 55 }, highlights: ['32 Go DDR5 d\'origine', 'i3-N300 8 cœurs', '2x 2,5GbE'] },
  { id: 'minisforum-n5-pro-32g', deviceType: 'nas', brand: 'Minisforum', model: 'N5 Pro AI NAS (32 Go)', price: 1299, releaseYear: 2025, tier: 'enthusiast', os: 'MinisCloud OS', cpu: 'AMD Ryzen AI 9 HX PRO 370', ramGB: 32, storageGB: 0, screenInches: 0, weightKg: 5.0, bays: 5,
    scores: { storage: 72, media: 90, homelab: 92, virtualization: 88 }, highlights: ['Ryzen AI 9 12 cœurs + NPU', '10GbE + 5GbE', 'RAM ECC jusqu\'à 96 Go'] },
]
