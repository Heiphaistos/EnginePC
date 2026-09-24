// Contenu éditorial : glossaire du matériel informatique (FR).

export interface GlossaryTerm {
  term: string
  definition: string
  category:
    | 'Processeur'
    | 'Carte graphique'
    | 'Mémoire'
    | 'Stockage'
    | 'Carte mère'
    | 'Alimentation'
    | 'Refroidissement'
    | 'Réseau'
    | 'Serveur'
    | 'IA'
    | 'Général'
}

export const GLOSSARY: GlossaryTerm[] = [
  // --- Processeur -------------------------------------------------------------
  {
    term: 'Socket',
    definition:
      'Connecteur de la carte mère qui reçoit le processeur. Processeur et carte mère doivent partager le même socket : AM5 pour les Ryzen 7000/8000/9000, LGA1851 pour les Intel Core Ultra 200S, LGA1700 pour les Core de 12e à 14e génération.',
    category: 'Processeur',
  },
  {
    term: 'AM5',
    definition:
      'Socket LGA d’AMD lancé en 2022 pour les Ryzen 7000 et suivants, exclusivement en DDR5 et compatible PCIe 5.0. AMD s’est engagé à le prendre en charge sur plusieurs générations, ce qui en fait une plateforme évolutive.',
    category: 'Processeur',
  },
  {
    term: 'LGA1851',
    definition:
      'Socket d’Intel introduit fin 2024 avec les Core Ultra 200S « Arrow Lake ». Il fonctionne en DDR5 uniquement, avec chipsets Z890, B860 et H810.',
    category: 'Processeur',
  },
  {
    term: 'TDP',
    definition:
      'Thermal Design Power : puissance thermique de référence qu’un système de refroidissement doit pouvoir dissiper. C’est une indication commerciale ; la consommation réelle sous charge peut être nettement supérieure (voir PPT et PL2).',
    category: 'Processeur',
  },
  {
    term: 'PPT',
    definition:
      'Package Power Tracking : limite de puissance électrique réelle d’un processeur AMD Ryzen. Elle vaut généralement 1,35 fois le TDP, par exemple 88 W pour un Ryzen de 65 W et 230 W pour un modèle de 170 W.',
    category: 'Processeur',
  },
  {
    term: 'PL1 / PL2',
    definition:
      'Limites de puissance des processeurs Intel : PL1 est la puissance soutenue sur la durée, PL2 la puissance maximale en boost. Sur un Core Ultra 9 285K, PL2 atteint 250 W par défaut.',
    category: 'Processeur',
  },
  {
    term: 'IPC',
    definition:
      'Instructions par cycle : quantité de travail qu’un cœur accomplit à chaque cycle d’horloge. À fréquence égale, une architecture à IPC plus élevée est plus rapide ; c’est ce que mesure la progression d’une génération à l’autre.',
    category: 'Processeur',
  },
  {
    term: 'SMT / Hyper-Threading',
    definition:
      'Technique permettant à un cœur physique d’exécuter deux fils d’instructions (threads) simultanément pour mieux utiliser ses ressources. AMD l’appelle SMT ; Intel l’a retirée des cœurs de ses Core Ultra 200S.',
    category: 'Processeur',
  },
  {
    term: 'P-cores / E-cores',
    definition:
      'Architecture hybride d’Intel mêlant cœurs performants (P-cores) pour les tâches lourdes et cœurs efficients (E-cores) pour le multitâche et l’arrière-plan. AMD utilise une approche proche avec ses cœurs Zen 5c compacts.',
    category: 'Processeur',
  },
  {
    term: 'X3D (3D V-Cache)',
    definition:
      'Processeurs AMD Ryzen dotés d’une puce de 64 Mo de cache L3 empilée sur un chiplet (96 Mo de L3 au total sur un Ryzen 7 9800X3D). Ce cache supplémentaire accélère fortement les jeux ; les Ryzen 7 9800X3D et Ryzen 9 9950X3D en sont les modèles phares.',
    category: 'Processeur',
  },
  {
    term: 'Cache L3',
    definition:
      'Mémoire très rapide intégrée au processeur et partagée entre les cœurs. Plus elle est grande, moins le processeur attend la RAM, ce qui profite particulièrement aux jeux et à certaines applications de calcul.',
    category: 'Processeur',
  },
  {
    term: 'iGPU',
    definition:
      'Processeur graphique intégré au processeur. Suffisant pour la bureautique et la vidéo, il devient capable de jouer sur les puces récentes (Radeon 890M, Arc 140V, Radeon 8060S des Ryzen AI Max).',
    category: 'Processeur',
  },
  {
    term: 'APU',
    definition:
      'Terme d’AMD désignant un processeur avec un iGPU performant, comme les Ryzen 8000G. Idéal pour des PC compacts sans carte graphique dédiée.',
    category: 'Processeur',
  },
  {
    term: 'NPU / TOPS',
    definition:
      'Le NPU est une unité dédiée à l’inférence d’IA à faible consommation, intégrée aux processeurs récents. Sa puissance s’exprime en TOPS (billions d’opérations par seconde) ; Windows exige 40 TOPS minimum pour le label Copilot+ PC.',
    category: 'Processeur',
  },

  // --- Carte graphique --------------------------------------------------------
  {
    term: 'GPU',
    definition:
      'Processeur graphique, cœur de la carte graphique. Il calcule les images des jeux et accélère le rendu 3D, le montage vidéo et l’intelligence artificielle.',
    category: 'Carte graphique',
  },
  {
    term: 'VRAM',
    definition:
      'Mémoire embarquée sur la carte graphique, qui stocke textures, tampons d’image et, en IA, les poids des modèles. Une VRAM insuffisante provoque saccades en jeu ou empêche de charger un modèle : 12 à 16 Go sont recommandés en 2026.',
    category: 'Carte graphique',
  },
  {
    term: 'GDDR7',
    definition:
      'Génération de mémoire graphique utilisée par les GeForce RTX 50, offrant jusqu’à environ 30 à 32 Gb/s par broche, soit 1,8 To/s sur une RTX 5090. Les Radeon RX 9000 et Intel Arc B utilisent encore de la GDDR6.',
    category: 'Carte graphique',
  },
  {
    term: 'HBM',
    definition:
      'High Bandwidth Memory : mémoire empilée placée à côté de la puce, offrant une bande passante de plusieurs To/s. Elle équipe les accélérateurs pour centres de données (NVIDIA B200/B300, AMD Instinct MI350) mais pas les cartes grand public.',
    category: 'Carte graphique',
  },
  {
    term: 'Ray tracing',
    definition:
      'Technique de rendu simulant le trajet de la lumière pour des reflets, ombres et éclairages réalistes. Le path tracing, sa forme la plus complète, est très exigeant et s’appuie sur l’upscaling pour rester jouable.',
    category: 'Carte graphique',
  },
  {
    term: 'DLSS / FSR / XeSS',
    definition:
      'Technologies d’upscaling de NVIDIA (DLSS 4), AMD (FSR 4, réservé aux RX 9000 dans sa version IA) et Intel (XeSS 2) : le jeu est calculé dans une définition inférieure puis agrandi par un algorithme, souvent assisté par IA, pour gagner des images par seconde.',
    category: 'Carte graphique',
  },
  {
    term: 'Génération d’images (Frame Generation)',
    definition:
      'Insertion d’images générées par IA entre les images réellement calculées, pour augmenter la fluidité perçue. Le DLSS 4 Multi Frame Generation des RTX 50 peut créer jusqu’à trois images par image rendue, au prix d’une latence légèrement accrue.',
    category: 'Carte graphique',
  },
  {
    term: 'TFLOPS',
    definition:
      'Mille milliards d’opérations en virgule flottante par seconde : mesure de la puissance de calcul théorique d’un GPU. Utile pour comparer des puces de même architecture, moins pertinent entre générations ou marques différentes.',
    category: 'Carte graphique',
  },
  {
    term: 'TGP / TBP',
    definition:
      'Total Graphics Power / Total Board Power : consommation maximale de la carte graphique. Sur portable, le TGP alloué par le constructeur fait varier fortement les performances d’un même GPU.',
    category: 'Carte graphique',
  },
  {
    term: 'Tensor cores',
    definition:
      'Unités de calcul matriciel des GPU NVIDIA, dédiées à l’IA (DLSS, inférence, entraînement). La 5e génération des RTX 50 prend en charge les formats FP8 et FP4.',
    category: 'Carte graphique',
  },
  {
    term: 'CUDA',
    definition:
      'Plateforme de calcul parallèle propriétaire de NVIDIA et désignation de ses unités de calcul (CUDA cores). C’est l’écosystème logiciel de référence en IA et en rendu GPU.',
    category: 'Carte graphique',
  },
  {
    term: 'ROCm',
    definition:
      'Pile logicielle open source d’AMD pour le calcul GPU, alternative à CUDA. Elle prend en charge PyTorch et llama.cpp sur les Radeon RX 7000/9000 et les Instinct, principalement sous Linux.',
    category: 'Carte graphique',
  },
  {
    term: 'Bus mémoire',
    definition:
      'Largeur (en bits) de la connexion entre le GPU et sa VRAM. Combinée à la vitesse de la mémoire, elle détermine la bande passante : 128 bits sur l’entrée de gamme, 256 bits sur le haut de gamme, 512 bits sur une RTX 5090.',
    category: 'Carte graphique',
  },

  // --- Mémoire ----------------------------------------------------------------
  {
    term: 'DDR5',
    definition:
      'Génération actuelle de mémoire vive des PC, de 4800 à plus de 8000 MT/s. Chaque barrette comporte deux sous-canaux de 32 bits et sa propre régulation de tension (PMIC).',
    category: 'Mémoire',
  },
  {
    term: 'MT/s',
    definition:
      'Mégatransferts par seconde : unité correcte de la vitesse de la mémoire DDR, souvent appelée à tort « MHz ». De la DDR5-6000 effectue 6000 millions de transferts par seconde.',
    category: 'Mémoire',
  },
  {
    term: 'CAS (CL)',
    definition:
      'Latence CAS : nombre de cycles entre une demande de lecture et la réponse de la mémoire. Elle se juge avec la fréquence : de la DDR5-6000 CL30 a une latence réelle de 10 ns, excellente pour AM5.',
    category: 'Mémoire',
  },
  {
    term: 'EXPO / XMP',
    definition:
      'Profils d’overclocking mémoire enregistrés dans la barrette (EXPO pour AMD, XMP pour Intel). Il faut les activer dans le BIOS pour que la RAM fonctionne à la vitesse annoncée au lieu de la vitesse JEDEC de base.',
    category: 'Mémoire',
  },
  {
    term: 'Dual channel',
    definition:
      'Fonctionnement de la mémoire sur deux canaux en parallèle, qui double la bande passante. Il faut installer au moins deux barrettes, dans les emplacements recommandés par le manuel (généralement A2 et B2).',
    category: 'Mémoire',
  },
  {
    term: 'ECC',
    definition:
      'Error-Correcting Code : mémoire capable de détecter et corriger les erreurs de bits. Recommandée pour les serveurs, NAS et stations de travail ; à ne pas confondre avec l’« on-die ECC » interne de toute barrette DDR5.',
    category: 'Mémoire',
  },
  {
    term: 'RDIMM',
    definition:
      'Registered DIMM : barrette serveur dotée d’un registre qui tamponne les signaux, permettant de très grandes capacités. Toujours ECC, elle n’est compatible qu’avec les plateformes serveur et HEDT (EPYC, Xeon, Threadripper).',
    category: 'Mémoire',
  },
  {
    term: 'UDIMM',
    definition:
      'Unbuffered DIMM : barrette standard des PC de bureau. Elle existe en version ECC pour les stations et serveurs d’entrée de gamme (EPYC 4004, Xeon E/6300, certaines cartes AM5).',
    category: 'Mémoire',
  },
  {
    term: 'CUDIMM',
    definition:
      'Barrette DDR5 intégrant un pilote d’horloge (CKD) qui stabilise le signal aux très hautes fréquences (8000 MT/s et plus). Prise en charge nativement par les Intel Core Ultra 200S.',
    category: 'Mémoire',
  },
  {
    term: 'SO-DIMM / CAMM2',
    definition:
      'Formats de mémoire pour portables et mini-PC. Le SO-DIMM est la barrette compacte classique ; le CAMM2 est un module plat plus récent, plus fin et plus rapide, qui reste remplaçable contrairement à la LPDDR5X soudée.',
    category: 'Mémoire',
  },
  {
    term: 'LPDDR5X',
    definition:
      'Mémoire basse consommation soudée sur la carte mère des portables et smartphones. Très rapide et économe, elle n’est en revanche pas évolutive.',
    category: 'Mémoire',
  },

  // --- Stockage ---------------------------------------------------------------
  {
    term: 'NVMe',
    definition:
      'Protocole de communication conçu pour les SSD connectés en PCIe, bien plus rapide et moins latent que l’ancien SATA/AHCI. La quasi-totalité des SSD M.2 actuels sont en NVMe.',
    category: 'Stockage',
  },
  {
    term: 'M.2',
    definition:
      'Format de connecteur et de carte compacte pour SSD (et Wi‑Fi). La longueur est indiquée par le nombre : 2230, 2242, 2280 (le plus courant) ou 22110. Un slot M.2 peut être NVMe, SATA ou les deux.',
    category: 'Stockage',
  },
  {
    term: 'SSD PCIe 4.0 / 5.0',
    definition:
      'Les SSD NVMe Gen4 atteignent environ 7 Go/s, les Gen5 de 10 à 14 Go/s. Le Gen5 profite surtout aux gros transferts de fichiers et aux stations de travail ; en jeu, la différence reste minime.',
    category: 'Stockage',
  },
  {
    term: 'TBW',
    definition:
      'Terabytes Written : volume total d’écriture garanti par le fabricant avant usure du SSD, par exemple 600 TBW pour un 1 To. À surveiller pour les serveurs, NAS et caches de montage.',
    category: 'Stockage',
  },
  {
    term: 'DRAM cache / HMB',
    definition:
      'Les SSD utilisent une petite mémoire pour la table de correspondance des données : soit une puce DRAM dédiée, soit une partie de la RAM du PC (HMB) sur les modèles sans DRAM. Les modèles avec DRAM tiennent mieux les charges lourdes.',
    category: 'Stockage',
  },
  {
    term: 'CMR / SMR',
    definition:
      'Deux techniques d’écriture des disques durs. Le CMR écrit des pistes indépendantes et convient aux NAS ; le SMR superpose partiellement les pistes pour gagner en capacité mais devient très lent en écriture soutenue et lors des reconstructions RAID.',
    category: 'Stockage',
  },
  {
    term: 'RAID',
    definition:
      'Regroupement de plusieurs disques pour gagner en performances (RAID 0), en redondance (RAID 1 miroir) ou les deux (RAID 5, 6, 10). Le RAID protège contre la panne d’un disque mais ne remplace jamais une sauvegarde.',
    category: 'Stockage',
  },
  {
    term: 'ZFS',
    definition:
      'Système de fichiers et gestionnaire de volumes avancé (TrueNAS, Proxmox) : sommes de contrôle, auto-réparation, snapshots, compression et RAIDZ. Il apprécie la RAM abondante et, idéalement, l’ECC.',
    category: 'Stockage',
  },
  {
    term: 'RAIDZ',
    definition:
      'Équivalent ZFS du RAID à parité : RAIDZ1 tolère la perte d’un disque, RAIDZ2 de deux, RAIDZ3 de trois. Le RAIDZ2 est recommandé avec des disques de grande capacité.',
    category: 'Stockage',
  },
  {
    term: 'U.2 / E1.S / E3.S',
    definition:
      'Formats de SSD NVMe pour serveurs, remplaçables à chaud et souvent dotés de protection contre les coupures (PLP). Le U.2 (2,5 pouces) reste courant ; les formats EDSFF (E1.S, E3.S) le remplacent dans les serveurs récents.',
    category: 'Stockage',
  },
  {
    term: 'HBA',
    definition:
      'Host Bus Adapter : carte d’extension qui ajoute des ports SATA/SAS en exposant les disques directement au système, sans RAID matériel. Les HBA LSI/Broadcom en mode IT sont la référence pour ZFS.',
    category: 'Stockage',
  },
  {
    term: 'PLP',
    definition:
      'Power Loss Protection : condensateurs qui permettent à un SSD d’entreprise de terminer ses écritures en cas de coupure. Ils améliorent aussi fortement les performances en écriture synchrone (ZFS, bases de données).',
    category: 'Stockage',
  },

  // --- Carte mère -------------------------------------------------------------
  {
    term: 'Chipset',
    definition:
      'Puce de la carte mère qui gère une partie des ports USB, SATA et lignes PCIe, et détermine les fonctions disponibles (overclocking, nombre de M.2). Exemples : B850 et X870E chez AMD, B860 et Z890 chez Intel.',
    category: 'Carte mère',
  },
  {
    term: 'PCIe 5.0',
    definition:
      'Génération actuelle du bus PCI Express, doublant le débit du PCIe 4.0 (environ 4 Go/s par ligne). Disponible pour les cartes graphiques et SSD sur AM5 (chipsets « E » et B850/X870) et LGA1851. Les normes sont rétrocompatibles.',
    category: 'Carte mère',
  },
  {
    term: 'Lignes PCIe',
    definition:
      'Liaisons de données fournies par le processeur et le chipset aux slots PCIe et M.2. Leur nombre limité impose parfois un partage : ajouter un SSD peut réduire le slot graphique de x16 à x8.',
    category: 'Carte mère',
  },
  {
    term: 'ATX / micro-ATX / mini-ITX',
    definition:
      'Formats standard de cartes mères, du plus grand au plus petit. Ils conditionnent le nombre de slots d’extension et d’emplacements mémoire, ainsi que le boîtier compatible.',
    category: 'Carte mère',
  },
  {
    term: 'VRM',
    definition:
      'Voltage Regulator Module : étage d’alimentation de la carte mère qui convertit le 12 V en tension adaptée au processeur. Un VRM robuste est nécessaire pour les processeurs haut de gamme et l’overclocking.',
    category: 'Carte mère',
  },
  {
    term: 'BIOS / UEFI',
    definition:
      'Micrologiciel de la carte mère qui initialise le matériel et permet de régler mémoire, ventilation et démarrage. Une mise à jour est parfois nécessaire pour reconnaître un processeur récent.',
    category: 'Carte mère',
  },
  {
    term: 'USB4 / Thunderbolt',
    definition:
      'Normes de connectique USB‑C à haut débit (40 à 80 Gb/s) capables de transporter données, vidéo et alimentation. Idéales pour les SSD externes rapides, les stations d’accueil et les écrans.',
    category: 'Carte mère',
  },

  // --- Alimentation -----------------------------------------------------------
  {
    term: 'ATX 3.1',
    definition:
      'Norme d’alimentation actuelle d’Intel, conçue pour supporter les pics de consommation transitoires des cartes graphiques modernes et intégrer le connecteur 12V‑2x6. C’est le choix recommandé pour un PC neuf.',
    category: 'Alimentation',
  },
  {
    term: '12V-2x6 / 12VHPWR',
    definition:
      'Connecteur 16 broches capable de fournir jusqu’à 600 W à une carte graphique, utilisé par les RTX 40 et 50. Le 12V‑2x6 est la révision améliorée du 12VHPWR ; il doit être enfoncé à fond et sans pliure serrée.',
    category: 'Alimentation',
  },
  {
    term: '80 PLUS',
    definition:
      'Certification de rendement des alimentations : Bronze, Silver, Gold, Platinum et Titanium. Une alimentation Gold convertit environ 90 % de l’énergie à mi-charge ; le reste est perdu en chaleur.',
    category: 'Alimentation',
  },
  {
    term: 'Cybenetics',
    definition:
      'Organisme de certification d’alimentations plus exigeant que le 80 PLUS, qui mesure le rendement (ETA) et le niveau sonore (LAMBDA) sur de nombreux points de charge.',
    category: 'Alimentation',
  },
  {
    term: 'SFX / SFX-L',
    definition:
      'Formats compacts d’alimentation destinés aux boîtiers mini-ITX. Malgré leur taille, les modèles récents atteignent 850 à 1200 W.',
    category: 'Alimentation',
  },
  {
    term: 'Alimentation modulaire',
    definition:
      'Alimentation dont les câbles se branchent à la demande, ce qui facilite le câblage et le flux d’air. Les câbles d’une marque ou d’un modèle ne sont jamais interchangeables avec ceux d’un autre.',
    category: 'Alimentation',
  },
  {
    term: 'Onduleur (UPS)',
    definition:
      'Appareil à batterie qui maintient l’alimentation lors d’une coupure et protège contre les surtensions. Indispensable pour un NAS ou un serveur, avec arrêt automatique piloté par USB (NUT).',
    category: 'Alimentation',
  },

  // --- Refroidissement --------------------------------------------------------
  {
    term: 'Ventirad',
    definition:
      'Refroidisseur à air composé d’un radiateur à caloducs et d’un ou deux ventilateurs. Simple, fiable et silencieux, un bon modèle double tour rivalise avec un watercooling de 240 mm.',
    category: 'Refroidissement',
  },
  {
    term: 'AIO',
    definition:
      'All-In-One : watercooling prêt à l’emploi et scellé, avec pompe, tuyaux et radiateur de 120 à 420 mm. Efficace pour les processeurs très gourmands et esthétique, il a une durée de vie limitée par sa pompe.',
    category: 'Refroidissement',
  },
  {
    term: 'Pâte thermique',
    definition:
      'Composé appliqué entre le processeur et son refroidisseur pour combler les micro-irrégularités et améliorer le transfert de chaleur. Une petite quantité suffit ; les pads à changement de phase sont une alternative durable.',
    category: 'Refroidissement',
  },
  {
    term: 'Flux d’air',
    definition:
      'Circulation de l’air dans le boîtier : l’air frais entre généralement par l’avant et le bas, l’air chaud sort par l’arrière et le haut. Une façade mesh améliore fortement les températures.',
    category: 'Refroidissement',
  },
  {
    term: 'Throttling',
    definition:
      'Réduction automatique de la fréquence d’un processeur ou d’un GPU lorsqu’il atteint sa limite de température ou de puissance, pour se protéger. Il traduit un refroidissement ou une alimentation insuffisants.',
    category: 'Refroidissement',
  },

  // --- Réseau -----------------------------------------------------------------
  {
    term: '2,5GbE / 10GbE',
    definition:
      'Ethernet à 2,5 ou 10 gigabits par seconde. Le 2,5GbE est standard sur les cartes mères récentes ; le 10GbE est utile pour un NAS, un serveur ou le montage vidéo en réseau.',
    category: 'Réseau',
  },
  {
    term: 'SFP+',
    definition:
      'Cage modulaire pour liaisons 10 Gb/s acceptant des câbles DAC en cuivre ou des modules optiques pour la fibre. Plus économe et plus souple que le 10GBASE-T en RJ45 ; le SFP28 monte à 25 Gb/s.',
    category: 'Réseau',
  },
  {
    term: 'Wi-Fi 7',
    definition:
      'Norme sans fil 802.11be, qui ajoute des canaux de 320 MHz en 6 GHz et le MLO (connexion simultanée sur plusieurs bandes) pour des débits et une latence améliorés.',
    category: 'Réseau',
  },
  {
    term: 'VLAN',
    definition:
      'Réseau local virtuel qui segmente un réseau physique en plusieurs réseaux isolés, par exemple pour séparer les objets connectés, les invités et les serveurs. Nécessite un switch administrable.',
    category: 'Réseau',
  },

  // --- Serveur ----------------------------------------------------------------
  {
    term: 'BMC / IPMI',
    definition:
      'Contrôleur de gestion intégré aux cartes mères serveur, accessible par le réseau même machine éteinte. Il permet de surveiller, redémarrer et prendre la main sur la console à distance (IPMI, Redfish).',
    category: 'Serveur',
  },
  {
    term: 'Rack 1U / 2U / 4U',
    definition:
      'Hauteur des serveurs montés en baie 19 pouces : 1U = 4,45 cm. Un serveur 1U est dense mais bruyant ; un 2U ou 4U accueille plus de disques et de cartes, avec des ventilateurs plus grands et plus silencieux.',
    category: 'Serveur',
  },
  {
    term: 'EPYC / Xeon',
    definition:
      'Gammes de processeurs serveur d’AMD et d’Intel, offrant de nombreux cœurs, beaucoup de lignes PCIe, la mémoire RDIMM ECC multicanal et des fonctions de fiabilité. Les EPYC 4004/4005 sur AM5 visent les petits serveurs.',
    category: 'Serveur',
  },
  {
    term: 'Hyperviseur',
    definition:
      'Logiciel qui crée et exécute des machines virtuelles en partageant le matériel. Les hyperviseurs de type 1 (Proxmox VE/KVM, VMware ESXi, Hyper-V, XCP-ng) s’installent directement sur le serveur.',
    category: 'Serveur',
  },
  {
    term: 'Proxmox VE',
    definition:
      'Plateforme de virtualisation open source basée sur Debian, combinant machines virtuelles KVM, conteneurs LXC, stockage ZFS/Ceph et clustering. Très populaire en homelab et en PME.',
    category: 'Serveur',
  },
  {
    term: 'Conteneur',
    definition:
      'Environnement isolé qui partage le noyau du système hôte (Docker, LXC, Podman). Bien plus léger qu’une machine virtuelle, il démarre en quelques secondes et consomme peu de RAM.',
    category: 'Serveur',
  },
  {
    term: 'Passthrough (IOMMU)',
    definition:
      'Attribution directe d’un périphérique physique (GPU, HBA, carte réseau) à une machine virtuelle. Nécessite la prise en charge de l’IOMMU (AMD-Vi, Intel VT-d) par le processeur et la carte mère.',
    category: 'Serveur',
  },
  {
    term: 'NAS',
    definition:
      'Network Attached Storage : serveur de stockage relié au réseau, qui centralise fichiers, sauvegardes et médias. Il peut être acheté clé en main (Synology, QNAP) ou monté soi-même (TrueNAS, Unraid).',
    category: 'Serveur',
  },
  {
    term: 'Sauvegarde 3-2-1',
    definition:
      'Règle de protection des données : 3 copies, sur 2 supports différents, dont 1 hors site. La variante 3-2-1-1-0 ajoute une copie hors ligne ou immuable et des restaurations testées sans erreur.',
    category: 'Serveur',
  },

  // --- IA ---------------------------------------------------------------------
  {
    term: 'LLM',
    definition:
      'Large Language Model : modèle de langage de grande taille (Llama, Mistral, Qwen, Gemma, gpt-oss…). Sa taille en milliards de paramètres et sa précision déterminent la mémoire nécessaire pour l’exécuter localement.',
    category: 'IA',
  },
  {
    term: 'Quantification',
    definition:
      'Réduction de la précision des poids d’un modèle (de 16 bits à 8, 5 ou 4 bits) pour diminuer la mémoire requise et accélérer l’inférence, avec une perte de qualité souvent faible. Un modèle 4 bits occupe environ quatre fois moins de place qu’en FP16.',
    category: 'IA',
  },
  {
    term: 'GGUF',
    definition:
      'Format de fichier de modèles quantifiés utilisé par llama.cpp, Ollama et LM Studio. Il fonctionne sur CPU et sur GPU NVIDIA, AMD, Intel et Apple, avec des niveaux comme Q4_K_M ou Q8_0.',
    category: 'IA',
  },
  {
    term: 'Inférence',
    definition:
      'Utilisation d’un modèle déjà entraîné pour produire un résultat (texte, image). C’est l’usage principal de l’IA locale, par opposition à l’entraînement ou au fine-tuning, bien plus gourmands.',
    category: 'IA',
  },
  {
    term: 'Tokens par seconde',
    definition:
      'Vitesse de génération d’un LLM. Elle dépend surtout de la bande passante mémoire (VRAM ou mémoire unifiée) : au-delà de 10 à 15 tokens/s, la lecture est confortable.',
    category: 'IA',
  },
  {
    term: 'Cache KV / contexte',
    definition:
      'Mémoire utilisée par un LLM pour garder la trace de la conversation. Elle croît avec la longueur du contexte et s’ajoute à la taille du modèle dans le calcul de la VRAM nécessaire.',
    category: 'IA',
  },
  {
    term: 'Mémoire unifiée',
    definition:
      'Mémoire partagée entre CPU et GPU dans une même puce (Apple M4/M5, AMD Ryzen AI Max). Elle permet de charger de très gros modèles d’IA, avec une bande passante inférieure à celle d’une carte graphique haut de gamme.',
    category: 'IA',
  },
  {
    term: 'LoRA',
    definition:
      'Low-Rank Adaptation : méthode de fine-tuning légère qui entraîne un petit module d’adaptation plutôt que tout le modèle. Très utilisée pour personnaliser Stable Diffusion, Flux ou un LLM sur un GPU grand public.',
    category: 'IA',
  },

  // --- Général ----------------------------------------------------------------
  {
    term: 'Goulot d’étranglement',
    definition:
      'Composant qui limite les performances de l’ensemble parce qu’il est plus lent que les autres, par exemple un processeur trop faible pour une carte graphique puissante en 1080p. Il dépend toujours de l’usage et de la définition.',
    category: 'Général',
  },
  {
    term: 'FPS',
    definition:
      'Images par seconde affichées par un jeu. 60 FPS assurent une bonne fluidité, 144 FPS et plus sont recherchés en jeu compétitif ; les 1 % low (images les plus lentes) reflètent mieux la sensation de saccade.',
    category: 'Général',
  },
  {
    term: 'Définition (1080p, 1440p, 4K)',
    definition:
      'Nombre de pixels de l’image : 1920 × 1080, 2560 × 1440 ou 3840 × 2160. La 4K compte quatre fois plus de pixels que le 1080p et sollicite donc bien davantage la carte graphique.',
    category: 'Général',
  },
  {
    term: 'Overclocking',
    definition:
      'Augmentation des fréquences d’un composant au-delà des spécifications d’origine pour gagner en performances, au prix d’une consommation et d’une chaleur accrues. L’undervolting fait l’inverse sur la tension pour gagner en efficacité.',
    category: 'Général',
  },
  {
    term: 'HT / TTC',
    definition:
      'Hors taxes et toutes taxes comprises. Le prix TTC inclut la TVA (20 % en France, 21 % en Belgique, 17 % au Luxembourg, 8,1 % en Suisse) ; les professionnels raisonnent généralement en HT.',
    category: 'Général',
  },
]
