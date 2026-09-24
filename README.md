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

## Données

| Source | Contenu | Accès |
|---|---|---|
| Catalogue vérifié (`src/data/catalog/`) | ~480 composants avec compatibilité et scores complets, ~340 appareils (115 smartphones, 123 portables, 58 tablettes, 40 NAS) | intégré, utilisé par le générateur |
| [pc-part-dataset](https://github.com/docyx/pc-part-dataset) (MIT) | ~13 700 pièces PC et périphériques (CPU, GPU, cartes mères, RAM, SSD/HDD, alims, boîtiers, ventirads, écrans, claviers, souris, casques, onduleurs…) | `npm run sync` → `public/data/extra-catalog.json` |
| BCE / [Frankfurter](https://frankfurter.app) | taux de change quotidiens (affichage multi-devises) | API gratuite sans clé + instantané `public/data/rates.json` |
| Wikipédia | description et photo dans les fiches produit | API REST publique |
| Marchands (Idealo, LDLC, Materiel.net, Amazon…) | liens de recherche depuis chaque fiche | liens, sans API |

Les produits de la base ouverte sont marqués « Base ouverte » : prix US convertis en euros TTC, et certaines
caractéristiques (dimensions, sockets des ventirads…) sont estimées. Les règles de compatibilité qui en dépendent
deviennent des avertissements « à vérifier ». Le générateur automatique n'utilise que le catalogue vérifié.
Les prix réels viennent du comparateur une fois connecté ([docs/INTEGRATION.md](docs/INTEGRATION.md)).

## Développement

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # tests du moteur (compatibilité, générateur, catalogue, base ouverte)
npm run sync     # régénère public/data/ depuis les sources ouvertes
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
