import type { BuildSlots, CompatibilityIssue, ComponentCategory, DeviceType, PCComponent } from '../types'
import type { Catalog } from './catalog'
import { estimatePowerW, recommendedPsuW, resolveBuild, totalRamGB, type ResolvedBuild } from './resolve'

/** Sockets des plateformes serveur / station de travail qui exigent de la RDIMM ECC. */
export const RDIMM_SOCKETS = new Set(['sTR5', 'SP5', 'SP6', 'LGA4677', 'LGA4710'])

/** Les contrôleurs SAS4 (24G) Broadcom/Microchip gèrent aussi le NVMe (tri-mode). */
export const isTriMode = (h: { interface: string }) => h.interface === 'Tri-mode' || h.interface === 'SAS4'

/** Composants obligatoires par type de machine assemblée. */
export const REQUIRED: Record<'desktop' | 'server' | 'nas', ComponentCategory[]> = {
  desktop: ['cpu', 'motherboard', 'ram', 'storage', 'psu', 'case'],
  server: ['cpu', 'motherboard', 'ram', 'storage', 'psu', 'case'],
  nas: ['cpu', 'motherboard', 'ram', 'storage', 'psu', 'case'],
}

const issue = (severity: CompatibilityIssue['severity'], message: string, ...categories: ComponentCategory[]): CompatibilityIssue => ({
  severity,
  message,
  categories,
})

