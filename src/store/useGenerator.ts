import { useEffect, useRef, useState } from 'react'
import type { BuildVariant, GeneratorInput } from '../engine/generator'
import type { WorkerRequest } from '../engine/generator.worker'
import { useStore } from './useStore'

/** Génération des variantes dans un Web Worker : l'interface reste fluide pendant le calcul. */
export function useGeneratedVariants(input: GeneratorInput | null): { variants: BuildVariant[]; loading: boolean } {
  const workerRef = useRef<Worker | null>(null)
  const reqId = useRef(0)
  const sentCustom = useRef<unknown>(null)
  const customComponents = useStore((s) => s.customComponents)
  const customDevices = useStore((s) => s.customDevices)
  const [state, setState] = useState<{ variants: BuildVariant[]; doneId: number }>({ variants: [], doneId: 0 })
  const [pendingId, setPendingId] = useState(0)
  const key = JSON.stringify(input)

  useEffect(() => {
    const w = new Worker(new URL('../engine/generator.worker.ts', import.meta.url), { type: 'module' })
    w.onmessage = (e: MessageEvent<{ id: number; variants: BuildVariant[] }>) => {
      if (e.data.id === reqId.current) setState({ variants: e.data.variants, doneId: e.data.id })
    }
    workerRef.current = w
    sentCustom.current = null
    return () => w.terminate()
  }, [])

  useEffect(() => {
    if (!input || !workerRef.current) return
    const id = ++reqId.current
    const custom = customComponents.length || customDevices.length ? { components: customComponents, devices: customDevices } : undefined
    const msg: WorkerRequest = { id, input }
    if (sentCustom.current !== custom) {
      msg.custom = custom ?? { components: [], devices: [] }
      sentCustom.current = custom
    }
    workerRef.current.postMessage(msg)
    setPendingId(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, customComponents, customDevices])

  return { variants: input ? state.variants : [], loading: !!input && state.doneId !== pendingId }
}
