import type { Accessory, AccessoryKind, Tier } from '../../types'

// Périphériques et accessoires (prix indicatifs EUR TTC, France, 2026).

const acc = (
  id: string,
  kind: AccessoryKind,
  brand: string,
  model: string,
  price: number,
  releaseYear: number,
  tier: Tier,
  specs: string[],
): Accessory => ({ id, category: 'accessory', kind, brand, model, price, releaseYear, tier, specs })

/** Moniteur : taille, définition "L×H", fréquence, dalle, temps de réponse, extras. */
const mon = (
  id: string,
  brand: string,
  model: string,
  price: number,
  releaseYear: number,
  tier: Tier,
  size: string,
  res: string,
  hz: number,
  panel: string,
  response: string,
  extra: string[] = [],
): Accessory => ({
  ...acc(id, 'monitor', brand, model, price, releaseYear, tier, [`${size}"`, res, `${hz} Hz`, panel, response, ...extra]),
  refreshHz: hz,
  resolutionY: Number(res.split('×')[1]),
})

const FHD = '1920×1080'
const QHD = '2560×1440'
const UHD = '3840×2160'
const UWQHD = '3440×1440'

export const accessories: Accessory[] = [
  // ——— Moniteurs ———
  mon('acc-iiyama-xub2493hs-b5', 'iiyama', 'ProLite XUB2493HS-B5', 125, 2021, 'entry', '24', FHD, 75, 'IPS', '4 ms', ['Pied réglable en hauteur']),
  mon('acc-dell-p2425h', 'Dell', 'P2425H', 190, 2024, 'entry', '24', FHD, 100, 'IPS', '5 ms', ['USB-C', 'Pied réglable']),
  mon('acc-lg-24gn60r-b', 'LG', 'UltraGear 24GN60R-B', 130, 2021, 'entry', '24', FHD, 144, 'IPS', '1 ms', ['FreeSync Premium']),
  mon('acc-aoc-24g2spu', 'AOC', '24G2SPU', 150, 2021, 'entry', '24', FHD, 165, 'IPS', '1 ms', ['FreeSync Premium', 'Pied réglable']),
  mon('acc-asus-vg249q3a', 'ASUS', 'TUF Gaming VG249Q3A', 130, 2023, 'entry', '24', FHD, 180, 'Fast IPS', '1 ms', ['FreeSync Premium']),
  mon('acc-iiyama-g2470hsu-b1', 'iiyama', 'G-Master G2470HSU-B1 Red Eagle', 140, 2021, 'entry', '24', FHD, 165, 'IPS', '0,8 ms MPRT', ['FreeSync Premium']),
  mon('acc-msi-g255f', 'MSI', 'G255F', 120, 2023, 'entry', '24,5', FHD, 180, 'Rapid IPS', '1 ms', ['Adaptive-Sync']),
  mon('acc-benq-xl2566k', 'BenQ', 'ZOWIE XL2566K', 550, 2022, 'enthusiast', '24,5', FHD, 360, 'TN', '0,5 ms', ['DyAc+', 'Esport']),
  mon('acc-gigabyte-g27f-2', 'Gigabyte', 'G27F 2', 160, 2022, 'entry', '27', FHD, 165, 'IPS', '1 ms', ['FreeSync Premium']),
  mon('acc-dell-s2725ds', 'Dell', 'S2725DS', 230, 2024, 'mainstream', '27', QHD, 100, 'IPS', '4 ms', ['Haut-parleurs intégrés', 'Pied réglable']),
  mon('acc-asus-vg27aq', 'ASUS', 'TUF Gaming VG27AQ', 250, 2019, 'mainstream', '27', QHD, 165, 'IPS', '1 ms MPRT', ['G-Sync Compatible', 'ELMB-Sync']),
  mon('acc-asus-xg27acs', 'ASUS', 'ROG Strix XG27ACS', 300, 2023, 'mainstream', '27', QHD, 180, 'Fast IPS', '1 ms', ['USB-C 7 W', 'G-Sync Compatible']),
  mon('acc-samsung-odyssey-g5-g55c', 'Samsung', 'Odyssey G5 G55C (LS27CG552)', 230, 2023, 'mainstream', '27', QHD, 165, 'VA incurvé 1000R', '1 ms', ['FreeSync', 'HDR10']),
  mon('acc-gigabyte-m27q', 'Gigabyte', 'M27Q', 260, 2020, 'mainstream', '27', QHD, 170, 'IPS', '0,5 ms MPRT', ['KVM', 'USB-C']),
  mon('acc-iiyama-gb2770qsu-b5', 'iiyama', 'G-Master GB2770QSU-B5 Red Eagle', 250, 2022, 'mainstream', '27', QHD, 165, 'IPS', '0,5 ms MPRT', ['FreeSync Premium Pro', 'Pied réglable']),
  mon('acc-dell-s2721dgf', 'Dell', 'S2721DGF', 300, 2020, 'mainstream', '27', QHD, 165, 'Fast IPS', '1 ms', ['G-Sync Compatible', 'HDR400']),
  mon('acc-lg-27gp850-b', 'LG', 'UltraGear 27GP850-B', 330, 2021, 'performance', '27', QHD, 165, 'Nano IPS', '1 ms', ['180 Hz OC', 'HDR400']),
  mon('acc-msi-mag-274qrf-qd-e2', 'MSI', 'MAG 274QRF-QD E2', 280, 2024, 'mainstream', '27', QHD, 180, 'Rapid IPS Quantum Dot', '1 ms', ['USB-C', 'KVM']),
  mon('acc-aoc-q27g3xmn', 'AOC', 'Q27G3XMN', 280, 2023, 'mainstream', '27', QHD, 180, 'VA Mini-LED', '1 ms', ['HDR1000', '336 zones']),
  mon('acc-benq-ex2710q', 'BenQ', 'MOBIUZ EX2710Q', 350, 2021, 'performance', '27', QHD, 165, 'IPS', '1 ms MPRT', ['HDRi', 'Haut-parleurs treVolo']),
  mon('acc-dell-u2724d', 'Dell', 'UltraSharp U2724D', 400, 2023, 'performance', '27', QHD, 120, 'IPS Black', '5 ms', ['Hub USB', 'Calibré usine']),
  mon('acc-asus-pa278qv', 'ASUS', 'ProArt PA278QV', 300, 2020, 'mainstream', '27', QHD, 75, 'IPS', '5 ms', ['100 % sRGB', 'Calman Verified']),
  mon('acc-lg-27gr95qe-b', 'LG', 'UltraGear 27GR95QE-B', 600, 2023, 'enthusiast', '27', QHD, 240, 'OLED (WOLED)', '0,03 ms', ['HDR400 True Black']),
  mon('acc-lg-27gs95qe-b', 'LG', 'UltraGear 27GS95QE-B', 700, 2024, 'enthusiast', '27', QHD, 240, 'OLED (WOLED)', '0,03 ms', ['HDR400 True Black', 'Traitement anti-reflet']),
  mon('acc-asus-pg27aqdm', 'ASUS', 'ROG Swift OLED PG27AQDM', 700, 2023, 'enthusiast', '27', QHD, 240, 'OLED (WOLED)', '0,03 ms', ['Dissipateur passif', 'HDR400 True Black']),
  mon('acc-dell-aw2725df', 'Alienware', 'AW2725DF', 650, 2024, 'enthusiast', '27', QHD, 360, 'QD-OLED', '0,03 ms', ['FreeSync Premium Pro', 'HDR400 True Black']),
  mon('acc-msi-mag-271qpx-qd-oled', 'MSI', 'MAG 271QPX QD-OLED', 650, 2024, 'enthusiast', '27', QHD, 360, 'QD-OLED', '0,03 ms', ['HDR400 True Black', 'USB-C 90 W']),
  mon('acc-samsung-odyssey-oled-g6-g60sd', 'Samsung', 'Odyssey OLED G6 G60SD', 650, 2024, 'enthusiast', '27', QHD, 360, 'QD-OLED', '0,03 ms', ['Glare-free', 'HDR400 True Black']),
  mon('acc-gigabyte-fo27q3', 'Gigabyte', 'AORUS FO27Q3', 600, 2024, 'enthusiast', '27', QHD, 360, 'QD-OLED', '0,03 ms', ['KVM', 'HDR400 True Black']),
  mon('acc-philips-evnia-27m2n8500', 'Philips', 'Evnia 27M2N8500', 600, 2024, 'enthusiast', '27', QHD, 360, 'QD-OLED', '0,03 ms', ['Ambiglow', 'HDR400 True Black']),
  mon('acc-asus-pg27aqdp', 'ASUS', 'ROG Swift OLED PG27AQDP', 950, 2025, 'flagship', '27', QHD, 480, 'OLED (WOLED)', '0,03 ms', ['HDR400 True Black', 'Esport']),
  mon('acc-benq-pd2706u', 'BenQ', 'PD2706U', 500, 2023, 'performance', '27', UHD, 60, 'IPS', '5 ms', ['USB-C 90 W', 'KVM', '95 % P3']),
  mon('acc-lg-27up850n-w', 'LG', '27UP850N-W', 400, 2021, 'performance', '27', UHD, 60, 'IPS', '5 ms', ['USB-C 96 W', 'HDR400']),
  mon('acc-apple-studio-display', 'Apple', 'Studio Display (verre standard, pied inclinable)', 1749, 2022, 'flagship', '27', '5120×2880', 60, 'IPS 5K', '—', ['600 cd/m²', 'Webcam 12 Mpx', 'Thunderbolt 3']),
  mon('acc-samsung-smart-m7-m70d', 'Samsung', 'Smart Monitor M7 M70D 32"', 380, 2024, 'mainstream', '32', UHD, 60, 'VA', '4 ms', ['Tizen (Smart TV)', 'USB-C 65 W']),
  mon('acc-samsung-odyssey-g7-g70d', 'Samsung', 'Odyssey G7 G70D 32"', 550, 2024, 'performance', '32', UHD, 144, 'IPS', '1 ms', ['HDR400', 'Tizen (Smart TV)']),
  mon('acc-dell-u3225qe', 'Dell', 'UltraSharp U3225QE', 900, 2025, 'enthusiast', '31,5', UHD, 120, 'IPS Black', '5 ms', ['Thunderbolt 4 140 W', 'RJ45']),
  mon('acc-samsung-odyssey-oled-g8-g80sd', 'Samsung', 'Odyssey OLED G8 G80SD', 1000, 2024, 'flagship', '32', UHD, 240, 'QD-OLED', '0,03 ms', ['Glare-free', 'HDR400 True Black']),
  mon('acc-msi-mpg-321urx', 'MSI', 'MPG 321URX QD-OLED', 1000, 2024, 'flagship', '32', UHD, 240, 'QD-OLED', '0,03 ms', ['USB-C 90 W', 'KVM']),
  mon('acc-dell-aw3225qf', 'Alienware', 'AW3225QF', 1100, 2024, 'flagship', '32', UHD, 240, 'QD-OLED incurvé 1700R', '0,03 ms', ['Dolby Vision', 'HDR400 True Black']),
  mon('acc-asus-pg32ucdm', 'ASUS', 'ROG Swift OLED PG32UCDM', 1200, 2024, 'flagship', '32', UHD, 240, 'QD-OLED', '0,03 ms', ['USB-C 90 W', 'HDR400 True Black']),
  mon('acc-lg-32gs95ue-b', 'LG', 'UltraGear 32GS95UE-B', 1200, 2024, 'flagship', '32', UHD, 240, 'OLED (WOLED)', '0,03 ms', ['Dual-Mode 1080p 480 Hz', 'Haut-parleurs Pixel Sound']),
  mon('acc-lg-34gp83a-b', 'LG', 'UltraGear 34GP83A-B', 450, 2021, 'performance', '34', UWQHD, 144, 'Nano IPS incurvé 1900R', '1 ms', ['160 Hz OC', 'HDR400']),
  mon('acc-msi-mag-341cqp', 'MSI', 'MAG 341CQP QD-OLED', 750, 2024, 'enthusiast', '34', UWQHD, 175, 'QD-OLED incurvé 1800R', '0,03 ms', ['USB-C 98 W', 'KVM']),
  mon('acc-dell-aw3423dwf', 'Alienware', 'AW3423DWF', 800, 2022, 'enthusiast', '34', UWQHD, 165, 'QD-OLED incurvé 1800R', '0,1 ms', ['FreeSync Premium Pro', 'HDR400 True Black']),
  mon('acc-philips-evnia-34m2c8600', 'Philips', 'Evnia 34M2C8600', 800, 2023, 'enthusiast', '34', UWQHD, 175, 'QD-OLED incurvé 1800R', '0,03 ms', ['Ambiglow', 'USB-C 90 W']),
  mon('acc-lg-45gr95qe-b', 'LG', 'UltraGear 45GR95QE-B', 1200, 2023, 'flagship', '45', UWQHD, 240, 'OLED incurvé 800R', '0,03 ms', ['HDR10']),
  mon('acc-samsung-odyssey-oled-g9-g95sc', 'Samsung', 'Odyssey OLED G9 G95SC', 1100, 2023, 'flagship', '49', '5120×1440', 240, 'QD-OLED incurvé 1800R', '0,03 ms', ['32:9', 'HDR400 True Black']),
  mon('acc-samsung-odyssey-neo-g9-g95nc', 'Samsung', 'Odyssey Neo G9 G95NC 57"', 2000, 2023, 'flagship', '57', '7680×2160', 240, 'VA Mini-LED incurvé 1000R', '1 ms', ['32:9', 'HDR1000', 'DisplayPort 2.1']),

  // ——— Claviers ———
  acc('acc-logitech-mk270', 'keyboard', 'Logitech', 'MK270 (pack clavier + souris sans fil)', 30, 2011, 'entry', ['AZERTY', 'Sans fil 2,4 GHz', 'Membrane']),
  acc('acc-logitech-g213', 'keyboard', 'Logitech', 'G213 Prodigy', 50, 2017, 'entry', ['AZERTY', 'Mech-Dome', 'RGB', 'Filaire']),
  acc('acc-razer-ornata-v3', 'keyboard', 'Razer', 'Ornata V3', 70, 2021, 'entry', ['AZERTY', 'Méca-membrane', 'RGB Chroma']),
  acc('acc-hyperx-alloy-origins-core', 'keyboard', 'HyperX', 'Alloy Origins Core', 80, 2020, 'mainstream', ['TKL', 'Switchs HyperX Red', 'RGB', 'Châssis alu']),
  acc('acc-logitech-mx-keys-s', 'keyboard', 'Logitech', 'MX Keys S', 110, 2023, 'mainstream', ['AZERTY', 'Bluetooth / Logi Bolt', 'Rétroéclairé', 'Multi-appareils']),
  acc('acc-keychron-k2-pro', 'keyboard', 'Keychron', 'K2 Pro', 110, 2023, 'mainstream', ['75 %', 'Hot-swap', 'Bluetooth + USB-C', 'QMK/VIA']),
  acc('acc-corsair-k65-plus-wireless', 'keyboard', 'Corsair', 'K65 Plus Wireless', 140, 2023, 'performance', ['75 %', 'Switchs MLX Red pré-lubrifiés', 'Slipstream 2,4 GHz / BT']),
  acc('acc-corsair-k70-rgb-pro', 'keyboard', 'Corsair', 'K70 RGB Pro', 150, 2022, 'performance', ['Full-size', 'Cherry MX Red', '8000 Hz', 'Repose-poignet']),
  acc('acc-keychron-q1-pro', 'keyboard', 'Keychron', 'Q1 Pro', 200, 2023, 'performance', ['75 %', 'Châssis alu CNC', 'Gasket mount', 'Sans fil']),
  acc('acc-logitech-g915-tkl', 'keyboard', 'Logitech', 'G915 TKL Lightspeed', 180, 2020, 'performance', ['TKL', 'Switchs GL low-profile', 'Lightspeed / BT', 'RGB']),
  acc('acc-wooting-60he-plus', 'keyboard', 'Wooting', '60HE+', 190, 2023, 'enthusiast', ['60 %', 'Switchs magnétiques Lekker', 'Rapid Trigger', '8000 Hz']),
  acc('acc-logitech-g-pro-x-tkl', 'keyboard', 'Logitech', 'G PRO X TKL Lightspeed', 200, 2023, 'enthusiast', ['TKL', 'Switchs GX', 'Lightspeed / BT', 'RGB']),
  acc('acc-steelseries-apex-pro-tkl-2023', 'keyboard', 'SteelSeries', 'Apex Pro TKL (2023)', 220, 2023, 'enthusiast', ['TKL', 'OmniPoint 2.0 réglables', 'Rapid Trigger', 'Écran OLED']),
  acc('acc-razer-huntsman-v3-pro-tkl', 'keyboard', 'Razer', 'Huntsman V3 Pro TKL', 220, 2023, 'enthusiast', ['TKL', 'Switchs optiques analogiques', 'Rapid Trigger']),
  acc('acc-razer-blackwidow-v4-pro', 'keyboard', 'Razer', 'BlackWidow V4 Pro', 230, 2023, 'enthusiast', ['Full-size', 'Razer Green', 'Molette de commande', 'Repose-poignet']),
  acc('acc-asus-rog-azoth', 'keyboard', 'ASUS', 'ROG Azoth', 250, 2022, 'flagship', ['75 %', 'Gasket mount', 'Écran OLED', 'Tri-mode sans fil']),

  // ——— Souris ———
  acc('acc-razer-deathadder-essential', 'mouse', 'Razer', 'DeathAdder Essential', 25, 2017, 'entry', ['6400 DPI', 'Filaire', 'Ergonomique droitier']),
  acc('acc-steelseries-rival-3', 'mouse', 'SteelSeries', 'Rival 3', 30, 2020, 'entry', ['8500 CPI', 'TrueMove Core', '77 g', 'Filaire']),
  acc('acc-logitech-g305', 'mouse', 'Logitech', 'G305 Lightspeed', 40, 2018, 'entry', ['HERO 12K', 'Sans fil Lightspeed', '99 g', 'Pile AA']),
  acc('acc-logitech-g502-hero', 'mouse', 'Logitech', 'G502 HERO', 50, 2018, 'mainstream', ['HERO 25K', '11 boutons', 'Poids ajustables', 'Filaire']),
  acc('acc-razer-basilisk-v3', 'mouse', 'Razer', 'Basilisk V3', 60, 2021, 'mainstream', ['Focus+ 26K', '11 boutons', 'Molette HyperScroll', 'Filaire']),
  acc('acc-corsair-m65-rgb-ultra', 'mouse', 'Corsair', 'M65 RGB Ultra', 70, 2022, 'mainstream', ['Marksman 26K', 'Poids ajustables', 'Filaire']),
  acc('acc-endgame-gear-op1-8k', 'mouse', 'Endgame Gear', 'OP1 8k', 70, 2023, 'mainstream', ['PixArt PAW3395', '8000 Hz', '59 g', 'Filaire']),
  acc('acc-steelseries-aerox-3-wireless-2022', 'mouse', 'SteelSeries', 'Aerox 3 Wireless (2022)', 80, 2022, 'mainstream', ['TrueMove Air 18K', '68 g', '2,4 GHz / BT', 'IP54']),
  acc('acc-logitech-mx-anywhere-3s', 'mouse', 'Logitech', 'MX Anywhere 3S', 80, 2023, 'mainstream', ['8000 DPI', 'Clics silencieux', 'Bluetooth / Bolt', 'Nomade']),
  acc('acc-glorious-model-o-2-wireless', 'mouse', 'Glorious', 'Model O 2 Wireless', 100, 2023, 'performance', ['BAMF 2.0 26K', '68 g', '2,4 GHz / BT']),
  acc('acc-logitech-mx-master-3s', 'mouse', 'Logitech', 'MX Master 3S', 100, 2022, 'performance', ['8000 DPI', 'Molette MagSpeed', 'Clics silencieux', 'Bluetooth / Bolt']),
  acc('acc-zowie-ec2-cw', 'mouse', 'BenQ ZOWIE', 'EC2-CW', 150, 2023, 'enthusiast', ['Sans fil 2,4 GHz', 'Sans logiciel', 'Ergonomique droitier', '77 g']),
  acc('acc-logitech-g502-x-plus', 'mouse', 'Logitech', 'G502 X Plus', 150, 2022, 'enthusiast', ['HERO 25K', 'Switchs Lightforce', 'Lightspeed', 'RGB']),
  acc('acc-razer-deathadder-v3-pro', 'mouse', 'Razer', 'DeathAdder V3 Pro', 150, 2022, 'enthusiast', ['Focus Pro 30K', '63 g', 'HyperSpeed sans fil']),
  acc('acc-logitech-g-pro-x-superlight-2', 'mouse', 'Logitech', 'G PRO X Superlight 2', 150, 2023, 'enthusiast', ['HERO 2 32K', '60 g', 'Lightspeed', 'Switchs Lightforce']),
  acc('acc-razer-viper-v3-pro', 'mouse', 'Razer', 'Viper V3 Pro', 170, 2024, 'flagship', ['Focus Pro 35K Gen-2', '54 g', '8000 Hz sans fil']),

  // ——— Casques ———
  acc('acc-razer-blackshark-v2-x', 'headphones', 'Razer', 'BlackShark V2 X', 45, 2020, 'entry', ['Filaire jack 3,5 mm', 'Son 7.1 (PC)', 'Micro cardioïde']),
  acc('acc-hyperx-cloud-iii', 'headphones', 'HyperX', 'Cloud III', 90, 2023, 'mainstream', ['Filaire USB / jack', 'DTS Headphone:X', 'Transducteurs 53 mm']),
  acc('acc-corsair-hs80-rgb-wireless', 'headphones', 'Corsair', 'HS80 RGB Wireless', 130, 2021, 'mainstream', ['Slipstream 2,4 GHz', 'Dolby Atmos', 'Micro omnidirectionnel']),
  acc('acc-beyerdynamic-dt-770-pro-80', 'headphones', 'beyerdynamic', 'DT 770 PRO 80 Ω', 140, 1985, 'mainstream', ['Studio fermé', 'Jack 3,5 / 6,35 mm', 'Sans micro']),
  acc('acc-sennheiser-hd-560s', 'headphones', 'Sennheiser', 'HD 560S', 150, 2020, 'performance', ['Hi-Fi ouvert', '120 Ω', 'Sans micro']),
  acc('acc-hyperx-cloud-alpha-wireless', 'headphones', 'HyperX', 'Cloud Alpha Wireless', 170, 2022, 'performance', ['2,4 GHz', 'Autonomie 300 h', 'DTS Headphone:X']),
  acc('acc-steelseries-arctis-nova-7', 'headphones', 'SteelSeries', 'Arctis Nova 7', 180, 2022, 'performance', ['2,4 GHz + Bluetooth', 'Autonomie 38 h', 'Micro ClearCast Gen 2']),
  acc('acc-razer-blackshark-v2-pro-2023', 'headphones', 'Razer', 'BlackShark V2 Pro (2023)', 180, 2023, 'performance', ['HyperSpeed 2,4 GHz + BT', 'Autonomie 70 h', 'Micro HyperClear']),
  acc('acc-corsair-virtuoso-rgb-wireless-xt', 'headphones', 'Corsair', 'Virtuoso RGB Wireless XT', 230, 2021, 'enthusiast', ['Slipstream + Bluetooth', 'Hi-Res', 'Dolby Atmos']),
  acc('acc-logitech-g-pro-x-2-lightspeed', 'headphones', 'Logitech', 'G PRO X 2 Lightspeed', 230, 2023, 'enthusiast', ['Transducteurs graphène 50 mm', 'Lightspeed + BT', 'Autonomie 50 h']),
  acc('acc-sony-inzone-h9', 'headphones', 'Sony', 'INZONE H9', 250, 2022, 'enthusiast', ['Réduction de bruit active', '2,4 GHz + Bluetooth', 'Son spatial 360']),
  acc('acc-audeze-maxwell', 'headphones', 'Audeze', 'Maxwell', 330, 2023, 'flagship', ['Planar magnétique 90 mm', '2,4 GHz + BT LE Audio', 'Autonomie 80 h']),
  acc('acc-steelseries-arctis-nova-pro-wireless', 'headphones', 'SteelSeries', 'Arctis Nova Pro Wireless', 350, 2022, 'flagship', ['ANC', 'Double batterie', 'Base DAC GameDAC']),

  // ——— Enceintes ———
  acc('acc-creative-pebble-v3', 'speakers', 'Creative', 'Pebble V3', 35, 2021, 'entry', ['2.0', '16 W crête', 'USB-C / Bluetooth']),
  acc('acc-logitech-z407', 'speakers', 'Logitech', 'Z407', 80, 2020, 'entry', ['2.1', '80 W crête', 'Bluetooth / USB', 'Molette sans fil']),
  acc('acc-edifier-mr4', 'speakers', 'Edifier', 'MR4', 130, 2022, 'mainstream', ['Moniteurs de studio 2.0', '42 W RMS', 'TRS / RCA']),
  acc('acc-edifier-r1280db', 'speakers', 'Edifier', 'R1280DB', 130, 2017, 'mainstream', ['2.0 bibliothèque', '42 W RMS', 'Bluetooth / optique / coaxial']),
  acc('acc-logitech-z623', 'speakers', 'Logitech', 'Z623', 130, 2010, 'mainstream', ['2.1 THX', '200 W RMS', 'RCA / jack']),
  acc('acc-razer-nommo-v2-x', 'speakers', 'Razer', 'Nommo V2 X', 130, 2023, 'mainstream', ['2.0', 'THX Spatial Audio', 'USB / Bluetooth']),

  // ——— Webcams ———
  acc('acc-logitech-c920', 'webcam', 'Logitech', 'C920 HD Pro', 60, 2012, 'entry', ['1080p 30 i/s', 'Micro stéréo', 'Autofocus']),
  acc('acc-logitech-brio-500', 'webcam', 'Logitech', 'Brio 500', 120, 2022, 'mainstream', ['1080p 30 i/s', 'Correction lumière RightLight 4', 'Cache intégré', 'USB-C']),
  acc('acc-razer-kiyo-pro', 'webcam', 'Razer', 'Kiyo Pro', 150, 2021, 'performance', ['1080p 60 i/s', 'Capteur STARVIS', 'HDR']),
  acc('acc-elgato-facecam-mk2', 'webcam', 'Elgato', 'Facecam MK.2', 160, 2023, 'performance', ['1080p 60 i/s', 'HDR', 'Pan/Tilt/Zoom numérique']),
  acc('acc-logitech-brio-4k', 'webcam', 'Logitech', 'Brio 4K Pro Ultra HD', 180, 2017, 'enthusiast', ['4K 30 i/s / 1080p 60 i/s', 'HDR', 'Windows Hello (IR)']),

  // ——— Onduleurs ———
  acc('acc-eaton-ellipse-eco-650-fr', 'ups', 'Eaton', 'Ellipse ECO 650 FR', 90, 2012, 'entry', ['650 VA / 400 W', 'Off-line', 'Prises FR']),
  acc('acc-apc-bx950mi', 'ups', 'APC', 'Back-UPS BX950MI', 120, 2019, 'entry', ['950 VA / 520 W', 'Line-interactive', 'Prises IEC', 'AVR']),
  acc('acc-cyberpower-vp1000elcd-fr', 'ups', 'CyberPower', 'Value Pro VP1000ELCD-FR', 150, 2017, 'mainstream', ['1000 VA / 550 W', 'Line-interactive', 'Écran LCD', 'Prises FR']),
  acc('acc-eaton-5e-1100i-usb', 'ups', 'Eaton', '5E 1100i USB', 150, 2020, 'mainstream', ['1100 VA / 660 W', 'Line-interactive', 'Prises IEC']),
  acc('acc-apc-bx1600mi', 'ups', 'APC', 'Back-UPS BX1600MI', 200, 2019, 'mainstream', ['1600 VA / 900 W', 'Line-interactive', 'AVR', 'Prises IEC']),
  acc('acc-cyberpower-cp1500epfclcd', 'ups', 'CyberPower', 'CP1500EPFCLCD', 260, 2018, 'performance', ['1500 VA / 900 W', 'Sinusoïde pure', 'Compatible PFC actif']),
  acc('acc-apc-br1500g-fr', 'ups', 'APC', 'Back-UPS Pro BR1500G-FR', 330, 2014, 'performance', ['1500 VA / 865 W', 'Line-interactive', 'Écran LCD', 'Prises FR']),
  acc('acc-eaton-5sc-1000i', 'ups', 'Eaton', '5SC 1000i', 450, 2017, 'enthusiast', ['1000 VA / 700 W', 'Sinusoïde pure', 'Tour']),
  acc('acc-apc-smt1500ic', 'ups', 'APC', 'Smart-UPS SMT1500IC', 650, 2018, 'flagship', ['1500 VA / 1000 W', 'Sinusoïde pure', 'SmartConnect', 'Tour']),

  // ——— Ventilateurs boîtier ———
  acc('acc-arctic-p12-pwm-pst-value-pack', 'case-fan', 'Arctic', 'P12 PWM PST Value Pack (5×120 mm)', 30, 2020, 'entry', ['5 × 120 mm', '200-1800 tr/min', 'Pression statique', 'Chaînage PST']),
  acc('acc-arctic-p14-pwm-pst-value-pack', 'case-fan', 'Arctic', 'P14 PWM PST Value Pack (5×140 mm)', 38, 2020, 'entry', ['5 × 140 mm', '200-1700 tr/min', 'Chaînage PST']),
  acc('acc-noctua-nf-a12x25-pwm', 'case-fan', 'Noctua', 'NF-A12x25 PWM', 33, 2018, 'performance', ['1 × 120 mm', '450-2000 tr/min', '22,6 dB(A)', 'Garantie 6 ans']),
  acc('acc-be-quiet-light-wings-120-pwm-triple', 'case-fan', 'be quiet!', 'Light Wings 120 mm PWM (pack de 3)', 70, 2022, 'mainstream', ['3 × 120 mm', 'ARGB', 'Contrôleur inclus']),
  acc('acc-lian-li-uni-fan-sl-inf-120-triple', 'case-fan', 'Lian Li', 'UNI FAN SL-INF 120 (pack de 3)', 110, 2023, 'enthusiast', ['3 × 120 mm', 'ARGB infinity', 'Chaînage magnétique', 'Contrôleur L-Connect 3']),
  acc('acc-corsair-icue-link-qx120-rgb-starter', 'case-fan', 'Corsair', 'iCUE LINK QX120 RGB Starter Kit (3×120 mm)', 160, 2023, 'flagship', ['3 × 120 mm', 'Capteurs de température', 'Câble unique iCUE LINK', 'Hub inclus']),

  // ——— Pâte thermique ———
  acc('acc-arctic-mx-6-4g', 'thermal-paste', 'Arctic', 'MX-6 (4 g)', 9, 2022, 'entry', ['4 g', 'Non conductrice', 'Spatule incluse']),
  acc('acc-noctua-nt-h2-3-5g', 'thermal-paste', 'Noctua', 'NT-H2 (3,5 g)', 13, 2020, 'mainstream', ['3,5 g', 'Lingettes NA-CW1 incluses', 'Non conductrice']),
  acc('acc-thermal-grizzly-kryonaut-1g', 'thermal-paste', 'Thermal Grizzly', 'Kryonaut (1 g)', 10, 2016, 'performance', ['1 g', '12,5 W/m·K', 'Overclocking']),

  // ——— Systèmes d'exploitation ———
  acc('acc-microsoft-windows-11-famille-oem', 'os', 'Microsoft', 'Windows 11 Famille 64 bits OEM (DSP)', 115, 2021, 'mainstream', ['Licence OEM', 'Français', '1 PC']),
  acc('acc-microsoft-windows-11-pro-oem', 'os', 'Microsoft', 'Windows 11 Professionnel 64 bits OEM (DSP)', 155, 2021, 'performance', ['Licence OEM', 'BitLocker, Hyper-V, Bureau à distance', '1 PC']),
  acc('acc-microsoft-windows-11-pro-retail', 'os', 'Microsoft', 'Windows 11 Professionnel (boîte, clé USB)', 259, 2021, 'enthusiast', ['Licence Retail transférable', 'Clé USB', '1 PC']),
  acc('acc-microsoft-windows-server-2025-standard', 'os', 'Microsoft', 'Windows Server 2025 Standard (16 cœurs) OEM', 1100, 2024, 'flagship', ['Licence 16 cœurs', '2 VM incluses', 'CAL non incluses']),

  // ——— Cartes Wi-Fi ———
  acc('acc-gigabyte-gc-wbax210', 'wifi-card', 'Gigabyte', 'GC-WBAX210', 45, 2021, 'entry', ['Wi-Fi 6E (Intel AX210)', 'Bluetooth 5.2', 'PCIe x1']),
  acc('acc-tp-link-archer-txe75e', 'wifi-card', 'TP-Link', 'Archer TXE75E', 65, 2022, 'mainstream', ['Wi-Fi 6E AXE5400', 'Bluetooth 5.2', 'Antenne magnétique']),
  acc('acc-asus-pce-axe5400', 'wifi-card', 'ASUS', 'PCE-AXE5400', 85, 2022, 'mainstream', ['Wi-Fi 6E AXE5400', 'Bluetooth 5.2', 'Base d’antennes']),
  acc('acc-tp-link-archer-tbe550e', 'wifi-card', 'TP-Link', 'Archer TBE550E', 110, 2023, 'performance', ['Wi-Fi 7 BE9300', 'Bluetooth 5.4', 'Canaux 320 MHz']),
]