export function checkResolved(b: ResolvedBuild, deviceType: DeviceType = 'desktop'): CompatibilityIssue[] {
  const out: CompatibilityIssue[] = []
  const { cpu, motherboard: mb, ram, psu, cooler, gpus, storage } = b
  const pcCase = b.case

  // --- Processeur / carte mère
  if (cpu && mb) {
    if (cpu.socket !== mb.socket)
      out.push(issue('error', `Socket incompatible : le processeur est en ${cpu.socket}, la carte mère en ${mb.socket}.`, 'cpu', 'motherboard'))
    else if (!cpu.memoryTypes.includes(mb.memoryType))
      out.push(issue('error', `Le processeur ne supporte pas la ${mb.memoryType} de la carte mère.`, 'cpu', 'motherboard'))
  }

  // --- Mémoire
  if (ram && mb) {
    if (ram.memoryType !== mb.memoryType)
      out.push(issue('error', `Mémoire ${ram.memoryType} incompatible avec la carte mère (${mb.memoryType}).`, 'ram', 'motherboard'))
    const needsRdimm = RDIMM_SOCKETS.has(mb.socket)
    if (needsRdimm && !ram.registered)
      out.push(issue('error', `La plateforme ${mb.socket} exige de la mémoire RDIMM ECC (registered).`, 'ram', 'motherboard'))
    if (!needsRdimm && ram.registered)
      out.push(issue('error', 'La mémoire RDIMM (registered) n’est pas supportée par cette carte mère grand public.', 'ram', 'motherboard'))
    const sticks = ram.modules * b.ramKits
    if (sticks > mb.memorySlots)
      out.push(issue('error', `${sticks} barrettes pour seulement ${mb.memorySlots} emplacements mémoire.`, 'ram', 'motherboard'))
    if (totalRamGB(b) > mb.maxMemoryGB)
      out.push(issue('error', `Capacité mémoire (${totalRamGB(b)} Go) supérieure au maximum de la carte mère (${mb.maxMemoryGB} Go).`, 'ram', 'motherboard'))
    if (ram.ecc && !ram.registered && !mb.eccSupport)
      out.push(issue('warning', 'Mémoire ECC installée mais la carte mère ne garantit pas le mode ECC.', 'ram', 'motherboard'))
    if (!needsRdimm && sticks === 4 && ram.memoryType === 'DDR5')
      out.push(issue('info', '4 barrettes DDR5 : la fréquence sera probablement réduite. Préférez 2 barrettes de plus grande capacité.', 'ram'))
  }
  if (ram && cpu && cpu.maxMemoryGB && totalRamGB(b) > cpu.maxMemoryGB)
    out.push(issue('error', `Le processeur supporte au maximum ${cpu.maxMemoryGB} Go de mémoire.`, 'ram', 'cpu'))

  // --- Boîtier
  if (pcCase && mb && !pcCase.supportedFormFactors.includes(mb.formFactor))
    out.push(issue('error', `Le boîtier n’accepte pas le format ${mb.formFactor}.`, 'case', 'motherboard'))
  if (pcCase) {
    for (const g of gpus)
      if (g.lengthMm > pcCase.maxGpuLengthMm) {
        out.push(issue('error', `${g.chipset} trop longue (${g.lengthMm} mm > ${pcCase.maxGpuLengthMm} mm max).`, 'gpu', 'case'))
        break
      }
  }

  // --- Carte graphique
  if (mb && gpus.length > mb.pcieX16Slots)
    out.push(issue('error', `${gpus.length} cartes graphiques pour ${mb.pcieX16Slots} port(s) PCIe x16.`, 'gpu', 'motherboard'))
  if (gpus.length > 1 && gpus.some((g) => g.slots > 2) && deviceType !== 'server')
    out.push(issue('warning', 'Plusieurs GPU épais : vérifiez l’espacement des slots PCIe et le flux d’air.', 'gpu'))
  if (cpu && !cpu.integratedGraphics && gpus.length === 0) {
    if (mb?.ipmi) out.push(issue('info', 'Pas de GPU : l’affichage passera par le BMC/IPMI de la carte mère.', 'gpu'))
    else out.push(issue('error', 'Aucune sortie vidéo : ce processeur n’a pas d’iGPU, ajoutez une carte graphique.', 'gpu', 'cpu'))
  }

  // --- Refroidissement
  if (cooler && cpu) {
    if (!cooler.sockets.includes(cpu.socket))
      out.push(issue('error', `Le ventirad ne supporte pas le socket ${cpu.socket}.`, 'cooler', 'cpu'))
    if (cooler.maxTdp < cpu.tdp)
      out.push(issue('warning', `Refroidissement sous-dimensionné (${cooler.maxTdp} W pour un CPU de ${cpu.tdp} W).`, 'cooler', 'cpu'))
  }
  if (cooler && pcCase) {
    if (cooler.type === 'air' && cooler.heightMm && cooler.heightMm > pcCase.maxCoolerHeightMm)
      out.push(issue('error', `Ventirad trop haut (${cooler.heightMm} mm > ${pcCase.maxCoolerHeightMm} mm).`, 'cooler', 'case'))
    if (cooler.type === 'aio' && cooler.radiatorMm && cooler.radiatorMm > pcCase.maxRadiatorMm)
      out.push(issue('error', `Radiateur ${cooler.radiatorMm} mm non supporté (max ${pcCase.maxRadiatorMm} mm).`, 'cooler', 'case'))
  }
  if (cpu && !cooler) out.push(issue('warning', 'Aucun refroidissement processeur sélectionné.', 'cooler'))

  // --- Alimentation
  if (psu) {
    const need = estimatePowerW(b)
    const rec = recommendedPsuW(b)
    if (psu.wattage < need)
      out.push(issue('error', `Alimentation insuffisante : ${psu.wattage} W pour ~${need} W de consommation.`, 'psu'))
    else if (psu.wattage < rec)
      out.push(issue('warning', `Marge d’alimentation faible : ${rec} W recommandés.`, 'psu'))
    if (gpus.some((g) => g.powerConnector?.includes('12V')) && !psu.atx31)
      out.push(issue('info', 'GPU en 12V-2x6 : une alimentation ATX 3.1 est conseillée (sinon adaptateur).', 'psu', 'gpu'))
  }
  if (psu && pcCase) {
    if (pcCase.psuFormFactor === 'Redundant' && psu.formFactor !== 'Redundant')
      out.push(issue('error', 'Ce châssis serveur nécessite des alimentations redondantes dédiées.', 'psu', 'case'))
    else if (pcCase.psuFormFactor === 'SFX' && psu.formFactor !== 'SFX')
      out.push(issue('error', `Le boîtier n’accepte qu’une alimentation SFX.`, 'psu', 'case'))
    else if (pcCase.psuFormFactor === 'SFX-L' && !['SFX', 'SFX-L'].includes(psu.formFactor))
      out.push(issue('error', `Le boîtier n’accepte qu’une alimentation SFX / SFX-L.`, 'psu', 'case'))
    else if (pcCase.psuFormFactor === 'ATX' && psu.formFactor === 'Redundant')
      out.push(issue('error', 'Alimentation redondante incompatible avec ce boîtier.', 'psu', 'case'))
  }

  // --- Stockage
  const nvme = storage.filter((d) => d.kind === 'nvme').length
  const drives35 = storage.filter((d) => d.formFactorDrive === '3.5"').length
  const sata = storage.filter((d) => d.interface === 'SATA').length
  const sas = storage.filter((d) => d.interface === 'SAS').length
  const u2 = storage.filter((d) => d.interface === 'U.2').length
  if (mb && nvme > mb.m2Slots)
    out.push(issue('warning', `${nvme} SSD NVMe pour ${mb.m2Slots} emplacement(s) M.2 : prévoyez une carte adaptatrice.`, 'storage', 'motherboard'))
  if (pcCase && drives35 > pcCase.driveBays35)
    out.push(issue('error', `${drives35} disques 3,5" pour ${pcCase.driveBays35} baie(s).`, 'storage', 'case'))
  const sataPorts = (mb?.sataPorts ?? 0) + (b.hba ? b.hba.ports : 0)
  if (mb && sata + sas > sataPorts)
    out.push(issue('error', `${sata + sas} disques SATA/SAS pour ${sataPorts} port(s) disponibles : ajoutez un HBA.`, 'storage', 'hba'))
  if (sas > 0 && !b.hba) out.push(issue('error', 'Les disques SAS nécessitent un contrôleur HBA/RAID.', 'storage', 'hba'))
  if (u2 > 0 && !(b.hba && isTriMode(b.hba)))
    out.push(issue('warning', 'Les SSD U.2 nécessitent un backplane, un HBA Tri-mode ou un adaptateur PCIe.', 'storage', 'hba'))

  // --- Conseils par type de machine
  if ((deviceType === 'server' || deviceType === 'nas') && ram && !ram.ecc)
    out.push(issue('info', 'Pour un serveur/NAS, la mémoire ECC est fortement recommandée.', 'ram'))
  if (deviceType === 'nas' && storage.length > 0 && storage.filter((d) => d.kind === 'hdd' && !d.nasRated).length > 0)
    out.push(issue('warning', 'Certains disques ne sont pas certifiés NAS (24/7, CMR).', 'storage'))

  return out
}

