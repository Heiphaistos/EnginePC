import type { NIC } from '../../types'

// Cartes réseau additionnelles (PCIe).
export const nics: NIC[] = [
  { id: 'intel-i225-t1', category: 'nic', brand: 'Intel', model: 'Ethernet Network Adapter I225-T1 (2.5GbE)', mpn: 'I225T1', price: 55, releaseYear: 2020, tier: 'entry', segment: 'consumer', speedGbps: 2.5, ports: 1, connector: 'RJ45' },
  { id: 'tp-link-tx201', category: 'nic', brand: 'TP-Link', model: 'TX201 2.5GbE PCIe (Realtek RTL8125B)', mpn: 'TX201', price: 30, releaseYear: 2021, tier: 'entry', segment: 'consumer', speedGbps: 2.5, ports: 1, connector: 'RJ45' },
  { id: 'tp-link-tx401', category: 'nic', brand: 'TP-Link', model: 'TX401 10GbE PCIe (Marvell AQC107)', mpn: 'TX401', price: 90, releaseYear: 2020, tier: 'mainstream', segment: 'consumer', speedGbps: 10, ports: 1, connector: 'RJ45' },
  { id: 'asus-xg-c100c', category: 'nic', brand: 'ASUS', model: 'XG-C100C 10GbE PCIe (Marvell AQC107)', mpn: 'XG-C100C', price: 95, releaseYear: 2017, tier: 'mainstream', segment: 'consumer', speedGbps: 10, ports: 1, connector: 'RJ45' },
  { id: 'qnap-qxg-10g1t', category: 'nic', brand: 'QNAP', model: 'QXG-10G1T 10GbE PCIe 3.0 x4 (Marvell AQC113C)', mpn: 'QXG-10G1T', price: 110, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', speedGbps: 10, ports: 1, connector: 'RJ45' },
  { id: 'intel-x550-t2', category: 'nic', brand: 'Intel', model: 'Ethernet Converged Network Adapter X550-T2', mpn: 'X550T2', price: 250, releaseYear: 2016, tier: 'performance', segment: 'server', speedGbps: 10, ports: 2, connector: 'RJ45' },
  { id: 'intel-x710-da2', category: 'nic', brand: 'Intel', model: 'Ethernet Converged Network Adapter X710-DA2', mpn: 'X710DA2', price: 220, releaseYear: 2014, tier: 'performance', segment: 'server', speedGbps: 10, ports: 2, connector: 'SFP+' },
  { id: 'intel-e810-xxvda2', category: 'nic', brand: 'Intel', model: 'Ethernet Network Adapter E810-XXVDA2', mpn: 'E810XXVDA2', price: 400, releaseYear: 2020, tier: 'enthusiast', segment: 'server', speedGbps: 25, ports: 2, connector: 'SFP28' },
  { id: 'intel-e810-cqda2', category: 'nic', brand: 'Intel', model: 'Ethernet Network Adapter E810-CQDA2', mpn: 'E810CQDA2', price: 900, releaseYear: 2020, tier: 'flagship', segment: 'server', speedGbps: 100, ports: 2, connector: 'QSFP28' },
  { id: 'nvidia-connectx-4-lx-25g', category: 'nic', brand: 'NVIDIA Mellanox', model: 'ConnectX-4 Lx EN 2x 25GbE', mpn: 'MCX4121A-ACAT', price: 150, releaseYear: 2016, tier: 'performance', segment: 'server', speedGbps: 25, ports: 2, connector: 'SFP28' },
  { id: 'nvidia-connectx-5-100g', category: 'nic', brand: 'NVIDIA Mellanox', model: 'ConnectX-5 EN 2x 100GbE', mpn: 'MCX516A-CCAT', price: 700, releaseYear: 2017, tier: 'enthusiast', segment: 'server', speedGbps: 100, ports: 2, connector: 'QSFP28' },
  { id: 'nvidia-connectx-6-dx-100g', category: 'nic', brand: 'NVIDIA Mellanox', model: 'ConnectX-6 Dx EN 2x 100GbE', mpn: 'MCX623106AN-CDAT', price: 1100, releaseYear: 2020, tier: 'flagship', segment: 'server', speedGbps: 100, ports: 2, connector: 'QSFP56' },
  { id: 'nvidia-connectx-7-200g', category: 'nic', brand: 'NVIDIA', model: 'ConnectX-7 2x 200GbE (400 Gb/s agrégés, PCIe 5.0 x16)', mpn: 'MCX755106AS-HEAT', price: 2200, releaseYear: 2022, tier: 'flagship', segment: 'server', speedGbps: 200, ports: 2, connector: 'QSFP112' },
]
