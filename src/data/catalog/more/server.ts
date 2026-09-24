import type { HBA, NIC } from '../../../types'

const n = (x: Omit<NIC, 'category'>): NIC => ({ category: 'nic', ...x })
const h = (x: Omit<HBA, 'category'>): HBA => ({ category: 'hba', ...x })

// Cartes réseau additionnelles (PCIe).
export const moreNics: NIC[] = [
  n({ id: 'nic2-intel-i210-t1', brand: 'Intel', model: 'Ethernet Server Adapter I210-T1 (1GbE)', mpn: 'I210T1', price: 45, releaseYear: 2013, tier: 'entry', segment: 'server', speedGbps: 1, ports: 1, connector: 'RJ45' }),
  n({ id: 'nic2-intel-i350-t2', brand: 'Intel', model: 'Ethernet Server Adapter I350-T2 (2x 1GbE)', mpn: 'I350T2V2', price: 90, releaseYear: 2011, tier: 'entry', segment: 'server', speedGbps: 1, ports: 2, connector: 'RJ45' }),
  n({ id: 'nic2-intel-i350-t4', brand: 'Intel', model: 'Ethernet Server Adapter I350-T4 (4x 1GbE)', mpn: 'I350T4V2', price: 130, releaseYear: 2011, tier: 'mainstream', segment: 'server', speedGbps: 1, ports: 4, connector: 'RJ45' }),
  n({ id: 'nic2-intel-x520-da2', brand: 'Intel', model: 'Ethernet Converged Network Adapter X520-DA2', mpn: 'E10G42BTDA', price: 150, releaseYear: 2011, tier: 'mainstream', segment: 'server', speedGbps: 10, ports: 2, connector: 'SFP+' }),
  n({ id: 'nic2-intel-x540-t2', brand: 'Intel', model: 'Ethernet Converged Network Adapter X540-T2', mpn: 'X540T2', price: 180, releaseYear: 2012, tier: 'mainstream', segment: 'server', speedGbps: 10, ports: 2, connector: 'RJ45' }),
  n({ id: 'nic2-intel-x710-da4', brand: 'Intel', model: 'Ethernet Converged Network Adapter X710-DA4', mpn: 'X710DA4', price: 400, releaseYear: 2014, tier: 'performance', segment: 'server', speedGbps: 10, ports: 4, connector: 'SFP+' }),
  n({ id: 'nic2-intel-x710-t4l', brand: 'Intel', model: 'Ethernet Network Adapter X710-T4L', mpn: 'X710T4L', price: 450, releaseYear: 2020, tier: 'performance', segment: 'server', speedGbps: 10, ports: 4, connector: 'RJ45' }),
  n({ id: 'nic2-intel-xxv710-da2', brand: 'Intel', model: 'Ethernet Network Adapter XXV710-DA2', mpn: 'XXV710DA2', price: 350, releaseYear: 2017, tier: 'enthusiast', segment: 'server', speedGbps: 25, ports: 2, connector: 'SFP28' }),
  n({ id: 'nic2-intel-e810-xxvda4', brand: 'Intel', model: 'Ethernet Network Adapter E810-XXVDA4', mpn: 'E810XXVDA4', price: 650, releaseYear: 2020, tier: 'enthusiast', segment: 'server', speedGbps: 25, ports: 4, connector: 'SFP28' }),
  n({ id: 'nic2-mellanox-connectx-3-pro-10g', brand: 'NVIDIA Mellanox', model: 'ConnectX-3 Pro EN 2x 10GbE', mpn: 'MCX312B-XCCT', price: 80, releaseYear: 2014, tier: 'mainstream', segment: 'server', speedGbps: 10, ports: 2, connector: 'SFP+' }),
  n({ id: 'nic2-mellanox-connectx-4-lx-10g', brand: 'NVIDIA Mellanox', model: 'ConnectX-4 Lx EN 2x 10GbE', mpn: 'MCX4121A-XCAT', price: 120, releaseYear: 2016, tier: 'performance', segment: 'server', speedGbps: 10, ports: 2, connector: 'SFP+' }),
  n({ id: 'nic2-nvidia-connectx-6-lx-25g', brand: 'NVIDIA Mellanox', model: 'ConnectX-6 Lx EN 2x 25GbE', mpn: 'MCX631102AN-ADAT', price: 380, releaseYear: 2020, tier: 'enthusiast', segment: 'server', speedGbps: 25, ports: 2, connector: 'SFP28' }),
  n({ id: 'nic2-nvidia-connectx-6-dx-25g', brand: 'NVIDIA Mellanox', model: 'ConnectX-6 Dx EN 2x 25GbE', mpn: 'MCX621102AN-ADAT', price: 500, releaseYear: 2020, tier: 'enthusiast', segment: 'server', speedGbps: 25, ports: 2, connector: 'SFP28' }),
  n({ id: 'nic2-broadcom-p210tp', brand: 'Broadcom', model: 'NetXtreme-E P210TP 2x 10GBASE-T (BCM57416)', mpn: 'BCM957416A4160C', price: 220, releaseYear: 2017, tier: 'performance', segment: 'server', speedGbps: 10, ports: 2, connector: 'RJ45' }),
  n({ id: 'nic2-broadcom-p225p', brand: 'Broadcom', model: 'NetXtreme-E P225P 2x 25GbE (BCM57414)', mpn: 'BCM957414A4142CC', price: 280, releaseYear: 2017, tier: 'enthusiast', segment: 'server', speedGbps: 25, ports: 2, connector: 'SFP28' }),
  n({ id: 'nic2-chelsio-t520-cr', brand: 'Chelsio', model: 'T520-CR 2x 10GbE', mpn: 'T520-CR', price: 300, releaseYear: 2014, tier: 'performance', segment: 'server', speedGbps: 10, ports: 2, connector: 'SFP+' }),
  n({ id: 'nic2-asus-xg-c100f', brand: 'ASUS', model: 'XG-C100F 10GbE SFP+ (Marvell AQC100)', mpn: 'XG-C100F', price: 110, releaseYear: 2019, tier: 'mainstream', segment: 'consumer', speedGbps: 10, ports: 1, connector: 'SFP+' }),
  n({ id: 'nic2-qnap-qxg-10g2t-x710', brand: 'QNAP', model: 'QXG-10G2T-X710 2x 10GbE (Intel X710-AT2)', mpn: 'QXG-10G2T-X710', price: 300, releaseYear: 2022, tier: 'performance', segment: 'server', speedGbps: 10, ports: 2, connector: 'RJ45' }),
  n({ id: 'nic2-qnap-qxg-25g2sf-cx6', brand: 'QNAP', model: 'QXG-25G2SF-CX6 2x 25GbE (ConnectX-6 Lx)', mpn: 'QXG-25G2SF-CX6', price: 420, releaseYear: 2022, tier: 'enthusiast', segment: 'server', speedGbps: 25, ports: 2, connector: 'SFP28' }),
  n({ id: 'nic2-synology-e10g18-t1', brand: 'Synology', model: 'E10G18-T1 10GbE', mpn: 'E10G18-T1', price: 150, releaseYear: 2018, tier: 'mainstream', segment: 'consumer', speedGbps: 10, ports: 1, connector: 'RJ45' }),
  n({ id: 'nic2-synology-e10g21-f2', brand: 'Synology', model: 'E10G21-F2 2x 10GbE SFP+', mpn: 'E10G21-F2', price: 280, releaseYear: 2021, tier: 'performance', segment: 'server', speedGbps: 10, ports: 2, connector: 'SFP+' }),
  n({ id: 'nic2-synology-e25g21-f2', brand: 'Synology', model: 'E25G21-F2 2x 25GbE SFP28', mpn: 'E25G21-F2', price: 450, releaseYear: 2021, tier: 'enthusiast', segment: 'server', speedGbps: 25, ports: 2, connector: 'SFP28' }),
]

