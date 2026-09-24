/// <reference lib="webworker" />
import { baseComponents, baseDevices } from '../data/catalog'
import type { Device, PCComponent } from '../types'
import { createCatalog, type Catalog } from './catalog'
import { generateVariants, type GeneratorInput } from './generator'

export interface WorkerRequest {
  id: number
  input: GeneratorInput
  custom?: { components: PCComponent[]; devices: Device[] }
}

let catalog: Catalog = createCatalog(baseComponents, baseDevices)

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, input, custom } = e.data
  if (custom) {
    const comp = new Map(baseComponents.map((c) => [c.id, c]))
    custom.components.forEach((c) => comp.set(c.id, c))
    const dev = new Map(baseDevices.map((d) => [d.id, d]))
    custom.devices.forEach((d) => dev.set(d.id, d))
    catalog = createCatalog([...comp.values()], [...dev.values()])
  }
  self.postMessage({ id, variants: generateVariants(catalog, input) })
}
