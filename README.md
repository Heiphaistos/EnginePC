# EnginePC

Configurateur intelligent de **PC fixes, PC portables, serveurs, NAS, tablettes et smartphones**.
Génération automatique de la meilleure configuration selon l'usage et le budget, ou configuration manuelle
avec vérification de compatibilité et aperçu des performances en temps réel.

Production : https://enginepc.heiphaistos.org

## Fonctionnalités

- **Générateur automatique** : type d'appareil + usage + budget + préférences → 4 propositions
  (Économique, Recommandée, Premium, Alternative AMD/Intel), recalculées en direct (Web Worker).
- **Configurateur manuel** : choix composant par composant, seuls les composants compatibles sont proposés,
  « compléter au moins cher », multi-GPU, multi-disques, kits RAM multiples.
- **Moteur de compatibilité** : socket, type de mémoire, RDIMM/UDIMM/ECC, capacité et nombre de slots,
  format carte mère/boîtier, longueur GPU, hauteur ventirad/radiateur, TDP, puissance et format
  d'alimentation (ATX/SFX/redondante), ports M.2/SATA, HBA pour SAS/U.2, baies 3,5", sortie vidéo.
- **Profils d'usage** : Gaming, IA & Machine Learning, Station de travail, Streaming, Développement,
  Bureautique, Multimédia, Homelab, Virtualisation, Stockage, Mobilité.
- **Aperçu temps réel** : score par usage, FPS estimés 1080p/1440p/4K (goulot CPU inclus), taille de LLM
  exécutable en VRAM, tokens/s indicatifs, consommation et alimentation conseillée.
- **Appareils complets** : portables, tablettes, smartphones et NAS clé en main classés par usage.
- **Exports** : JSON (format d'échange), CSV Excel, Markdown, impression/PDF, lien de partage.
- **Mes configs** : sauvegarde locale, import JSON, comparaison côte à côte (jusqu'à 4).
- **Comparateur de prix** : prix live, liens produits et envoi de configurations — voir
  [docs/INTEGRATION.md](docs/INTEGRATION.md).
- Thème sombre/clair, responsive mobile.

## Catalogue

~475 composants (CPU grand public/HEDT/serveur, GPU grand public/pro/datacenter, cartes mères de tous
sockets, RAM DDR4/DDR5/RDIMM, SSD/HDD grand public et entreprise, alimentations, boîtiers tour/ITX/NAS/rack,
refroidissements, cartes réseau, HBA/RAID) et ~160 appareils complets, dans `src/data/catalog/`.
Prix **indicatifs** en euros : les prix réels viennent du comparateur une fois connecté. Le catalogue
s'étend sans toucher au code via l'import JSON (Paramètres) ou la synchronisation `/api/v1/catalog`.

## Développement

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # tests du moteur (compatibilité, générateur, catalogue)
npm run build    # build de production dans dist/
```

## Structure

```
src/
  types/            modèle de données
  data/catalog/     catalogue de composants et d'appareils
  data/profiles.ts  types d'appareils et profils d'usage
  engine/           compatibilité, scoring, générateur (+ worker), résolution
  services/         fournisseurs de prix (statique / HTTP comparateur)
  store/            état (zustand, persistance locale), hooks catalogue/prix/générateur
  lib/              exports, formatage, specs
  pages/, components/  interface React + Tailwind
deploy/             nginx, script de déploiement
docs/               intégration comparateur, déploiement VPS
```

## Déploiement

Voir [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md) (nginx + Let's Encrypt ou Docker).
