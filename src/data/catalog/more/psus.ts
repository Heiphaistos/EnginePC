import type { PSU } from '../../../types'

const p = (x: Omit<PSU, 'category'>): PSU => ({ category: 'psu', ...x })

export const morePsus: PSU[] = [
  // --- Corsair ---
  p({ id: 'psu2-corsair-cx550-2023', brand: 'Corsair', model: 'CX550 (2023)', price: 60, releaseYear: 2023, tier: 'entry', segment: 'consumer', wattage: 550, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-corsair-cx650-2023', brand: 'Corsair', model: 'CX650 (2023)', price: 70, releaseYear: 2023, tier: 'entry', segment: 'consumer', wattage: 650, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-corsair-cx750-2023', brand: 'Corsair', model: 'CX750 (2023)', price: 80, releaseYear: 2023, tier: 'entry', segment: 'consumer', wattage: 750, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-corsair-rm650e-2025', brand: 'Corsair', model: 'RM650e (2025)', price: 85, releaseYear: 2025, tier: 'mainstream', segment: 'consumer', wattage: 650, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: true }),
  p({ id: 'psu2-corsair-rm850e-2025', brand: 'Corsair', model: 'RM850e (2025)', price: 115, releaseYear: 2025, tier: 'mainstream', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: true }),
  p({ id: 'psu2-corsair-rm1200x-shift', brand: 'Corsair', model: 'RM1200x SHIFT', price: 230, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', wattage: 1200, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-corsair-hx1200i-2025', brand: 'Corsair', model: 'HX1200i (2025)', price: 280, releaseYear: 2025, tier: 'enthusiast', segment: 'consumer', wattage: 1200, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: true }),
  p({ id: 'psu2-corsair-sf600-platinum', brand: 'Corsair', model: 'SF600 Platinum', price: 140, releaseYear: 2018, tier: 'performance', segment: 'consumer', wattage: 600, efficiency: '80+ Platinum', modular: 'full', formFactor: 'SFX', atx31: false }),

  // --- Seasonic ---
  p({ id: 'psu2-seasonic-g12-gc-650', brand: 'Seasonic', model: 'G12 GC-650', price: 75, releaseYear: 2023, tier: 'entry', segment: 'consumer', wattage: 650, efficiency: '80+ Gold', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-seasonic-g12-gm-750', brand: 'Seasonic', model: 'G12 GM-750', price: 95, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'semi', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-seasonic-focus-gx-650', brand: 'Seasonic', model: 'Focus GX-650', price: 95, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', wattage: 650, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-seasonic-focus-px-750', brand: 'Seasonic', model: 'Focus PX-750', price: 140, releaseYear: 2020, tier: 'performance', segment: 'consumer', wattage: 750, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-seasonic-focus-sgx-650', brand: 'Seasonic', model: 'Focus SGX-650', price: 140, releaseYear: 2019, tier: 'performance', segment: 'consumer', wattage: 650, efficiency: '80+ Gold', modular: 'full', formFactor: 'SFX-L', atx31: false }),
  p({ id: 'psu2-seasonic-vertex-gx-850', brand: 'Seasonic', model: 'Vertex GX-850', price: 150, releaseYear: 2023, tier: 'performance', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-seasonic-vertex-gx-1200', brand: 'Seasonic', model: 'Vertex GX-1200', price: 230, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', wattage: 1200, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-seasonic-vertex-px-1000', brand: 'Seasonic', model: 'Vertex PX-1000', price: 210, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', wattage: 1000, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-seasonic-prime-tx-1000', brand: 'Seasonic', model: 'Prime TX-1000', price: 300, releaseYear: 2020, tier: 'flagship', segment: 'workstation', wattage: 1000, efficiency: '80+ Titanium', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-seasonic-prime-px-1300-atx3', brand: 'Seasonic', model: 'Prime PX-1300 ATX 3', price: 330, releaseYear: 2024, tier: 'flagship', segment: 'workstation', wattage: 1300, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: true }),

  // --- be quiet! ---
  p({ id: 'psu2-bequiet-system-power-10-650w', brand: 'be quiet!', model: 'System Power 10 650W', price: 60, releaseYear: 2022, tier: 'entry', segment: 'consumer', wattage: 650, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-system-power-10-750w', brand: 'be quiet!', model: 'System Power 10 750W', price: 70, releaseYear: 2022, tier: 'entry', segment: 'consumer', wattage: 750, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-pure-power-12-m-650w', brand: 'be quiet!', model: 'Pure Power 12 M 650W', price: 95, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', wattage: 650, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-pure-power-12-m-1000w', brand: 'be quiet!', model: 'Pure Power 12 M 1000W', price: 160, releaseYear: 2022, tier: 'performance', segment: 'consumer', wattage: 1000, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-pure-power-13-m-750w', brand: 'be quiet!', model: 'Pure Power 13 M 750W', price: 110, releaseYear: 2025, tier: 'mainstream', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: true }),
  p({ id: 'psu2-bequiet-straight-power-12-750w', brand: 'be quiet!', model: 'Straight Power 12 750W', price: 150, releaseYear: 2022, tier: 'performance', segment: 'consumer', wattage: 750, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-straight-power-12-1200w', brand: 'be quiet!', model: 'Straight Power 12 1200W', price: 250, releaseYear: 2022, tier: 'enthusiast', segment: 'consumer', wattage: 1200, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-straight-power-12-1500w', brand: 'be quiet!', model: 'Straight Power 12 1500W', price: 300, releaseYear: 2023, tier: 'flagship', segment: 'workstation', wattage: 1500, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-dark-power-13-850w', brand: 'be quiet!', model: 'Dark Power 13 850W', price: 240, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', wattage: 850, efficiency: '80+ Titanium', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-dark-power-pro-13-1600w', brand: 'be quiet!', model: 'Dark Power Pro 13 1600W', price: 480, releaseYear: 2023, tier: 'flagship', segment: 'workstation', wattage: 1600, efficiency: '80+ Titanium', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-bequiet-sfx-power-3-450w', brand: 'be quiet!', model: 'SFX Power 3 450W', price: 75, releaseYear: 2020, tier: 'entry', segment: 'consumer', wattage: 450, efficiency: '80+ Bronze', modular: 'none', formFactor: 'SFX', atx31: false }),
  p({ id: 'psu2-bequiet-sfx-l-power-600w', brand: 'be quiet!', model: 'SFX L Power 600W', price: 120, releaseYear: 2018, tier: 'mainstream', segment: 'consumer', wattage: 600, efficiency: '80+ Gold', modular: 'full', formFactor: 'SFX-L', atx31: false }),

  // --- MSI ---
  p({ id: 'psu2-msi-mag-a550bn', brand: 'MSI', model: 'MAG A550BN', price: 50, releaseYear: 2021, tier: 'entry', segment: 'consumer', wattage: 550, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-msi-mag-a650bn', brand: 'MSI', model: 'MAG A650BN', price: 55, releaseYear: 2021, tier: 'entry', segment: 'consumer', wattage: 650, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-msi-mag-a1000gl-pcie5', brand: 'MSI', model: 'MAG A1000GL PCIE5', price: 145, releaseYear: 2023, tier: 'performance', segment: 'consumer', wattage: 1000, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-msi-meg-ai1300p-pcie5', brand: 'MSI', model: 'MEG Ai1300P PCIE5', price: 280, releaseYear: 2023, tier: 'flagship', segment: 'consumer', wattage: 1300, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-msi-meg-ai1600t-pcie5', brand: 'MSI', model: 'MEG Ai1600T PCIE5', price: 450, releaseYear: 2023, tier: 'flagship', segment: 'workstation', wattage: 1600, efficiency: '80+ Titanium', modular: 'full', formFactor: 'ATX', atx31: false }),

  // --- Cooler Master ---
  p({ id: 'psu2-coolermaster-mwe-650-bronze-v2', brand: 'Cooler Master', model: 'MWE 650 Bronze V2', price: 60, releaseYear: 2020, tier: 'entry', segment: 'consumer', wattage: 650, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-coolermaster-mwe-gold-650-v2', brand: 'Cooler Master', model: 'MWE Gold 650 V2 Full Modular', price: 80, releaseYear: 2020, tier: 'mainstream', segment: 'consumer', wattage: 650, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-coolermaster-v850-gold-v2', brand: 'Cooler Master', model: 'V850 Gold V2', price: 130, releaseYear: 2021, tier: 'performance', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-coolermaster-v1300-platinum', brand: 'Cooler Master', model: 'V1300 Platinum', price: 290, releaseYear: 2021, tier: 'enthusiast', segment: 'consumer', wattage: 1300, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-coolermaster-v750-sfx-gold', brand: 'Cooler Master', model: 'V750 SFX Gold', price: 140, releaseYear: 2021, tier: 'performance', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'full', formFactor: 'SFX', atx31: false }),

  // --- Thermaltake ---
  p({ id: 'psu2-thermaltake-smart-600w', brand: 'Thermaltake', model: 'Smart 600W', price: 45, releaseYear: 2017, tier: 'entry', segment: 'consumer', wattage: 600, efficiency: '80+ White', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-thermaltake-smart-bx1-650w', brand: 'Thermaltake', model: 'Smart BX1 650W', price: 55, releaseYear: 2018, tier: 'entry', segment: 'consumer', wattage: 650, efficiency: '80+ Bronze', modular: 'none', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-thermaltake-toughpower-gf-a3-750w', brand: 'Thermaltake', model: 'Toughpower GF A3 750W', price: 95, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-thermaltake-toughpower-gf3-1000w', brand: 'Thermaltake', model: 'Toughpower GF3 1000W', price: 170, releaseYear: 2022, tier: 'performance', segment: 'consumer', wattage: 1000, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),

  // --- NZXT / ASUS / Gigabyte ---
  p({ id: 'psu2-nzxt-c750-gold-2024', brand: 'NZXT', model: 'C750 Gold (2024)', price: 105, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: true }),
  p({ id: 'psu2-nzxt-c1200-gold-2024', brand: 'NZXT', model: 'C1200 Gold (2024)', price: 190, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', wattage: 1200, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: true }),
  p({ id: 'psu2-asus-tuf-gaming-750g', brand: 'ASUS', model: 'TUF Gaming 750W Gold', price: 100, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-asus-tuf-gaming-1000g', brand: 'ASUS', model: 'TUF Gaming 1000W Gold', price: 150, releaseYear: 2023, tier: 'performance', segment: 'consumer', wattage: 1000, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-asus-rog-strix-850g-aura', brand: 'ASUS', model: 'ROG Strix 850W Gold Aura Edition', price: 150, releaseYear: 2023, tier: 'performance', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-asus-rog-thor-1000p2', brand: 'ASUS', model: 'ROG Thor 1000W Platinum II', price: 300, releaseYear: 2022, tier: 'flagship', segment: 'consumer', wattage: 1000, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-asus-rog-loki-850p', brand: 'ASUS', model: 'ROG Loki SFX-L 850W Platinum', price: 200, releaseYear: 2022, tier: 'enthusiast', segment: 'consumer', wattage: 850, efficiency: '80+ Platinum', modular: 'full', formFactor: 'SFX-L', atx31: false }),
  p({ id: 'psu2-asus-rog-loki-1000p', brand: 'ASUS', model: 'ROG Loki SFX-L 1000W Platinum', price: 240, releaseYear: 2022, tier: 'enthusiast', segment: 'consumer', wattage: 1000, efficiency: '80+ Platinum', modular: 'full', formFactor: 'SFX-L', atx31: false }),
  p({ id: 'psu2-gigabyte-ud750gm-pg5', brand: 'Gigabyte', model: 'UD750GM PG5', price: 85, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-gigabyte-ud850gm-pg5', brand: 'Gigabyte', model: 'UD850GM PG5', price: 100, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-gigabyte-ud1000gm-pg5', brand: 'Gigabyte', model: 'UD1000GM PG5', price: 140, releaseYear: 2022, tier: 'performance', segment: 'consumer', wattage: 1000, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),

  // --- FSP / Super Flower / Lian Li / DeepCool ---
  p({ id: 'psu2-fsp-hydro-g-pro-1000w-atx3', brand: 'FSP', model: 'Hydro G PRO 1000W ATX3.0', price: 170, releaseYear: 2023, tier: 'performance', segment: 'consumer', wattage: 1000, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-fsp-hydro-ptm-pro-1200w-atx3', brand: 'FSP', model: 'Hydro PTM PRO 1200W ATX3.0', price: 250, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', wattage: 1200, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-fsp-dagger-pro-850w', brand: 'FSP', model: 'Dagger PRO 850W', price: 150, releaseYear: 2022, tier: 'performance', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'SFX', atx31: false }),
  p({ id: 'psu2-superflower-leadex-platinum-se-1000w', brand: 'Super Flower', model: 'Leadex Platinum SE 1000W', price: 180, releaseYear: 2020, tier: 'performance', segment: 'consumer', wattage: 1000, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-superflower-leadex-vii-xg-850w', brand: 'Super Flower', model: 'Leadex VII XG 850W', price: 140, releaseYear: 2023, tier: 'performance', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-superflower-leadex-titanium-1600w', brand: 'Super Flower', model: 'Leadex Titanium 1600W', price: 400, releaseYear: 2017, tier: 'flagship', segment: 'workstation', wattage: 1600, efficiency: '80+ Titanium', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-lianli-sp750', brand: 'Lian Li', model: 'SP750', price: 130, releaseYear: 2021, tier: 'performance', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'full', formFactor: 'SFX', atx31: false }),
  p({ id: 'psu2-lianli-sp850', brand: 'Lian Li', model: 'SP850', price: 150, releaseYear: 2022, tier: 'performance', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'SFX', atx31: false }),
  p({ id: 'psu2-lianli-edge-1200-platinum', brand: 'Lian Li', model: 'Edge 1200 Platinum', price: 250, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', wattage: 1200, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: true }),
  p({ id: 'psu2-lianli-edge-1300-platinum', brand: 'Lian Li', model: 'Edge 1300 Platinum', price: 280, releaseYear: 2024, tier: 'flagship', segment: 'consumer', wattage: 1300, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: true }),
  p({ id: 'psu2-deepcool-pq850m', brand: 'DeepCool', model: 'PQ850M', price: 110, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-deepcool-pq1000m', brand: 'DeepCool', model: 'PQ1000M', price: 140, releaseYear: 2022, tier: 'performance', segment: 'consumer', wattage: 1000, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-deepcool-px850g', brand: 'DeepCool', model: 'PX850G', price: 115, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-deepcool-px1300p', brand: 'DeepCool', model: 'PX1300P', price: 240, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', wattage: 1300, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),

  // --- Antec / Enermax / Fractal ---
  p({ id: 'psu2-antec-ne850g-m-atx3', brand: 'Antec', model: 'NeoECO NE850G M ATX3.0', price: 110, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', wattage: 850, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-antec-signature-1000-titanium', brand: 'Antec', model: 'Signature 1000 Titanium', price: 280, releaseYear: 2020, tier: 'flagship', segment: 'consumer', wattage: 1000, efficiency: '80+ Titanium', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-enermax-platimax-df-1200w', brand: 'Enermax', model: 'Platimax D.F. 1200W', price: 230, releaseYear: 2017, tier: 'enthusiast', segment: 'consumer', wattage: 1200, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-fractal-ion-gold-750', brand: 'Fractal Design', model: 'Ion Gold 750W', price: 100, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', wattage: 750, efficiency: '80+ Gold', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-fractal-ion-plus-2-platinum-860', brand: 'Fractal Design', model: 'Ion+ 2 Platinum 860W', price: 150, releaseYear: 2021, tier: 'performance', segment: 'consumer', wattage: 860, efficiency: '80+ Platinum', modular: 'full', formFactor: 'ATX', atx31: false }),
  p({ id: 'psu2-fractal-ion-sfx-650-gold', brand: 'Fractal Design', model: 'Ion SFX 650 Gold', price: 130, releaseYear: 2020, tier: 'performance', segment: 'consumer', wattage: 650, efficiency: '80+ Gold', modular: 'full', formFactor: 'SFX-L', atx31: false }),

  // --- Serveur redondant ---
  p({ id: 'psu2-supermicro-pws-751p-1r', brand: 'Supermicro', model: 'PWS-751P-1R 750W', price: 170, releaseYear: 2016, tier: 'mainstream', segment: 'server', wattage: 750, efficiency: '80+ Platinum', modular: 'none', formFactor: 'Redundant', atx31: false }),
  p({ id: 'psu2-supermicro-pws-1k28p-sq', brand: 'Supermicro', model: 'PWS-1K28P-SQ 1280W', price: 260, releaseYear: 2016, tier: 'performance', segment: 'server', wattage: 1280, efficiency: '80+ Platinum', modular: 'none', formFactor: 'Redundant', atx31: false }),
  p({ id: 'psu2-fsp-twins-pro-700w', brand: 'FSP', model: 'Twins PRO 700W (1+1 redondant ATX)', price: 350, releaseYear: 2019, tier: 'performance', segment: 'server', wattage: 700, efficiency: '80+ Gold', modular: 'semi', formFactor: 'Redundant', atx31: false }),
  p({ id: 'psu2-fsp-twins-pro-900w', brand: 'FSP', model: 'Twins PRO 900W (1+1 redondant ATX)', price: 420, releaseYear: 2019, tier: 'enthusiast', segment: 'server', wattage: 900, efficiency: '80+ Platinum', modular: 'semi', formFactor: 'Redundant', atx31: false }),
]
