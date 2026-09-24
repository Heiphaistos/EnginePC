// Référentiel des chipsets GPU du dataset externe, aligné sur l'échelle de src/data/catalog/gpus.ts.
// gamingScore : raster 4K relatif (RTX 5090 = 100). aiScore : H200 NVL = 100, RTX 5090 = 60.
// Valeurs copiées du catalogue curé quand le chipset y existe ; estimations relatives sinon.
// Variantes ambiguës (RTX 4060 Ti, RTX 5060 Ti, RX 9060 XT) : valeurs de la version 16 Go.

export interface GpuRef {
  gamingScore: number
  aiScore: number
  tdp: number
  vramType: string
  recommendedPsuW: number
  releaseYear: number
  tier: 'entry' | 'mainstream' | 'performance' | 'enthusiast' | 'flagship'
  segment: 'consumer' | 'workstation'
  fp16Tflops?: number
  slots: number
  powerConnector?: string
}

export const GPU_REFERENCE: Record<string, GpuRef> = {
  // ---- Intel Arc ----
  'Arc A310': { gamingScore: 4, aiScore: 3, tdp: 75, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2022, tier: 'entry', segment: 'consumer', fp16Tflops: 25, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Arc A380': { gamingScore: 7, aiScore: 5, tdp: 75, vramType: 'GDDR6', recommendedPsuW: 350, releaseYear: 2022, tier: 'entry', segment: 'consumer', fp16Tflops: 33, slots: 2, powerConnector: '1x 8-pin' },
  'Arc A580': { gamingScore: 13, aiScore: 8, tdp: 185, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2023, tier: 'entry', segment: 'consumer', fp16Tflops: 98, slots: 2, powerConnector: '2x 8-pin' },
  'Arc A750': { gamingScore: 15, aiScore: 9, tdp: 225, vramType: 'GDDR6', recommendedPsuW: 600, releaseYear: 2022, tier: 'entry', segment: 'consumer', fp16Tflops: 115, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'Arc A770': { gamingScore: 17, aiScore: 13, tdp: 225, vramType: 'GDDR6', recommendedPsuW: 600, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', fp16Tflops: 138, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'Arc B570': { gamingScore: 15, aiScore: 11, tdp: 150, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2025, tier: 'entry', segment: 'consumer', fp16Tflops: 104, slots: 2, powerConnector: '1x 8-pin' },
  'Arc B580': { gamingScore: 18, aiScore: 14, tdp: 190, vramType: 'GDDR6', recommendedPsuW: 600, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', fp16Tflops: 117, slots: 2, powerConnector: '1x 8-pin' },

  // ---- NVIDIA GeForce GTX 10 / 16 ----
  'GeForce GT 1030': { gamingScore: 3, aiScore: 1, tdp: 30, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2017, tier: 'entry', segment: 'consumer', slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'GeForce GTX 1050': { gamingScore: 6, aiScore: 2, tdp: 75, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2016, tier: 'entry', segment: 'consumer', slots: 2, powerConnector: 'Alimenté par le slot PCIe' },
  'GeForce GTX 1050 Ti': { gamingScore: 7, aiScore: 2, tdp: 75, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2016, tier: 'entry', segment: 'consumer', slots: 2, powerConnector: 'Alimenté par le slot PCIe' },
  'GeForce GTX 1060 3GB': { gamingScore: 11, aiScore: 3, tdp: 120, vramType: 'GDDR5', recommendedPsuW: 400, releaseYear: 2016, tier: 'entry', segment: 'consumer', slots: 2, powerConnector: '1x 6-pin' },
  'GeForce GTX 1060 6GB': { gamingScore: 12, aiScore: 4, tdp: 120, vramType: 'GDDR5', recommendedPsuW: 400, releaseYear: 2016, tier: 'entry', segment: 'consumer', slots: 2, powerConnector: '1x 6-pin' },
  'GeForce GTX 1070': { gamingScore: 14, aiScore: 5, tdp: 150, vramType: 'GDDR5', recommendedPsuW: 500, releaseYear: 2016, tier: 'mainstream', segment: 'consumer', slots: 2, powerConnector: '1x 8-pin' },
  'GeForce GTX 1070 Ti': { gamingScore: 15, aiScore: 6, tdp: 180, vramType: 'GDDR5', recommendedPsuW: 500, releaseYear: 2017, tier: 'mainstream', segment: 'consumer', slots: 2, powerConnector: '1x 8-pin' },
  'GeForce GTX 1080': { gamingScore: 16, aiScore: 6, tdp: 180, vramType: 'GDDR5X', recommendedPsuW: 500, releaseYear: 2016, tier: 'mainstream', segment: 'consumer', slots: 2, powerConnector: '1x 8-pin' },
  'GeForce GTX 1080 Ti': { gamingScore: 20, aiScore: 8, tdp: 250, vramType: 'GDDR5X', recommendedPsuW: 600, releaseYear: 2017, tier: 'mainstream', segment: 'consumer', slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'GeForce GTX 1650 G5': { gamingScore: 8, aiScore: 3, tdp: 75, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2019, tier: 'entry', segment: 'consumer', fp16Tflops: 6, slots: 2, powerConnector: 'Alimenté par le slot PCIe' },
  'GeForce GTX 1650 G6': { gamingScore: 9, aiScore: 3, tdp: 75, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2020, tier: 'entry', segment: 'consumer', fp16Tflops: 6, slots: 2, powerConnector: 'Alimenté par le slot PCIe' },
  'GeForce GTX 1650 SUPER': { gamingScore: 10, aiScore: 3, tdp: 100, vramType: 'GDDR6', recommendedPsuW: 350, releaseYear: 2019, tier: 'entry', segment: 'consumer', fp16Tflops: 8.8, slots: 2, powerConnector: '1x 6-pin' },
  'GeForce GTX 1660': { gamingScore: 12, aiScore: 4, tdp: 120, vramType: 'GDDR5', recommendedPsuW: 450, releaseYear: 2019, tier: 'entry', segment: 'consumer', fp16Tflops: 10, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce GTX 1660 SUPER': { gamingScore: 13, aiScore: 5, tdp: 125, vramType: 'GDDR6', recommendedPsuW: 450, releaseYear: 2019, tier: 'entry', segment: 'consumer', fp16Tflops: 10, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce GTX 1660 Ti': { gamingScore: 13, aiScore: 5, tdp: 120, vramType: 'GDDR6', recommendedPsuW: 450, releaseYear: 2019, tier: 'entry', segment: 'consumer', fp16Tflops: 11, slots: 2, powerConnector: '1x 8-pin' },

  // ---- NVIDIA GeForce RTX 20 ----
  'GeForce RTX 2060': { gamingScore: 14, aiScore: 9, tdp: 160, vramType: 'GDDR6', recommendedPsuW: 500, releaseYear: 2019, tier: 'mainstream', segment: 'consumer', fp16Tflops: 51.6, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 2060 12GB': { gamingScore: 15, aiScore: 11, tdp: 185, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', fp16Tflops: 57.4, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 2060 SUPER': { gamingScore: 16, aiScore: 11, tdp: 175, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2019, tier: 'mainstream', segment: 'consumer', fp16Tflops: 57.4, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 2070': { gamingScore: 16, aiScore: 12, tdp: 175, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2018, tier: 'mainstream', segment: 'consumer', fp16Tflops: 59.7, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'GeForce RTX 2070 SUPER': { gamingScore: 18, aiScore: 13, tdp: 215, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2019, tier: 'performance', segment: 'consumer', fp16Tflops: 72.5, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'GeForce RTX 2080': { gamingScore: 19, aiScore: 14, tdp: 215, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2018, tier: 'performance', segment: 'consumer', fp16Tflops: 80.5, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'GeForce RTX 2080 SUPER': { gamingScore: 20, aiScore: 15, tdp: 250, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2019, tier: 'performance', segment: 'consumer', fp16Tflops: 89.2, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'GeForce RTX 2080 Ti': { gamingScore: 26, aiScore: 18, tdp: 250, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2018, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 107.6, slots: 2, powerConnector: '2x 8-pin' },
  'TITAN RTX': { gamingScore: 28, aiScore: 28, tdp: 280, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2018, tier: 'flagship', segment: 'consumer', fp16Tflops: 130, slots: 2, powerConnector: '2x 8-pin' },
  'Titan V': { gamingScore: 24, aiScore: 20, tdp: 250, vramType: 'HBM2', recommendedPsuW: 600, releaseYear: 2017, tier: 'flagship', segment: 'consumer', fp16Tflops: 110, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'Titan Xp': { gamingScore: 21, aiScore: 8, tdp: 250, vramType: 'GDDR5X', recommendedPsuW: 600, releaseYear: 2017, tier: 'flagship', segment: 'consumer', slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },

  // ---- NVIDIA GeForce RTX 30 ----
  'GeForce RTX 3050 6GB': { gamingScore: 9, aiScore: 6, tdp: 70, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2024, tier: 'entry', segment: 'consumer', fp16Tflops: 14.6, slots: 2, powerConnector: 'Alimenté par le slot PCIe' },
  'GeForce RTX 3050 8GB': { gamingScore: 11, aiScore: 8, tdp: 130, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2022, tier: 'entry', segment: 'consumer', fp16Tflops: 18.2, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 3060 12GB': { gamingScore: 15, aiScore: 14, tdp: 170, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2021, tier: 'entry', segment: 'consumer', fp16Tflops: 25.6, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 3060 8GB': { gamingScore: 13, aiScore: 10, tdp: 170, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2022, tier: 'entry', segment: 'consumer', fp16Tflops: 25.6, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 3060 Ti': { gamingScore: 21, aiScore: 13, tdp: 200, vramType: 'GDDR6', recommendedPsuW: 600, releaseYear: 2020, tier: 'mainstream', segment: 'consumer', fp16Tflops: 32.4, slots: 2, powerConnector: '12-pin' },
  'GeForce RTX 3060 Ti LHR': { gamingScore: 21, aiScore: 13, tdp: 200, vramType: 'GDDR6', recommendedPsuW: 600, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', fp16Tflops: 32.4, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 3070': { gamingScore: 25, aiScore: 15, tdp: 220, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2020, tier: 'mainstream', segment: 'consumer', fp16Tflops: 40.6, slots: 2, powerConnector: '12-pin' },
  'GeForce RTX 3070 LHR': { gamingScore: 25, aiScore: 15, tdp: 220, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', fp16Tflops: 40.6, slots: 2, powerConnector: '2x 8-pin' },
  'GeForce RTX 3070 Ti': { gamingScore: 27, aiScore: 16, tdp: 290, vramType: 'GDDR6X', recommendedPsuW: 750, releaseYear: 2021, tier: 'performance', segment: 'consumer', fp16Tflops: 43.5, slots: 2, powerConnector: '12-pin' },
  'GeForce RTX 3080 10GB': { gamingScore: 33, aiScore: 22, tdp: 320, vramType: 'GDDR6X', recommendedPsuW: 750, releaseYear: 2020, tier: 'performance', segment: 'consumer', fp16Tflops: 59.5, slots: 2, powerConnector: '12-pin' },
  'GeForce RTX 3080 10GB LHR': { gamingScore: 33, aiScore: 22, tdp: 320, vramType: 'GDDR6X', recommendedPsuW: 750, releaseYear: 2021, tier: 'performance', segment: 'consumer', fp16Tflops: 59.5, slots: 2, powerConnector: '2x 8-pin' },
  'GeForce RTX 3080 12GB LHR': { gamingScore: 35, aiScore: 24, tdp: 350, vramType: 'GDDR6X', recommendedPsuW: 750, releaseYear: 2022, tier: 'performance', segment: 'consumer', fp16Tflops: 61.3, slots: 2, powerConnector: '2x 8-pin' },
  'GeForce RTX 3080 Ti': { gamingScore: 36, aiScore: 25, tdp: 350, vramType: 'GDDR6X', recommendedPsuW: 750, releaseYear: 2021, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 68.2, slots: 2, powerConnector: '12-pin' },
  'GeForce RTX 3090': { gamingScore: 37, aiScore: 32, tdp: 350, vramType: 'GDDR6X', recommendedPsuW: 750, releaseYear: 2020, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 71, slots: 3, powerConnector: '12-pin' },
  'GeForce RTX 3090 Ti': { gamingScore: 41, aiScore: 34, tdp: 450, vramType: 'GDDR6X', recommendedPsuW: 850, releaseYear: 2022, tier: 'flagship', segment: 'consumer', fp16Tflops: 80, slots: 3, powerConnector: '12VHPWR' },

  // ---- NVIDIA GeForce RTX 40 ----
  'GeForce RTX 4060': { gamingScore: 17, aiScore: 12, tdp: 115, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2023, tier: 'entry', segment: 'consumer', fp16Tflops: 30, slots: 2.5, powerConnector: '1x 8-pin' },
  'GeForce RTX 4060 Ti': { gamingScore: 23, aiScore: 20, tdp: 165, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2023, tier: 'mainstream', segment: 'consumer', fp16Tflops: 44, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 4070': { gamingScore: 32, aiScore: 21, tdp: 200, vramType: 'GDDR6X', recommendedPsuW: 650, releaseYear: 2023, tier: 'performance', segment: 'consumer', fp16Tflops: 58, slots: 2, powerConnector: '12VHPWR' },
  'GeForce RTX 4070 SUPER': { gamingScore: 38, aiScore: 24, tdp: 220, vramType: 'GDDR6X', recommendedPsuW: 650, releaseYear: 2024, tier: 'performance', segment: 'consumer', fp16Tflops: 71, slots: 2, powerConnector: '12VHPWR' },
  'GeForce RTX 4070 Ti': { gamingScore: 42, aiScore: 27, tdp: 285, vramType: 'GDDR6X', recommendedPsuW: 700, releaseYear: 2023, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 80, slots: 3, powerConnector: '12VHPWR' },
  'GeForce RTX 4070 Ti SUPER': { gamingScore: 47, aiScore: 30, tdp: 285, vramType: 'GDDR6X', recommendedPsuW: 700, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 88, slots: 3, powerConnector: '12VHPWR' },
  'GeForce RTX 4080': { gamingScore: 55, aiScore: 33, tdp: 320, vramType: 'GDDR6X', recommendedPsuW: 750, releaseYear: 2022, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 97.5, slots: 3, powerConnector: '12VHPWR' },
  'GeForce RTX 4080 SUPER': { gamingScore: 57, aiScore: 34, tdp: 320, vramType: 'GDDR6X', recommendedPsuW: 750, releaseYear: 2024, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 104, slots: 3, powerConnector: '12VHPWR' },
  'GeForce RTX 4090': { gamingScore: 77, aiScore: 48, tdp: 450, vramType: 'GDDR6X', recommendedPsuW: 850, releaseYear: 2022, tier: 'flagship', segment: 'consumer', fp16Tflops: 165, slots: 3, powerConnector: '12VHPWR' },

  // ---- NVIDIA GeForce RTX 50 ----
  'GeForce RTX 5050': { gamingScore: 15, aiScore: 10, tdp: 130, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2025, tier: 'entry', segment: 'consumer', fp16Tflops: 26, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 5060': { gamingScore: 20, aiScore: 14, tdp: 145, vramType: 'GDDR7', recommendedPsuW: 550, releaseYear: 2025, tier: 'entry', segment: 'consumer', fp16Tflops: 38, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 5060 Ti': { gamingScore: 27, aiScore: 24, tdp: 180, vramType: 'GDDR7', recommendedPsuW: 600, releaseYear: 2025, tier: 'mainstream', segment: 'consumer', fp16Tflops: 47, slots: 2, powerConnector: '1x 8-pin' },
  'GeForce RTX 5070': { gamingScore: 40, aiScore: 26, tdp: 250, vramType: 'GDDR7', recommendedPsuW: 650, releaseYear: 2025, tier: 'performance', segment: 'consumer', fp16Tflops: 62, slots: 2, powerConnector: '12V-2x6' },
  'GeForce RTX 5070 Ti': { gamingScore: 52, aiScore: 34, tdp: 300, vramType: 'GDDR7', recommendedPsuW: 750, releaseYear: 2025, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 88, slots: 3, powerConnector: '12V-2x6' },
  'GeForce RTX 5080': { gamingScore: 60, aiScore: 38, tdp: 360, vramType: 'GDDR7', recommendedPsuW: 850, releaseYear: 2025, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 113, slots: 2, powerConnector: '12V-2x6' },
  'GeForce RTX 5090': { gamingScore: 100, aiScore: 60, tdp: 575, vramType: 'GDDR7', recommendedPsuW: 1000, releaseYear: 2025, tier: 'flagship', segment: 'consumer', fp16Tflops: 209, slots: 2, powerConnector: '12V-2x6' },

  // ---- NVIDIA Quadro Pascal ----
  'Quadro P400': { gamingScore: 2, aiScore: 1, tdp: 30, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2017, tier: 'entry', segment: 'workstation', slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Quadro P600': { gamingScore: 3, aiScore: 1, tdp: 40, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2017, tier: 'entry', segment: 'workstation', slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Quadro P620': { gamingScore: 3, aiScore: 1, tdp: 40, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2018, tier: 'entry', segment: 'workstation', slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Quadro P1000': { gamingScore: 5, aiScore: 2, tdp: 47, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2017, tier: 'entry', segment: 'workstation', slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Quadro P2000': { gamingScore: 8, aiScore: 3, tdp: 75, vramType: 'GDDR5', recommendedPsuW: 300, releaseYear: 2017, tier: 'entry', segment: 'workstation', slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Quadro P2200': { gamingScore: 9, aiScore: 3, tdp: 75, vramType: 'GDDR5X', recommendedPsuW: 300, releaseYear: 2019, tier: 'entry', segment: 'workstation', slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Quadro P4000': { gamingScore: 12, aiScore: 5, tdp: 105, vramType: 'GDDR5', recommendedPsuW: 400, releaseYear: 2017, tier: 'mainstream', segment: 'workstation', slots: 1, powerConnector: '1x 6-pin' },
  'Quadro P5000': { gamingScore: 15, aiScore: 7, tdp: 180, vramType: 'GDDR5X', recommendedPsuW: 500, releaseYear: 2016, tier: 'performance', segment: 'workstation', slots: 2, powerConnector: '1x 8-pin' },

  // ---- NVIDIA Turing workstation ----
  'T400 4GB': { gamingScore: 3, aiScore: 2, tdp: 30, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2021, tier: 'entry', segment: 'workstation', fp16Tflops: 2.2, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'T600': { gamingScore: 6, aiScore: 3, tdp: 40, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2021, tier: 'entry', segment: 'workstation', fp16Tflops: 3.4, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'T1000 4GB': { gamingScore: 8, aiScore: 4, tdp: 50, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2021, tier: 'entry', segment: 'workstation', fp16Tflops: 5, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'T1000 8GB': { gamingScore: 8, aiScore: 5, tdp: 50, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2021, tier: 'entry', segment: 'workstation', fp16Tflops: 5, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Quadro RTX 4000': { gamingScore: 16, aiScore: 13, tdp: 160, vramType: 'GDDR6', recommendedPsuW: 500, releaseYear: 2018, tier: 'mainstream', segment: 'workstation', fp16Tflops: 57, slots: 1, powerConnector: '1x 8-pin' },
  'Quadro RTX 5000': { gamingScore: 20, aiScore: 20, tdp: 230, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2018, tier: 'performance', segment: 'workstation', fp16Tflops: 89, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'Quadro RTX 6000': { gamingScore: 27, aiScore: 28, tdp: 295, vramType: 'GDDR6 ECC', recommendedPsuW: 700, releaseYear: 2018, tier: 'enthusiast', segment: 'workstation', fp16Tflops: 130, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'Quadro RTX 8000': { gamingScore: 27, aiScore: 34, tdp: 295, vramType: 'GDDR6 ECC', recommendedPsuW: 700, releaseYear: 2018, tier: 'flagship', segment: 'workstation', fp16Tflops: 130, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },

  // ---- NVIDIA Ampere workstation ----
  'RTX A1000': { gamingScore: 11, aiScore: 11, tdp: 50, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2024, tier: 'entry', segment: 'workstation', fp16Tflops: 26, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'RTX A2000 12GB': { gamingScore: 12, aiScore: 14, tdp: 70, vramType: 'GDDR6 ECC', recommendedPsuW: 300, releaseYear: 2021, tier: 'entry', segment: 'workstation', fp16Tflops: 32, slots: 2, powerConnector: 'Alimenté par le slot PCIe' },
  'RTX A4000': { gamingScore: 24, aiScore: 22, tdp: 140, vramType: 'GDDR6 ECC', recommendedPsuW: 550, releaseYear: 2021, tier: 'mainstream', segment: 'workstation', fp16Tflops: 77, slots: 1, powerConnector: '1x 6-pin' },
  'RTX A4500': { gamingScore: 28, aiScore: 26, tdp: 200, vramType: 'GDDR6 ECC', recommendedPsuW: 650, releaseYear: 2021, tier: 'performance', segment: 'workstation', fp16Tflops: 95, slots: 2, powerConnector: '1x 8-pin' },
  'RTX A5000': { gamingScore: 30, aiScore: 30, tdp: 230, vramType: 'GDDR6 ECC', recommendedPsuW: 650, releaseYear: 2021, tier: 'enthusiast', segment: 'workstation', fp16Tflops: 111, slots: 2, powerConnector: '1x 8-pin' },
  'RTX A6000': { gamingScore: 37, aiScore: 44, tdp: 300, vramType: 'GDDR6 ECC', recommendedPsuW: 750, releaseYear: 2020, tier: 'flagship', segment: 'workstation', fp16Tflops: 155, slots: 2, powerConnector: '1x 8-pin EPS' },

  // ---- NVIDIA Ada workstation ----
  'RTX 2000 Ada Generation': { gamingScore: 15, aiScore: 18, tdp: 70, vramType: 'GDDR6 ECC', recommendedPsuW: 300, releaseYear: 2024, tier: 'mainstream', segment: 'workstation', fp16Tflops: 48, slots: 2, powerConnector: 'Alimenté par le slot PCIe' },
  'RTX 2000E Ada Generation': { gamingScore: 14, aiScore: 17, tdp: 50, vramType: 'GDDR6 ECC', recommendedPsuW: 300, releaseYear: 2024, tier: 'mainstream', segment: 'workstation', fp16Tflops: 44, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'RTX 4000 SFF Ada Generation': { gamingScore: 22, aiScore: 28, tdp: 70, vramType: 'GDDR6 ECC', recommendedPsuW: 300, releaseYear: 2023, tier: 'performance', segment: 'workstation', fp16Tflops: 77, slots: 2, powerConnector: 'Alimenté par le slot PCIe' },
  'RTX 4000 Ada Generation': { gamingScore: 30, aiScore: 32, tdp: 130, vramType: 'GDDR6 ECC', recommendedPsuW: 550, releaseYear: 2023, tier: 'performance', segment: 'workstation', fp16Tflops: 107, slots: 1, powerConnector: '16-pin' },
  'RTX 4500 Ada Generation': { gamingScore: 42, aiScore: 40, tdp: 210, vramType: 'GDDR6 ECC', recommendedPsuW: 650, releaseYear: 2023, tier: 'enthusiast', segment: 'workstation', fp16Tflops: 159, slots: 2, powerConnector: '16-pin' },
  'RTX 5000 Ada Generation': { gamingScore: 58, aiScore: 50, tdp: 250, vramType: 'GDDR6 ECC', recommendedPsuW: 750, releaseYear: 2023, tier: 'enthusiast', segment: 'workstation', fp16Tflops: 261, slots: 2, powerConnector: '16-pin' },
  'RTX 6000 Ada Generation': { gamingScore: 75, aiScore: 62, tdp: 300, vramType: 'GDDR6 ECC', recommendedPsuW: 850, releaseYear: 2022, tier: 'flagship', segment: 'workstation', fp16Tflops: 364, slots: 2, powerConnector: '16-pin' },

  // ---- AMD Radeon PRO ----
  'Radeon Pro W5500': { gamingScore: 9, aiScore: 3, tdp: 125, vramType: 'GDDR6', recommendedPsuW: 450, releaseYear: 2020, tier: 'entry', segment: 'workstation', fp16Tflops: 10.7, slots: 1, powerConnector: '1x 6-pin' },
  'Radeon Pro VII': { gamingScore: 17, aiScore: 10, tdp: 250, vramType: 'HBM2 ECC', recommendedPsuW: 650, releaseYear: 2020, tier: 'performance', segment: 'workstation', fp16Tflops: 26.5, slots: 2, powerConnector: '2x 8-pin' },
  'Radeon PRO W6400': { gamingScore: 5, aiScore: 2, tdp: 50, vramType: 'GDDR6', recommendedPsuW: 300, releaseYear: 2022, tier: 'entry', segment: 'workstation', fp16Tflops: 7, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Radeon PRO W6600': { gamingScore: 13, aiScore: 6, tdp: 130, vramType: 'GDDR6', recommendedPsuW: 450, releaseYear: 2021, tier: 'mainstream', segment: 'workstation', fp16Tflops: 20.8, slots: 1, powerConnector: '1x 6-pin' },
  'Radeon PRO W6800': { gamingScore: 26, aiScore: 18, tdp: 250, vramType: 'GDDR6 ECC', recommendedPsuW: 650, releaseYear: 2021, tier: 'enthusiast', segment: 'workstation', fp16Tflops: 35.7, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'Radeon PRO W7500': { gamingScore: 11, aiScore: 8, tdp: 70, vramType: 'GDDR6 ECC', recommendedPsuW: 300, releaseYear: 2023, tier: 'entry', segment: 'workstation', fp16Tflops: 24.4, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Radeon PRO W7600': { gamingScore: 15, aiScore: 10, tdp: 130, vramType: 'GDDR6 ECC', recommendedPsuW: 450, releaseYear: 2023, tier: 'mainstream', segment: 'workstation', fp16Tflops: 40, slots: 1, powerConnector: '1x 6-pin' },
  'Radeon PRO W7700': { gamingScore: 24, aiScore: 16, tdp: 190, vramType: 'GDDR6 ECC', recommendedPsuW: 600, releaseYear: 2023, tier: 'performance', segment: 'workstation', fp16Tflops: 57, slots: 1, powerConnector: '1x 8-pin' },
  'Radeon PRO W7800': { gamingScore: 38, aiScore: 32, tdp: 260, vramType: 'GDDR6 ECC', recommendedPsuW: 750, releaseYear: 2023, tier: 'enthusiast', segment: 'workstation', fp16Tflops: 90.5, slots: 2, powerConnector: '2x 8-pin' },
  'Radeon PRO W7900': { gamingScore: 48, aiScore: 42, tdp: 295, vramType: 'GDDR6 ECC', recommendedPsuW: 850, releaseYear: 2023, tier: 'flagship', segment: 'workstation', fp16Tflops: 122, slots: 3, powerConnector: '2x 8-pin' },

  // ---- AMD Radeon Polaris / Vega ----
  'Radeon RX 480': { gamingScore: 10, aiScore: 3, tdp: 150, vramType: 'GDDR5', recommendedPsuW: 500, releaseYear: 2016, tier: 'entry', segment: 'consumer', fp16Tflops: 5.8, slots: 2, powerConnector: '1x 6-pin' },
  'Radeon RX 570': { gamingScore: 9, aiScore: 2, tdp: 150, vramType: 'GDDR5', recommendedPsuW: 450, releaseYear: 2017, tier: 'entry', segment: 'consumer', fp16Tflops: 5.1, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 580': { gamingScore: 11, aiScore: 3, tdp: 185, vramType: 'GDDR5', recommendedPsuW: 500, releaseYear: 2017, tier: 'entry', segment: 'consumer', fp16Tflops: 6.2, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX VEGA 56': { gamingScore: 14, aiScore: 4, tdp: 210, vramType: 'HBM2', recommendedPsuW: 650, releaseYear: 2017, tier: 'mainstream', segment: 'consumer', fp16Tflops: 21, slots: 2, powerConnector: '2x 8-pin' },
  'Radeon RX VEGA 64': { gamingScore: 15, aiScore: 5, tdp: 295, vramType: 'HBM2', recommendedPsuW: 750, releaseYear: 2017, tier: 'mainstream', segment: 'consumer', fp16Tflops: 25.3, slots: 2, powerConnector: '2x 8-pin' },
  'Radeon VII': { gamingScore: 19, aiScore: 8, tdp: 300, vramType: 'HBM2', recommendedPsuW: 750, releaseYear: 2019, tier: 'performance', segment: 'consumer', fp16Tflops: 27.7, slots: 2.5, powerConnector: '2x 8-pin' },

  // ---- AMD Radeon RX 5000 ----
  'Radeon RX 5500 XT': { gamingScore: 10, aiScore: 3, tdp: 130, vramType: 'GDDR6', recommendedPsuW: 450, releaseYear: 2019, tier: 'entry', segment: 'consumer', fp16Tflops: 10.4, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 5600 XT': { gamingScore: 14, aiScore: 4, tdp: 150, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2020, tier: 'mainstream', segment: 'consumer', fp16Tflops: 14.4, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 5700 XT': { gamingScore: 17, aiScore: 5, tdp: 225, vramType: 'GDDR6', recommendedPsuW: 600, releaseYear: 2019, tier: 'mainstream', segment: 'consumer', fp16Tflops: 19.5, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },

  // ---- AMD Radeon RX 6000 ----
  'Radeon RX 6400': { gamingScore: 6, aiScore: 2, tdp: 53, vramType: 'GDDR6', recommendedPsuW: 350, releaseYear: 2022, tier: 'entry', segment: 'consumer', fp16Tflops: 7.1, slots: 1, powerConnector: 'Alimenté par le slot PCIe' },
  'Radeon RX 6500 XT': { gamingScore: 7, aiScore: 2, tdp: 107, vramType: 'GDDR6', recommendedPsuW: 400, releaseYear: 2022, tier: 'entry', segment: 'consumer', fp16Tflops: 11.5, slots: 2, powerConnector: '1x 6-pin' },
  'Radeon RX 6600': { gamingScore: 13, aiScore: 6, tdp: 132, vramType: 'GDDR6', recommendedPsuW: 500, releaseYear: 2021, tier: 'entry', segment: 'consumer', fp16Tflops: 18, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 6600 XT': { gamingScore: 15, aiScore: 6, tdp: 160, vramType: 'GDDR6', recommendedPsuW: 500, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', fp16Tflops: 21, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 6650 XT': { gamingScore: 16, aiScore: 7, tdp: 180, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', fp16Tflops: 21, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 6700 XT': { gamingScore: 20, aiScore: 10, tdp: 230, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2021, tier: 'mainstream', segment: 'consumer', fp16Tflops: 26, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'Radeon RX 6750 XT': { gamingScore: 21, aiScore: 10, tdp: 250, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2022, tier: 'mainstream', segment: 'consumer', fp16Tflops: 26.6, slots: 2, powerConnector: '1x 8-pin + 1x 6-pin' },
  'Radeon RX 6800': { gamingScore: 27, aiScore: 13, tdp: 250, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2020, tier: 'performance', segment: 'consumer', fp16Tflops: 32, slots: 2, powerConnector: '2x 8-pin' },
  'Radeon RX 6800 XT': { gamingScore: 31, aiScore: 14, tdp: 300, vramType: 'GDDR6', recommendedPsuW: 750, releaseYear: 2020, tier: 'performance', segment: 'consumer', fp16Tflops: 41, slots: 2.5, powerConnector: '2x 8-pin' },
  'Radeon RX 6900 XT': { gamingScore: 34, aiScore: 15, tdp: 300, vramType: 'GDDR6', recommendedPsuW: 850, releaseYear: 2020, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 46, slots: 2.5, powerConnector: '2x 8-pin' },
  'Radeon RX 6950 XT': { gamingScore: 36, aiScore: 16, tdp: 335, vramType: 'GDDR6', recommendedPsuW: 850, releaseYear: 2022, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 47.3, slots: 2.5, powerConnector: '2x 8-pin' },

  // ---- AMD Radeon RX 7000 ----
  'Radeon RX 7600': { gamingScore: 16, aiScore: 9, tdp: 165, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2023, tier: 'entry', segment: 'consumer', fp16Tflops: 43, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 7600 XT': { gamingScore: 17, aiScore: 13, tdp: 190, vramType: 'GDDR6', recommendedPsuW: 600, releaseYear: 2024, tier: 'mainstream', segment: 'consumer', fp16Tflops: 45, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 7700 XT': { gamingScore: 27, aiScore: 14, tdp: 245, vramType: 'GDDR6', recommendedPsuW: 700, releaseYear: 2023, tier: 'performance', segment: 'consumer', fp16Tflops: 70, slots: 2, powerConnector: '2x 8-pin' },
  'Radeon RX 7800 XT': { gamingScore: 33, aiScore: 18, tdp: 263, vramType: 'GDDR6', recommendedPsuW: 700, releaseYear: 2023, tier: 'performance', segment: 'consumer', fp16Tflops: 74, slots: 2, powerConnector: '2x 8-pin' },
  'Radeon RX 7900 GRE': { gamingScore: 38, aiScore: 21, tdp: 260, vramType: 'GDDR6', recommendedPsuW: 700, releaseYear: 2023, tier: 'performance', segment: 'consumer', fp16Tflops: 92, slots: 2, powerConnector: '2x 8-pin' },
  'Radeon RX 7900 XT': { gamingScore: 47, aiScore: 27, tdp: 315, vramType: 'GDDR6', recommendedPsuW: 750, releaseYear: 2022, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 103, slots: 2.5, powerConnector: '2x 8-pin' },
  'Radeon RX 7900 XTX': { gamingScore: 55, aiScore: 32, tdp: 355, vramType: 'GDDR6', recommendedPsuW: 800, releaseYear: 2022, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 123, slots: 2.5, powerConnector: '2x 8-pin' },

  // ---- AMD Radeon RX 9000 ----
  'Radeon RX 9060 XT': { gamingScore: 26, aiScore: 18, tdp: 160, vramType: 'GDDR6', recommendedPsuW: 550, releaseYear: 2025, tier: 'mainstream', segment: 'consumer', fp16Tflops: 103, slots: 2, powerConnector: '1x 8-pin' },
  'Radeon RX 9070': { gamingScore: 43, aiScore: 25, tdp: 220, vramType: 'GDDR6', recommendedPsuW: 650, releaseYear: 2025, tier: 'performance', segment: 'consumer', fp16Tflops: 145, slots: 2.5, powerConnector: '2x 8-pin' },
  'Radeon RX 9070 XT': { gamingScore: 49, aiScore: 28, tdp: 304, vramType: 'GDDR6', recommendedPsuW: 750, releaseYear: 2025, tier: 'enthusiast', segment: 'consumer', fp16Tflops: 195, slots: 2.5, powerConnector: '2x 8-pin' },
}
