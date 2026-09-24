import type { Cooler } from '../../types'

const CONSUMER = ['AM4', 'AM5', 'LGA1700', 'LGA1851']

const cooler = (c: Omit<Cooler, 'category'>): Cooler => ({ category: 'cooler', ...c })

export const coolers: Cooler[] = [
  // ───────── Ventirads grand public ─────────
  cooler({ id: 'amd-wraith-prism', brand: 'AMD', model: 'Wraith Prism', price: 20, releaseYear: 2019, tier: 'entry', segment: 'consumer', type: 'air', sockets: ['AM4', 'AM5'], heightMm: 93, maxTdp: 105 }),
  cooler({ id: 'intel-laminar-rm1', brand: 'Intel', model: 'Laminar RM1', price: 15, releaseYear: 2021, tier: 'entry', segment: 'consumer', type: 'air', sockets: ['LGA1700', 'LGA1851'], heightMm: 57, maxTdp: 65 }),
  cooler({ id: 'noctua-nh-l9a-am5', brand: 'Noctua', model: 'NH-L9a-AM5', price: 55, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: ['AM4', 'AM5'], heightMm: 37, maxTdp: 65 }),
  cooler({ id: 'noctua-nh-l9i-17xx', brand: 'Noctua', model: 'NH-L9i-17xx', price: 55, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: ['LGA1700', 'LGA1851'], heightMm: 37, maxTdp: 65 }),
  cooler({ id: 'arctic-freezer-36', brand: 'Arctic', model: 'Freezer 36', price: 35, releaseYear: 2023, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 159, maxTdp: 200 }),
  cooler({ id: 'deepcool-ak400', brand: 'Deepcool', model: 'AK400', price: 35, releaseYear: 2022, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 155, maxTdp: 220 }),
  cooler({ id: 'thermalright-peerless-assassin-120-se', brand: 'Thermalright', model: 'Peerless Assassin 120 SE', price: 40, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 155, maxTdp: 245 }),
  cooler({ id: 'thermalright-phantom-spirit-120-se', brand: 'Thermalright', model: 'Phantom Spirit 120 SE', price: 45, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 154, maxTdp: 260 }),
  cooler({ id: 'deepcool-ak620', brand: 'Deepcool', model: 'AK620', price: 65, releaseYear: 2022, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 160, maxTdp: 260 }),
  cooler({ id: 'noctua-nh-u12a', brand: 'Noctua', model: 'NH-U12A', price: 130, releaseYear: 2019, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 158, maxTdp: 220 }),
  cooler({ id: 'bequiet-dark-rock-pro-5', brand: 'be quiet!', model: 'Dark Rock Pro 5', price: 95, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 168, maxTdp: 270 }),
  cooler({ id: 'noctua-nh-d15-g2', brand: 'Noctua', model: 'NH-D15 G2', price: 150, releaseYear: 2024, tier: 'flagship', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 168, maxTdp: 280 }),
  cooler({ id: 'arctic-freezer-36-argb', brand: 'Arctic', model: 'Freezer 36 A-RGB', price: 40, releaseYear: 2023, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 159, maxTdp: 200 }),
  cooler({ id: 'id-cooling-se-224-xts', brand: 'ID-Cooling', model: 'SE-224-XTS', price: 25, releaseYear: 2022, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 154, maxTdp: 200 }),
  cooler({ id: 'bequiet-pure-rock-3', brand: 'be quiet!', model: 'Pure Rock 3', price: 45, releaseYear: 2025, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 159, maxTdp: 200 }),
  cooler({ id: 'thermalright-phantom-spirit-120-evo', brand: 'Thermalright', model: 'Phantom Spirit 120 EVO', price: 55, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 157, maxTdp: 270 }),
  cooler({ id: 'deepcool-ak500', brand: 'Deepcool', model: 'AK500', price: 60, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 158, maxTdp: 240 }),
  cooler({ id: 'deepcool-assassin-iv', brand: 'Deepcool', model: 'Assassin IV', price: 100, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 164, maxTdp: 280 }),
  cooler({ id: 'noctua-nh-u12s-redux', brand: 'Noctua', model: 'NH-U12S redux', price: 55, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 158, maxTdp: 180 }),
  cooler({ id: 'noctua-nh-d12l', brand: 'Noctua', model: 'NH-D12L', price: 100, releaseYear: 2021, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 145, maxTdp: 200 }),

  // ───────── Watercooling AIO ─────────
  cooler({ id: 'arctic-liquid-freezer-iii-pro-240', brand: 'Arctic', model: 'Liquid Freezer III Pro 240', price: 85, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 280 }),
  cooler({ id: 'arctic-liquid-freezer-iii-pro-280', brand: 'Arctic', model: 'Liquid Freezer III Pro 280', price: 100, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 280, maxTdp: 320 }),
  cooler({ id: 'arctic-liquid-freezer-iii-pro-360', brand: 'Arctic', model: 'Liquid Freezer III Pro 360', price: 115, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 350 }),
  cooler({ id: 'arctic-liquid-freezer-iii-pro-420', brand: 'Arctic', model: 'Liquid Freezer III Pro 420', price: 140, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 420, maxTdp: 380 }),
  cooler({ id: 'nzxt-kraken-240', brand: 'NZXT', model: 'Kraken 240 (2024)', price: 150, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 260 }),
  cooler({ id: 'nzxt-kraken-360', brand: 'NZXT', model: 'Kraken 360 (2024)', price: 200, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 330 }),
  cooler({ id: 'nzxt-kraken-elite-360', brand: 'NZXT', model: 'Kraken Elite 360 (2024)', price: 280, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 340 }),
  cooler({ id: 'corsair-icue-link-h100i-rgb', brand: 'Corsair', model: 'iCUE LINK H100i RGB', price: 150, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 270 }),
  cooler({ id: 'corsair-icue-link-h150i-rgb', brand: 'Corsair', model: 'iCUE LINK H150i RGB', price: 190, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 330 }),
  cooler({ id: 'lianli-galahad-ii-trinity-360', brand: 'Lian Li', model: 'Galahad II Trinity 360', price: 150, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 330 }),
  cooler({ id: 'arctic-liquid-freezer-iii-240', brand: 'Arctic', model: 'Liquid Freezer III 240', price: 75, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 270 }),
  cooler({ id: 'arctic-liquid-freezer-iii-280', brand: 'Arctic', model: 'Liquid Freezer III 280', price: 90, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 280, maxTdp: 310 }),
  cooler({ id: 'thermalright-frozen-notte-360-argb', brand: 'Thermalright', model: 'Frozen Notte 360 ARGB', price: 75, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 300 }),
  cooler({ id: 'deepcool-lt520', brand: 'Deepcool', model: 'LT520', price: 110, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 270 }),
  cooler({ id: 'bequiet-silent-loop-3-360', brand: 'be quiet!', model: 'Silent Loop 3 360', price: 150, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 330 }),
  cooler({ id: 'nzxt-kraken-elite-240', brand: 'NZXT', model: 'Kraken Elite 240 (2024)', price: 230, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 280 }),
  cooler({ id: 'corsair-nautilus-360-rs', brand: 'Corsair', model: 'Nautilus 360 RS', price: 100, releaseYear: 2025, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 310 }),

  // ───────── Stations de travail (sTR5 / SP6 / LGA4677 / SP5) ─────────
  cooler({ id: 'noctua-nh-u14s-tr5-sp6', brand: 'Noctua', model: 'NH-U14S TR5-SP6', price: 130, releaseYear: 2023, tier: 'enthusiast', segment: 'workstation', type: 'air', sockets: ['sTR5', 'SP6'], heightMm: 165, maxTdp: 350 }),
  cooler({ id: 'noctua-nh-u9-tr5-sp6', brand: 'Noctua', model: 'NH-U9 TR5-SP6 4U', price: 110, releaseYear: 2023, tier: 'performance', segment: 'workstation', type: 'air', sockets: ['sTR5', 'SP6'], heightMm: 125, maxTdp: 300 }),
  cooler({ id: 'noctua-nh-u14s-dx-4677', brand: 'Noctua', model: 'NH-U14S DX-4677', price: 120, releaseYear: 2023, tier: 'enthusiast', segment: 'workstation', type: 'air', sockets: ['LGA4677'], heightMm: 165, maxTdp: 350 }),
  cooler({ id: 'noctua-nh-d9-dx-4677-4u', brand: 'Noctua', model: 'NH-D9 DX-4677 4U', price: 110, releaseYear: 2023, tier: 'performance', segment: 'server', type: 'air', sockets: ['LGA4677'], heightMm: 134, maxTdp: 300 }),
  cooler({ id: 'arctic-freezer-4u-sp5', brand: 'Arctic', model: 'Freezer 4U-SP5', price: 70, releaseYear: 2023, tier: 'performance', segment: 'server', type: 'air', sockets: ['SP5'], heightMm: 145, maxTdp: 400 }),

  // ───────── Dissipateurs serveur rack (passifs, flux d'air châssis) ─────────
  cooler({ id: 'supermicro-1u-passive-sp5', brand: 'Supermicro', model: 'Dissipateur passif 1U SP5', price: 70, releaseYear: 2022, tier: 'mainstream', segment: 'server', type: 'air', sockets: ['SP5'], heightMm: 27, maxTdp: 300 }),
  cooler({ id: 'supermicro-2u-passive-sp5', brand: 'Supermicro', model: 'Dissipateur passif 2U SP5', price: 90, releaseYear: 2022, tier: 'performance', segment: 'server', type: 'air', sockets: ['SP5'], heightMm: 64, maxTdp: 400 }),
  cooler({ id: 'supermicro-1u-passive-lga4677', brand: 'Supermicro', model: 'Dissipateur passif 1U LGA4677', price: 65, releaseYear: 2023, tier: 'mainstream', segment: 'server', type: 'air', sockets: ['LGA4677'], heightMm: 27, maxTdp: 270 }),
  cooler({ id: 'supermicro-2u-passive-lga4677', brand: 'Supermicro', model: 'Dissipateur passif 2U LGA4677', price: 85, releaseYear: 2023, tier: 'performance', segment: 'server', type: 'air', sockets: ['LGA4677'], heightMm: 64, maxTdp: 350 }),
  cooler({ id: 'supermicro-2u-passive-sp6', brand: 'Supermicro', model: 'Dissipateur passif 2U SP6', price: 75, releaseYear: 2023, tier: 'mainstream', segment: 'server', type: 'air', sockets: ['SP6'], heightMm: 64, maxTdp: 225 }),
  cooler({ id: 'supermicro-2u-passive-lga4710', brand: 'Supermicro', model: 'Dissipateur passif 2U LGA4710', price: 90, releaseYear: 2024, tier: 'performance', segment: 'server', type: 'air', sockets: ['LGA4710'], heightMm: 64, maxTdp: 350 }),
]