export function checkBuild(slots: BuildSlots, catalog: Catalog, deviceType: DeviceType = 'desktop'): CompatibilityIssue[] {
  const resolved = resolveBuild(slots, catalog)
  const out = checkResolved(resolved, deviceType)
  if (deviceType === 'desktop' || deviceType === 'server' || deviceType === 'nas') {
    const missing = REQUIRED[deviceType].filter((cat) => {
      const v = slots[cat as keyof BuildSlots]
      return Array.isArray(v) ? v.length === 0 : !v
    })
    if (missing.length) out.unshift(issue('info', `Composants manquants : ${missing.length}`, ...missing))
  }
  return out
}

/**
 * Indique si un composant candidat est compatible avec le reste de la configuration.
 * Renvoie les erreurs bloquantes qu'il introduirait.
 */
export function candidateErrors(
  candidate: PCComponent,
  slots: BuildSlots,
  catalog: Catalog,
  deviceType: DeviceType = 'desktop',
): CompatibilityIssue[] {
  const next = withComponent(slots, candidate, 'replace')
  const b = resolveBuild(next, catalog)
  return checkResolved(b, deviceType).filter(
    (i) => i.severity === 'error' && i.categories.includes(candidate.category) && !(i.categories.length === 1 && candidate.category === 'gpu' && i.message.startsWith('Aucune sortie')),
  )
}

/** Place un composant dans le bon emplacement. Pour GPU/stockage : 'replace' ou 'add'. */
export function withComponent(slots: BuildSlots, c: PCComponent, mode: 'replace' | 'add' = 'replace'): BuildSlots {
  const next: BuildSlots = { ...slots }
  if (c.category === 'gpu' || c.category === 'storage') {
    const current = slots[c.category] ?? []
    next[c.category] = mode === 'add' ? [...current, c.id] : [c.id, ...current.slice(1)]
  } else {
    next[c.category] = c.id
  }
  return next
}

export function hasBlockingIssues(issues: CompatibilityIssue[]): boolean {
  return issues.some((i) => i.severity === 'error')
}

/**
 * Complète les emplacements obligatoires manquants avec le composant compatible le moins cher,
 * sans toucher aux choix existants.
 */
export function autoComplete(slots: BuildSlots, catalog: Catalog, deviceType: 'desktop' | 'server' | 'nas'): BuildSlots {
  let next: BuildSlots = { ...slots }
  const order: ComponentCategory[] = ['cpu', 'motherboard', 'ram', 'storage', 'cooler', 'gpu', 'case', 'psu']
  for (const cat of order) {
    const current = next[cat as keyof BuildSlots]
    if (Array.isArray(current) ? current.length : current) continue
    if (cat === 'gpu') {
      const r = resolveBuild(next, catalog)
      if (!r.cpu || r.cpu.integratedGraphics || r.motherboard?.ipmi) continue
    }
    const cands = [...(catalog.byCategory.get(cat) ?? [])].sort((a, b) => a.price - b.price)
    const pick = cands.find((c) => {
      if (candidateErrors(c, next, catalog, deviceType).length) return false
      if (cat === 'psu') {
        const r = resolveBuild(withComponent(next, c), catalog)
        return (c as { wattage: number }).wattage >= recommendedPsuW(r)
      }
      if (cat === 'cooler') {
        const cpu = resolveBuild(next, catalog).cpu
        return !cpu || (c as { maxTdp: number }).maxTdp >= cpu.tdp
      }
      return true
    })
    if (pick) next = withComponent(next, pick)
  }
  return next
}