// Contrôleurs de stockage : HBA (IT mode) et cartes RAID. ports = lignes SAS/SATA internes.
export const moreHbas: HBA[] = [
  h({ id: 'hba2-broadcom-9300-16i', brand: 'Broadcom', model: 'HBA 9300-16i (SAS3 12Gb/s)', mpn: '05-25600-00', price: 250, releaseYear: 2014, tier: 'entry', segment: 'server', kind: 'hba', ports: 16, interface: 'SAS3' }),
  h({ id: 'hba2-broadcom-9305-16i', brand: 'Broadcom', model: 'HBA 9305-16i (SAS3 12Gb/s)', mpn: '05-25703-00', price: 400, releaseYear: 2015, tier: 'mainstream', segment: 'server', kind: 'hba', ports: 16, interface: 'SAS3' }),
  h({ id: 'hba2-broadcom-9305-24i', brand: 'Broadcom', model: 'HBA 9305-24i (SAS3 12Gb/s)', mpn: '05-25699-00', price: 550, releaseYear: 2015, tier: 'performance', segment: 'server', kind: 'hba', ports: 24, interface: 'SAS3' }),
  h({ id: 'hba2-broadcom-9400-8i', brand: 'Broadcom', model: 'HBA 9400-8i (Tri-mode, PCIe 3.1)', mpn: '05-50008-00', price: 250, releaseYear: 2017, tier: 'entry', segment: 'server', kind: 'hba', ports: 8, interface: 'Tri-mode' }),
  h({ id: 'hba2-broadcom-9600-24i', brand: 'Broadcom', model: 'HBA 9600-24i (Tri-mode SAS4 24Gb/s, PCIe 4.0)', mpn: '05-50111-00', price: 1000, releaseYear: 2022, tier: 'flagship', segment: 'server', kind: 'hba', ports: 24, interface: 'SAS4' }),
  h({ id: 'hba2-broadcom-megaraid-9361-8i', brand: 'Broadcom', model: 'MegaRAID 9361-8i (SAS3, 1GB cache)', mpn: '05-25420-08', price: 350, releaseYear: 2014, tier: 'entry', segment: 'server', kind: 'raid', ports: 8, interface: 'SAS3' }),
  h({ id: 'hba2-broadcom-megaraid-9440-8i', brand: 'Broadcom', model: 'MegaRAID 9440-8i (Tri-mode, sans cache)', mpn: '05-50008-02', price: 300, releaseYear: 2017, tier: 'entry', segment: 'server', kind: 'raid', ports: 8, interface: 'Tri-mode' }),
  h({ id: 'hba2-broadcom-megaraid-9560-8i', brand: 'Broadcom', model: 'MegaRAID 9560-8i (Tri-mode, 4GB cache, PCIe 4.0)', mpn: '05-50077-01', price: 700, releaseYear: 2020, tier: 'performance', segment: 'server', kind: 'raid', ports: 8, interface: 'Tri-mode' }),
  h({ id: 'hba2-broadcom-megaraid-9670w-16i', brand: 'Broadcom', model: 'MegaRAID 9670W-16i (Tri-mode SAS4 24Gb/s, 8GB cache)', mpn: '05-50115-00', price: 1500, releaseYear: 2022, tier: 'flagship', segment: 'server', kind: 'raid', ports: 16, interface: 'SAS4' }),
  h({ id: 'hba2-microchip-adaptec-hba-1100-8i', brand: 'Microchip Adaptec', model: 'HBA 1100-8i (SAS3 12Gb/s)', mpn: '2293400-R', price: 250, releaseYear: 2018, tier: 'entry', segment: 'server', kind: 'hba', ports: 8, interface: 'SAS3' }),
  h({ id: 'hba2-microchip-adaptec-smartraid-3152-8i', brand: 'Microchip Adaptec', model: 'SmartRAID 3152-8i (SAS3, 2GB cache)', mpn: '2291700-R', price: 600, releaseYear: 2018, tier: 'mainstream', segment: 'server', kind: 'raid', ports: 8, interface: 'SAS3' }),
]
