import type { HBA } from '../../types'

// Contrôleurs de stockage : HBA (IT mode) et cartes RAID. ports = lignes SAS/SATA internes.
export const hbas: HBA[] = [
  { id: 'broadcom-9300-8i', category: 'hba', brand: 'Broadcom', model: 'HBA 9300-8i (SAS3 12Gb/s)', price: 150, releaseYear: 2013, tier: 'entry', segment: 'server', kind: 'hba', ports: 8, interface: 'SAS3' },
  { id: 'broadcom-9400-16i', category: 'hba', brand: 'Broadcom', model: 'HBA 9400-16i (Tri-mode, PCIe 3.1)', price: 350, releaseYear: 2017, tier: 'mainstream', segment: 'server', kind: 'hba', ports: 16, interface: 'Tri-mode' },
  { id: 'broadcom-9500-8i', category: 'hba', brand: 'Broadcom', model: 'HBA 9500-8i (Tri-mode, PCIe 4.0)', price: 400, releaseYear: 2020, tier: 'performance', segment: 'server', kind: 'hba', ports: 8, interface: 'Tri-mode' },
  { id: 'broadcom-9500-16i', category: 'hba', brand: 'Broadcom', model: 'HBA 9500-16i (Tri-mode, PCIe 4.0)', price: 600, releaseYear: 2020, tier: 'performance', segment: 'server', kind: 'hba', ports: 16, interface: 'Tri-mode' },
  { id: 'broadcom-9600-16i', category: 'hba', brand: 'Broadcom', model: 'HBA 9600-16i (Tri-mode SAS4 24Gb/s, PCIe 4.0)', price: 800, releaseYear: 2022, tier: 'enthusiast', segment: 'server', kind: 'hba', ports: 16, interface: 'SAS4' },
  { id: 'broadcom-megaraid-9460-8i', category: 'hba', brand: 'Broadcom', model: 'MegaRAID 9460-8i (Tri-mode, 2GB cache)', price: 550, releaseYear: 2017, tier: 'mainstream', segment: 'server', kind: 'raid', ports: 8, interface: 'Tri-mode' },
  { id: 'broadcom-megaraid-9560-16i', category: 'hba', brand: 'Broadcom', model: 'MegaRAID 9560-16i (Tri-mode, 8GB cache, PCIe 4.0)', price: 1000, releaseYear: 2020, tier: 'enthusiast', segment: 'server', kind: 'raid', ports: 16, interface: 'Tri-mode' },
  { id: 'broadcom-megaraid-9660-16i', category: 'hba', brand: 'Broadcom', model: 'MegaRAID 9660-16i (Tri-mode SAS4 24Gb/s, 4GB cache)', price: 1300, releaseYear: 2022, tier: 'flagship', segment: 'server', kind: 'raid', ports: 16, interface: 'SAS4' },
  { id: 'microchip-adaptec-smartraid-3254-16i', category: 'hba', brand: 'Microchip Adaptec', model: 'SmartRAID 3254-16i /e (SAS4 24Gb/s, 8GB cache)', price: 1100, releaseYear: 2021, tier: 'enthusiast', segment: 'server', kind: 'raid', ports: 16, interface: 'SAS4' },
]
