import type { Cooler } from '../../../types'

const CONSUMER = ['AM4', 'AM5', 'LGA1700', 'LGA1851']

const k = (x: Omit<Cooler, 'category'>): Cooler => ({ category: 'cooler', ...x })

export const moreCoolers: Cooler[] = [
  // ───────── Noctua ─────────
  k({ id: 'cool2-noctua-nh-d15', brand: 'Noctua', model: 'NH-D15', price: 110, releaseYear: 2014, tier: 'enthusiast', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 165, maxTdp: 250 }),
  k({ id: 'cool2-noctua-nh-d15s', brand: 'Noctua', model: 'NH-D15S', price: 100, releaseYear: 2015, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 160, maxTdp: 230 }),
  k({ id: 'cool2-noctua-nh-u12s', brand: 'Noctua', model: 'NH-U12S', price: 75, releaseYear: 2013, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 158, maxTdp: 185 }),
  k({ id: 'cool2-noctua-nh-u14s', brand: 'Noctua', model: 'NH-U14S', price: 90, releaseYear: 2013, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 165, maxTdp: 220 }),
  k({ id: 'cool2-noctua-nh-u9s', brand: 'Noctua', model: 'NH-U9S', price: 70, releaseYear: 2015, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 125, maxTdp: 160 }),
  k({ id: 'cool2-noctua-nh-c14s', brand: 'Noctua', model: 'NH-C14S', price: 90, releaseYear: 2015, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 142, maxTdp: 190 }),
  k({ id: 'cool2-noctua-nh-l12s', brand: 'Noctua', model: 'NH-L12S', price: 60, releaseYear: 2018, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 70, maxTdp: 120 }),
  k({ id: 'cool2-noctua-nh-l12sx77', brand: 'Noctua', model: 'NH-L12Sx77', price: 65, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 77, maxTdp: 130 }),
  k({ id: 'cool2-noctua-nh-d9l', brand: 'Noctua', model: 'NH-D9L', price: 65, releaseYear: 2015, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 110, maxTdp: 140 }),
  k({ id: 'cool2-noctua-nh-l9x65', brand: 'Noctua', model: 'NH-L9x65', price: 55, releaseYear: 2014, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 65, maxTdp: 95 }),

  // ───────── Thermalright ─────────
  k({ id: 'cool2-thermalright-peerless-assassin-120', brand: 'Thermalright', model: 'Peerless Assassin 120', price: 45, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 157, maxTdp: 245 }),
  k({ id: 'cool2-thermalright-peerless-assassin-140', brand: 'Thermalright', model: 'Peerless Assassin 140', price: 55, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 155, maxTdp: 265 }),
  k({ id: 'cool2-thermalright-frost-commander-140', brand: 'Thermalright', model: 'Frost Commander 140', price: 60, releaseYear: 2022, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 158, maxTdp: 265 }),
  k({ id: 'cool2-thermalright-assassin-x-120-r-se', brand: 'Thermalright', model: 'Assassin X 120 Refined SE', price: 20, releaseYear: 2022, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 148, maxTdp: 200 }),
  k({ id: 'cool2-thermalright-axp90-x47', brand: 'Thermalright', model: 'AXP90-X47', price: 25, releaseYear: 2020, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 47, maxTdp: 95 }),
  k({ id: 'cool2-thermalright-axp120-x67', brand: 'Thermalright', model: 'AXP120-X67', price: 35, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 67, maxTdp: 150 }),

  // ───────── be quiet! / Arctic / DeepCool / ID-Cooling ─────────
  k({ id: 'cool2-bequiet-dark-rock-5', brand: 'be quiet!', model: 'Dark Rock 5', price: 80, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 161, maxTdp: 210 }),
  k({ id: 'cool2-bequiet-dark-rock-elite', brand: 'be quiet!', model: 'Dark Rock Elite', price: 115, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 168, maxTdp: 280 }),
  k({ id: 'cool2-bequiet-pure-rock-2', brand: 'be quiet!', model: 'Pure Rock 2', price: 40, releaseYear: 2020, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 155, maxTdp: 150 }),
  k({ id: 'cool2-bequiet-shadow-rock-3', brand: 'be quiet!', model: 'Shadow Rock 3', price: 55, releaseYear: 2018, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 163, maxTdp: 190 }),
  k({ id: 'cool2-bequiet-pure-rock-slim-2', brand: 'be quiet!', model: 'Pure Rock Slim 2', price: 30, releaseYear: 2020, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 128, maxTdp: 130 }),
  k({ id: 'cool2-arctic-freezer-7-x', brand: 'Arctic', model: 'Freezer 7 X', price: 20, releaseYear: 2020, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 132, maxTdp: 115 }),
  k({ id: 'cool2-arctic-freezer-34-esports-duo', brand: 'Arctic', model: 'Freezer 34 eSports DUO', price: 40, releaseYear: 2019, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: ['AM4', 'AM5', 'LGA1700'], heightMm: 157, maxTdp: 210 }),
  k({ id: 'cool2-deepcool-ag400', brand: 'DeepCool', model: 'AG400', price: 25, releaseYear: 2022, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 150, maxTdp: 180 }),
  k({ id: 'cool2-deepcool-ag620', brand: 'DeepCool', model: 'AG620', price: 50, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 157, maxTdp: 240 }),
  k({ id: 'cool2-deepcool-ak620-digital', brand: 'DeepCool', model: 'AK620 Digital', price: 80, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 162, maxTdp: 260 }),
  k({ id: 'cool2-id-cooling-se-214-xt', brand: 'ID-Cooling', model: 'SE-214-XT', price: 20, releaseYear: 2021, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 150, maxTdp: 180 }),
  k({ id: 'cool2-id-cooling-frozn-a620-pro-se', brand: 'ID-Cooling', model: 'FROZN A620 PRO SE', price: 45, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 157, maxTdp: 260 }),
  k({ id: 'cool2-id-cooling-is-55', brand: 'ID-Cooling', model: 'IS-55', price: 35, releaseYear: 2021, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 57, maxTdp: 125 }),

  // ───────── Scythe / Cooler Master / Endorfy / Alpenföhn ─────────
  k({ id: 'cool2-scythe-mugen-6', brand: 'Scythe', model: 'Mugen 6', price: 55, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 155, maxTdp: 230 }),
  k({ id: 'cool2-scythe-fuma-3', brand: 'Scythe', model: 'Fuma 3', price: 60, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 154, maxTdp: 230 }),
  k({ id: 'cool2-scythe-kotetsu-mark-iii', brand: 'Scythe', model: 'Kotetsu Mark III', price: 40, releaseYear: 2021, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 154, maxTdp: 190 }),
  k({ id: 'cool2-scythe-big-shuriken-3', brand: 'Scythe', model: 'Big Shuriken 3', price: 45, releaseYear: 2018, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 69, maxTdp: 120 }),
  k({ id: 'cool2-coolermaster-hyper-212-black', brand: 'Cooler Master', model: 'Hyper 212 Black Edition', price: 40, releaseYear: 2021, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 159, maxTdp: 180 }),
  k({ id: 'cool2-coolermaster-hyper-622-halo', brand: 'Cooler Master', model: 'Hyper 622 Halo', price: 70, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 157, maxTdp: 250 }),
  k({ id: 'cool2-endorfy-fortis-5', brand: 'Endorfy', model: 'Fortis 5', price: 45, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 159, maxTdp: 220 }),
  k({ id: 'cool2-endorfy-spartan-5', brand: 'Endorfy', model: 'Spartan 5', price: 20, releaseYear: 2022, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 142, maxTdp: 150 }),
  k({ id: 'cool2-alpenfohn-brocken-4', brand: 'Alpenföhn', model: 'Brocken 4', price: 55, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 165, maxTdp: 240 }),
  k({ id: 'cool2-alpenfohn-ben-nevis-advanced', brand: 'Alpenföhn', model: 'Ben Nevis Advanced', price: 30, releaseYear: 2018, tier: 'entry', segment: 'consumer', type: 'air', sockets: CONSUMER, heightMm: 155, maxTdp: 160 }),

  // ───────── AIO ─────────
  k({ id: 'cool2-arctic-liquid-freezer-iii-360', brand: 'Arctic', model: 'Liquid Freezer III 360', price: 100, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 330 }),
  k({ id: 'cool2-arctic-liquid-freezer-iii-420', brand: 'Arctic', model: 'Liquid Freezer III 420', price: 120, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 420, maxTdp: 360 }),
  k({ id: 'cool2-nzxt-kraken-120-2024', brand: 'NZXT', model: 'Kraken 120 (2024)', price: 110, releaseYear: 2024, tier: 'entry', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 120, maxTdp: 200 }),
  k({ id: 'cool2-nzxt-kraken-280-2024', brand: 'NZXT', model: 'Kraken 280 (2024)', price: 180, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 280, maxTdp: 300 }),
  k({ id: 'cool2-nzxt-kraken-elite-280-2024', brand: 'NZXT', model: 'Kraken Elite 280 (2024)', price: 250, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 280, maxTdp: 310 }),
  k({ id: 'cool2-corsair-icue-link-h170i-lcd', brand: 'Corsair', model: 'iCUE LINK H170i LCD', price: 330, releaseYear: 2023, tier: 'flagship', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 420, maxTdp: 360 }),
  k({ id: 'cool2-corsair-icue-link-titan-360-rx', brand: 'Corsair', model: 'iCUE LINK TITAN 360 RX RGB', price: 190, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 340 }),
  k({ id: 'cool2-corsair-h150i-elite-capellix-xt', brand: 'Corsair', model: 'iCUE H150i Elite Capellix XT', price: 170, releaseYear: 2022, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 320 }),
  k({ id: 'cool2-corsair-nautilus-240-rs', brand: 'Corsair', model: 'Nautilus 240 RS', price: 85, releaseYear: 2025, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 260 }),
  k({ id: 'cool2-lianli-galahad-ii-trinity-240', brand: 'Lian Li', model: 'Galahad II Trinity 240', price: 120, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 270 }),
  k({ id: 'cool2-lianli-galahad-ii-lcd-360', brand: 'Lian Li', model: 'Galahad II LCD 360', price: 230, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 340 }),
  k({ id: 'cool2-lianli-hydroshift-lcd-360s', brand: 'Lian Li', model: 'HydroShift LCD 360S', price: 200, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 330 }),
  k({ id: 'cool2-deepcool-ls520', brand: 'DeepCool', model: 'LS520', price: 100, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 260 }),
  k({ id: 'cool2-deepcool-ls720', brand: 'DeepCool', model: 'LS720', price: 125, releaseYear: 2022, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 320 }),
  k({ id: 'cool2-deepcool-lt720', brand: 'DeepCool', model: 'LT720', price: 150, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 330 }),
  k({ id: 'cool2-deepcool-mystique-360', brand: 'DeepCool', model: 'Mystique 360', price: 190, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 340 }),
  k({ id: 'cool2-bequiet-pure-loop-2-240', brand: 'be quiet!', model: 'Pure Loop 2 240', price: 90, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 250 }),
  k({ id: 'cool2-bequiet-pure-loop-2-360', brand: 'be quiet!', model: 'Pure Loop 2 360', price: 115, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 300 }),
  k({ id: 'cool2-bequiet-silent-loop-3-280', brand: 'be quiet!', model: 'Silent Loop 3 280', price: 140, releaseYear: 2024, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 280, maxTdp: 310 }),
  k({ id: 'cool2-bequiet-silent-loop-3-420', brand: 'be quiet!', model: 'Silent Loop 3 420', price: 170, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 420, maxTdp: 350 }),
  k({ id: 'cool2-bequiet-light-loop-360', brand: 'be quiet!', model: 'Light Loop 360', price: 150, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 320 }),
  k({ id: 'cool2-msi-mag-coreliquid-e240', brand: 'MSI', model: 'MAG CoreLiquid E240', price: 95, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 250 }),
  k({ id: 'cool2-msi-mag-coreliquid-e360', brand: 'MSI', model: 'MAG CoreLiquid E360', price: 120, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 310 }),
  k({ id: 'cool2-asus-rog-ryujin-iii-360-argb', brand: 'ASUS', model: 'ROG Ryujin III 360 ARGB', price: 330, releaseYear: 2023, tier: 'flagship', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 350 }),
  k({ id: 'cool2-asus-rog-strix-lc-iii-360-argb', brand: 'ASUS', model: 'ROG Strix LC III 360 ARGB', price: 200, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 330 }),
  k({ id: 'cool2-asus-tuf-gaming-lc-ii-240-argb', brand: 'ASUS', model: 'TUF Gaming LC II 240 ARGB', price: 110, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 260 }),
  k({ id: 'cool2-asus-tuf-gaming-lc-ii-360-argb', brand: 'ASUS', model: 'TUF Gaming LC II 360 ARGB', price: 140, releaseYear: 2023, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 310 }),
  k({ id: 'cool2-ek-nucleus-cr240-lux', brand: 'EK', model: 'EK-Nucleus AIO CR240 Lux D-RGB', price: 120, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 270 }),
  k({ id: 'cool2-ek-nucleus-cr360-lux', brand: 'EK', model: 'EK-Nucleus AIO CR360 Lux D-RGB', price: 150, releaseYear: 2022, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 320 }),
  k({ id: 'cool2-thermalright-frozen-notte-240-argb', brand: 'Thermalright', model: 'Frozen Notte 240 ARGB', price: 55, releaseYear: 2024, tier: 'entry', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 250 }),
  k({ id: 'cool2-thermalright-frozen-warframe-360', brand: 'Thermalright', model: 'Frozen Warframe 360', price: 95, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 310 }),
  k({ id: 'cool2-coolermaster-masterliquid-240l-core-argb', brand: 'Cooler Master', model: 'MasterLiquid 240L Core ARGB', price: 65, releaseYear: 2022, tier: 'entry', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 240, maxTdp: 240 }),
  k({ id: 'cool2-coolermaster-masterliquid-360l-core-argb', brand: 'Cooler Master', model: 'MasterLiquid 360L Core ARGB', price: 85, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 290 }),
  k({ id: 'cool2-coolermaster-masterliquid-360-atmos', brand: 'Cooler Master', model: 'MasterLiquid 360 Atmos', price: 150, releaseYear: 2022, tier: 'performance', segment: 'consumer', type: 'aio', sockets: CONSUMER, radiatorMm: 360, maxTdp: 320 }),

  // ───────── Serveur / station de travail ─────────
  k({ id: 'cool2-noctua-nh-d9-tr5-sp6-4u', brand: 'Noctua', model: 'NH-D9 TR5-SP6 4U', price: 120, releaseYear: 2023, tier: 'performance', segment: 'workstation', type: 'air', sockets: ['sTR5', 'SP6'], heightMm: 134, maxTdp: 300 }),
  k({ id: 'cool2-noctua-nh-u12s-dx-4677', brand: 'Noctua', model: 'NH-U12S DX-4677', price: 110, releaseYear: 2023, tier: 'performance', segment: 'workstation', type: 'air', sockets: ['LGA4677'], heightMm: 158, maxTdp: 280 }),
  k({ id: 'cool2-noctua-nh-u9-dx-4677', brand: 'Noctua', model: 'NH-U9 DX-4677', price: 100, releaseYear: 2023, tier: 'performance', segment: 'server', type: 'air', sockets: ['LGA4677'], heightMm: 125, maxTdp: 260 }),
  k({ id: 'cool2-arctic-freezer-4u-m', brand: 'Arctic', model: 'Freezer 4U-M', price: 55, releaseYear: 2022, tier: 'mainstream', segment: 'server', type: 'air', sockets: ['AM4', 'AM5', 'sTR5', 'SP5', 'SP6', 'LGA4677'], heightMm: 145, maxTdp: 300 }),
]
