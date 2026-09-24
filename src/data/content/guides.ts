// Contenu éditorial : guides d'achat et de configuration (FR).
// Données pures, sans dépendance React.

export interface GuideSection {
  heading: string
  paragraphs: string[]
  tips?: string[]
}

export interface Guide {
  slug: string
  title: string
  excerpt: string
  icon: string
  readingMinutes: number
  updated: string
  cta: { label: string; to: string }
  sections: GuideSection[]
}

export const GUIDES: Guide[] = [
  // ---------------------------------------------------------------------------
  {
    slug: 'choisir-pc-gamer-2026',
    title: 'Bien choisir un PC gamer en 2026',
    excerpt:
      "Quel processeur, quelle carte graphique et combien de RAM pour jouer en 1080p, 1440p ou 4K ? Nos recommandations par palier de budget : 800, 1200, 2000 et 3500 €.",
    icon: 'Gamepad2',
    readingMinutes: 12,
    updated: '2026-09-24',
    cta: { label: 'Générer un PC gamer', to: '/generer?type=desktop&profile=gaming&budget=1200' },
    sections: [
      {
        heading: 'Les priorités d’un PC de jeu',
        paragraphs: [
          "Dans un PC gamer, la carte graphique reste le composant qui détermine le plus les performances : c’est elle qui calcule l’image, et c’est donc elle qui fixe la définition et le niveau de détails jouables. En règle générale, on lui consacre 35 à 45 % du budget total. Le processeur vient ensuite : il doit être assez rapide pour ne pas brider le GPU, surtout en 1080p et dans les jeux compétitifs à haut taux de rafraîchissement, où c’est lui qui limite le nombre d’images par seconde.",
          "En 2026, les deux plateformes de référence sont l’AM5 d’AMD (Ryzen 7000, 8000G et 9000, dont les X3D à cache 3D V-Cache) et le LGA1851 d’Intel (Core Ultra 200S « Arrow Lake »). L’AM5 a l’avantage d’une longévité annoncée par AMD et de processeurs X3D qui dominent les classements en jeu ; l’Intel Core Ultra est intéressant en productivité et en consommation au repos, mais un peu en retrait en jeu à prix égal.",
          "Côté mémoire, la DDR5 est désormais la norme sur les deux plateformes. 32 Go (2 × 16 Go) sont le bon choix pour un PC de jeu moderne : 16 Go suffisent encore dans beaucoup de titres, mais les jeux récents, le navigateur et Discord ouverts en parallèle dépassent vite ce seuil. Visez de la DDR5-6000 CL30 sur AM5 (le « sweet spot » de l’Infinity Fabric) et de la DDR5-6400 à 8000 sur LGA1851. Attention : les prix de la mémoire ont fortement augmenté depuis fin 2025 à cause de la demande liée à l’IA, il faut donc surveiller ce poste.",
        ],
        tips: [
          "Choisissez d’abord la définition et la fréquence de votre écran : c’est lui qui dicte le GPU nécessaire.",
          "Un SSD NVMe PCIe 4.0 de 1 To est le minimum confortable ; 2 To si vous jouez à de nombreux jeux AAA (souvent 100 à 150 Go chacun).",
          "Activez le profil EXPO (AMD) ou XMP (Intel) dans le BIOS, sinon la RAM tourne à sa fréquence JEDEC de base.",
        ],
      },
      {
        heading: 'Budget 800 € : le 1080p efficace',
        paragraphs: [
          "À 800 €, l’objectif est de jouer confortablement en 1080p, en détails élevés, à 60-100 images par seconde dans la plupart des jeux récents. La carte graphique type de ce palier est une Radeon RX 9060 XT 8 Go, une GeForce RTX 5060 ou une Intel Arc B580 12 Go, cette dernière offrant plus de VRAM pour le prix. Associez-la à un Ryzen 5 7600 / 9600 ou à un Ryzen 5 7500F, qui restent excellents en jeu, sur une carte mère B650 d’entrée de gamme.",
          "Pour tenir le budget, on accepte quelques compromis : 16 Go de DDR5 (en prévoyant deux emplacements libres ou un kit 2 × 16 Go si les prix le permettent), un SSD NVMe Gen4 de 1 To sans dissipateur haut de gamme, un boîtier simple mais bien ventilé et une alimentation 550-650 W certifiée 80 PLUS Bronze ou Gold d’une marque reconnue. Ne sacrifiez jamais l’alimentation : c’est elle qui protège tout le reste.",
          "Avec 8 Go de VRAM, certains jeux très récents demandent de baisser la qualité des textures. C’est la principale limite de ce palier ; si vous gardez votre PC longtemps, une carte avec 12 ou 16 Go (Arc B580, RX 9060 XT 16 Go, RTX 5060 Ti 16 Go) est un meilleur investissement, quitte à économiser ailleurs.",
        ],
        tips: [
          "L’upscaling (FSR 4, DLSS 4, XeSS 2) permet de gagner 30 à 60 % d’images par seconde avec une perte de qualité minime.",
          "Un ventirad tour à 25-35 € refroidit sans problème un Ryzen 5 de 65 W.",
        ],
      },
      {
        heading: 'Budget 1200 € : le 1440p sans compromis',
        paragraphs: [
          "Le palier 1200 € est le plus équilibré du marché : il ouvre la porte au 1440p à haut taux de rafraîchissement. La carte graphique cible est une RTX 5060 Ti 16 Go, une RX 9070 ou, en cherchant les promotions, une RTX 5070. Le processeur peut rester un Ryzen 5 9600X, ou monter vers un Ryzen 7 7800X3D si une bonne affaire se présente : le cache 3D fait une vraie différence dans les jeux gourmands en CPU (simulation, MMO, stratégie, e-sport à 240 Hz).",
          "La configuration mémoire passe à 32 Go de DDR5-6000 CL30 et le stockage à 1 ou 2 To en NVMe Gen4 performant (avec cache DRAM ou HMB bien implémenté). Une carte mère B650 ou B850 avec un bon étage d’alimentation et un Wi‑Fi 6E/7 intégré évite d’ajouter une carte réseau. Prévoyez une alimentation de 650 à 750 W 80 PLUS Gold, idéalement ATX 3.1.",
          "À ce niveau, le boîtier et le refroidissement méritent un peu d’attention : un boîtier à façade mesh avec deux ou trois ventilateurs de 140 mm et un ventirad double tour ou un bon ventirad simple tour permettent un PC à la fois frais et silencieux.",
        ],
        tips: [
          "En 1440p, 16 Go de VRAM constituent une assurance pour les années à venir.",
          "Préférez une carte mère avec au moins deux slots M.2 pour ajouter du stockage plus tard sans câble.",
        ],
      },
      {
        heading: 'Budget 2000 € : haute fréquence et 4K upscalée',
        paragraphs: [
          "Avec 2000 €, on vise le 1440p à 144 Hz et plus en détails maximum avec ray tracing, ou la 4K grâce à l’upscaling. Les cartes typiques sont la RTX 5070 Ti 16 Go et la RX 9070 XT 16 Go, deux GPU très proches en rastérisation ; NVIDIA garde l’avantage en path tracing et avec la génération d’images multiple (DLSS 4 Multi Frame Generation), AMD propose souvent un meilleur rapport prix/performances.",
          "Le processeur roi du jeu est ici le Ryzen 7 9800X3D (ou son successeur 9850X3D selon disponibilité), qui supprime quasiment tout goulot d’étranglement CPU. Côté Intel, un Core Ultra 7 265K convient si vous faites aussi beaucoup de productivité. Carte mère B850 ou X870 (USB4, PCIe 5.0 pour le GPU et au moins un M.2 Gen5), 32 Go DDR5-6000 CL30 et 2 To de NVMe complètent l’ensemble.",
          "Une alimentation de 750 à 850 W 80 PLUS Gold ATX 3.1 avec connecteur natif 12V‑2x6 est recommandée pour les cartes NVIDIA. Pour le refroidissement, un ventirad double tour haut de gamme ou un AIO 240/280 mm conviennent au 9800X3D, dont la consommation reste raisonnable en jeu (souvent sous 100 W).",
        ],
        tips: [
          "Un SSD PCIe 5.0 n’apporte presque rien en jeu aujourd’hui : un bon Gen4 suffit, gardez la différence pour le GPU.",
          "Vérifiez la longueur maximale de carte graphique supportée par le boîtier : beaucoup de 5070 Ti dépassent 30 cm.",
        ],
      },
      {
        heading: 'Budget 3500 € : le très haut de gamme',
        paragraphs: [
          "À 3500 €, on entre dans le domaine de la 4K native à haute fréquence et du path tracing. La RTX 5080 16 Go est le choix raisonnable du palier ; la RTX 5090 32 Go reste hors catégorie mais son prix (souvent bien au-delà de 2500 € à elle seule) la réserve aux budgets encore supérieurs ou aux usages mixtes jeu + IA. Le processeur est un Ryzen 7 9800X3D pour le jeu pur, ou un Ryzen 9 9950X3D si vous faites aussi du rendu, du montage ou de la compilation.",
          "La plateforme monte en gamme : carte mère X870E avec deux M.2 PCIe 5.0, 10 GbE ou 5 GbE selon les modèles, Wi‑Fi 7, et 32 à 64 Go de DDR5 en deux barrettes seulement (quatre barrettes DDR5 imposent souvent de baisser la fréquence). Le stockage peut combiner un SSD Gen5 rapide pour le système et un NVMe Gen4 de 4 To pour la bibliothèque de jeux.",
          "Le dimensionnement électrique et thermique devient crucial : une RTX 5090 consomme jusqu’à 575 W, une RTX 5080 environ 360 W. Prévoyez 1000 W (5080) à 1200 W (5090) en 80 PLUS Gold ou Platinum ATX 3.1, un boîtier très bien ventilé et, pour le CPU, un AIO 360 mm ou un ventirad haut de gamme. Soignez le branchement du câble 12V‑2x6 : il doit être enfoncé à fond et sans pliure serrée près du connecteur.",
        ],
        tips: [
          "À ce budget, investissez aussi dans l’écran : un OLED 4K 240 Hz ou 1440p 360 Hz exploite vraiment ce matériel.",
          "Contrôlez les températures sous charge prolongée avec HWiNFO dès la première semaine.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'pc-ia-locale',
    title: 'Monter un PC pour l’IA locale (LLM, Stable Diffusion, Flux)',
    excerpt:
      "Faire tourner des modèles de langage et de génération d’images chez soi : pourquoi la VRAM prime sur tout, comment fonctionne la quantification et quel GPU choisir entre NVIDIA, AMD et Apple.",
    icon: 'BrainCircuit',
    readingMinutes: 13,
    updated: '2026-09-24',
    cta: { label: 'Générer un PC pour l’IA', to: '/generer?type=desktop&profile=ai&budget=2500' },
    sections: [
      {
        heading: 'La VRAM, ressource numéro un',
        paragraphs: [
          "Pour l’inférence locale, la quantité de mémoire vidéo détermine la taille des modèles que vous pouvez charger entièrement sur le GPU. Un modèle de langage de N milliards de paramètres occupe environ 2 × N Go en FP16, N Go en 8 bits et environ 0,55 à 0,6 × N Go en 4 bits (format Q4_K_M de llama.cpp par exemple). Il faut ajouter la mémoire du contexte (cache KV), qui grossit avec la longueur de la conversation : quelques Go supplémentaires pour 32 000 tokens sur un modèle de taille moyenne.",
          "Concrètement : 12 Go de VRAM permettent des modèles de 7 à 14 milliards de paramètres quantifiés en 4 bits ; 16 Go ouvrent la porte aux modèles de 20 à 24 milliards ; 24 Go (RTX 3090, RTX 4090) et 32 Go (RTX 5090, Radeon AI PRO R9700) autorisent les modèles de 27 à 32 milliards avec un contexte confortable. Les modèles de 70 milliards demandent 40 à 48 Go, soit deux cartes, une carte professionnelle ou une machine à mémoire unifiée.",
          "Lorsque le modèle ne tient pas dans la VRAM, les outils comme llama.cpp, Ollama ou LM Studio peuvent déporter une partie des couches sur la RAM système, mais les performances chutent fortement : la bande passante de la DDR5 (environ 60 à 90 Go/s en dual channel) est dix à vingt fois inférieure à celle de la GDDR7. Les modèles MoE (mixture of experts) récents tolèrent mieux ce déport, car seule une fraction des paramètres est active à chaque token.",
        ],
        tips: [
          "Règle rapide : taille du fichier GGUF + 1 à 4 Go pour le contexte = VRAM nécessaire.",
          "La vitesse de génération dépend surtout de la bande passante mémoire, pas seulement des TFLOPS.",
        ],
      },
      {
        heading: 'Comprendre la quantification',
        paragraphs: [
          "La quantification consiste à stocker les poids du modèle avec moins de bits : 8, 6, 5, 4 voire 3 bits au lieu de 16. Le fichier est beaucoup plus léger et l’inférence plus rapide, au prix d’une légère perte de qualité. En pratique, le 8 bits est quasi indiscernable de l’original, le 5-6 bits reste excellent, et le 4 bits (Q4_K_M, AWQ, GPTQ, EXL2/EXL3) offre le meilleur compromis pour la plupart des usages. En dessous de 4 bits, la dégradation devient visible, surtout sur les petits modèles.",
          "Il existe plusieurs familles de formats : GGUF (llama.cpp, Ollama, LM Studio) est le plus universel et fonctionne sur CPU, NVIDIA, AMD, Intel et Apple ; EXL2/EXL3 (ExLlama) et AWQ/GPTQ (vLLM) visent les GPU NVIDIA et privilégient le débit. Les GPU récents supportent aussi nativement des formats à virgule flottante réduite : FP8 sur Ada et Blackwell, FP4 (NVFP4) sur les RTX 50, ce qui accélère encore l’inférence avec une bonne qualité.",
          "Pour la génération d’images, la quantification existe aussi : Flux.1 dev pèse environ 24 Go en FP16 mais tourne sur 12 à 16 Go en FP8 ou en GGUF Q8/Q5. Stable Diffusion XL se contente de 8 Go, tandis que les modèles vidéo récents (Wan, HunyuanVideo, LTX) réclament 16 à 32 Go pour des résultats confortables.",
        ],
        tips: [
          "Commencez en Q4_K_M ou Q5_K_M, puis montez en précision si la VRAM le permet.",
          "Un modèle plus grand en 4 bits est généralement meilleur qu’un modèle plus petit en 8 bits.",
        ],
      },
      {
        heading: 'NVIDIA, AMD, Intel ou Apple ?',
        paragraphs: [
          "NVIDIA reste la référence grâce à l’écosystème CUDA : quasiment tous les outils (PyTorch, ComfyUI, vLLM, TensorRT, entraînement LoRA) fonctionnent sans effort, et les Tensor cores de 5e génération des RTX 50 accélèrent FP8 et FP4. Les cartes à privilégier sont la RTX 5060 Ti 16 Go (entrée de gamme très intéressante), la RTX 5070 Ti / 5080 16 Go, la RTX 5090 32 Go et, sur le marché de l’occasion, la RTX 3090 24 Go, toujours prisée pour son rapport VRAM/prix.",
          "AMD a beaucoup progressé avec ROCm, désormais pris en charge sous Linux et partiellement sous Windows pour les Radeon RX 9000 (RDNA 4). La RX 9070 XT 16 Go et la Radeon AI PRO R9700 32 Go offrent beaucoup de VRAM pour le prix ; llama.cpp (via ROCm ou Vulkan), Ollama et LM Studio fonctionnent très bien, mais certains outils de niche ou d’entraînement restent plus simples sur NVIDIA. Intel propose des Arc B580 12 Go très abordables et une gamme Arc Pro B-series à 24 Go, avec un support logiciel (IPEX-LLM, OpenVINO, Vulkan) correct pour l’inférence.",
          "Enfin, les machines à mémoire unifiée sont une alternative sérieuse pour les gros modèles : les Mac à puce Apple M4 Max / M3 Ultra (jusqu’à 128 à 512 Go partagés) et les mini-PC AMD Ryzen AI Max+ 395 « Strix Halo » (jusqu’à 128 Go, dont environ 96 Go allouables au GPU) chargent des modèles de 70 à 120 milliards de paramètres. Leur vitesse de génération est inférieure à celle d’un gros GPU dédié, et leur traitement du prompt nettement plus lent, mais la capacité mémoire est imbattable à ce prix.",
        ],
      },
      {
        heading: 'Le reste de la configuration',
        paragraphs: [
          "Le processeur est secondaire pour l’inférence GPU : un Ryzen 7 9700X ou un Core Ultra 7 265K suffisent largement. Il devient plus important si vous déportez des couches sur la RAM (plus de cœurs et de bande passante aident) ou si vous préparez des jeux de données. La RAM système doit être au moins égale à la VRAM, idéalement double : 64 Go de DDR5 sont un bon standard, 96 ou 128 Go si vous voulez charger de gros modèles MoE en partie sur CPU.",
          "Le stockage compte davantage qu’on ne le pense : les modèles pèsent vite 5 à 50 Go chacun et une collection atteint rapidement plusieurs centaines de Go. Un NVMe Gen4 de 2 à 4 To accélère le chargement des modèles. Pour un montage multi-GPU, vérifiez la répartition des lignes PCIe de la carte mère (x8/x8 ou x16/x4), l’espacement entre les slots et la puissance de l’alimentation.",
          "L’alimentation doit être dimensionnée pour des charges soutenues : une RTX 5090 peut consommer 575 W pendant des heures lors d’une génération d’images ou d’un entraînement. Il est courant de limiter la puissance (power limit à 70-80 %) pour perdre seulement quelques pourcents de performances en gagnant beaucoup en bruit et en chaleur.",
        ],
        tips: [
          "Linux (Ubuntu, Fedora) reste l’environnement le plus simple pour ROCm, vLLM et l’entraînement.",
          "Pour débuter : Ollama ou LM Studio pour les LLM, ComfyUI pour Stable Diffusion et Flux.",
        ],
      },
      {
        heading: 'Configurations types',
        paragraphs: [
          "Découverte (environ 1200-1500 €) : Ryzen 5 9600X, 32 Go DDR5, RTX 5060 Ti 16 Go, 2 To NVMe. Idéal pour des LLM de 8 à 14 milliards de paramètres, SDXL et Flux en FP8/GGUF, et des LoRA simples.",
          "Avancé (environ 2500-3000 €) : Ryzen 7 9700X, 64 Go DDR5, RTX 5070 Ti ou 5080 16 Go, ou RTX 3090 24 Go d’occasion, 4 To NVMe, alimentation 850 W. Modèles de 24 à 32 milliards de paramètres quantifiés, génération d’images rapide, premiers modèles vidéo.",
          "Expert (5000 € et plus) : Ryzen 9 9950X, 128 Go DDR5, RTX 5090 32 Go ou deux cartes 24/32 Go, 1200-1600 W, boîtier très ventilé. Modèles de 70 milliards en 4 bits répartis sur deux GPU, fine-tuning QLoRA, vidéo générative. Au-delà, on entre dans le monde des stations professionnelles (RTX PRO 6000 Blackwell 96 Go, plateformes Threadripper ou Xeon).",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'station-de-travail-creation',
    title: 'Station de travail création : 3D, montage vidéo et CAO',
    excerpt:
      "Blender, DaVinci Resolve, Premiere Pro, SolidWorks ou Unreal Engine : chaque logiciel sollicite différemment le processeur, la carte graphique et la mémoire. Comment bâtir une station équilibrée.",
    icon: 'Clapperboard',
    readingMinutes: 11,
    updated: '2026-09-24',
    cta: { label: 'Générer une station de travail', to: '/generer?type=desktop&profile=workstation&budget=3000' },
    sections: [
      {
        heading: 'Identifier ce qui limite votre logiciel',
        paragraphs: [
          "Avant de choisir, il faut savoir quel composant travaille réellement. Le rendu 3D sur GPU (Blender Cycles avec OptiX, Redshift, Octane, V-Ray GPU) dépend presque entièrement de la carte graphique et de sa VRAM. Le rendu sur CPU (Cinebench, V-Ray CPU, Corona, Arnold CPU) profite de chaque cœur supplémentaire. Le montage vidéo mélange les deux : décodage matériel, effets GPU et exports.",
          "La CAO (SolidWorks, Fusion, Inventor, Revit) est un cas particulier : la modélisation est majoritairement mono-thread et profite surtout d’une fréquence élevée, tandis que la carte graphique doit surtout être certifiée et stable dans le viewport. Les simulations (éléments finis, CFD) peuvent au contraire exploiter énormément de cœurs et de bande passante mémoire.",
          "Enfin, les logiciels d’édition photo (Lightroom, Photoshop) et de développement de jeux (Unreal Engine 5, Unity) demandent un bon équilibre : processeur rapide pour la compilation des shaders et du code, GPU moderne pour le viewport et beaucoup de RAM pour les gros projets.",
        ],
      },
      {
        heading: 'Processeur et plateforme',
        paragraphs: [
          "Sur plateforme grand public, le Ryzen 9 9950X (16 cœurs Zen 5) et le Ryzen 9 9950X3D sont les références pour le rendu CPU, la compilation et l’encodage logiciel ; le Core Ultra 9 285K (24 cœurs, 8 P + 16 E) est très compétitif en multithread et bénéficie de Quick Sync pour le décodage vidéo H.264/HEVC 10 bits 4:2:2, un atout réel dans Premiere Pro et DaVinci Resolve avec les fichiers de certains appareils photo.",
          "Au-delà de 16-24 cœurs, ou si vous avez besoin de plus de 192-256 Go de RAM et de nombreuses lignes PCIe (plusieurs GPU, cartes de capture, réseau 25 GbE), il faut passer sur une plateforme HEDT ou serveur : AMD Threadripper 9000 (sTR5, jusqu’à 96 cœurs, DDR5 RDIMM ECC en 4 ou 8 canaux) ou Intel Xeon W-2500/W-3500. Le coût grimpe fortement mais la capacité d’extension n’a rien à voir.",
          "Pour la CAO pure, un processeur à haute fréquence et forte IPC suffit : un Ryzen 7 9700X, un Core Ultra 7 265K ou un Ryzen 7 9800X3D offrent une excellente réactivité du viewport pour une fraction du prix d’une plateforme HEDT.",
        ],
        tips: [
          "Regardez les benchmarks propres à votre logiciel (Puget Systems publie des tests détaillés par application).",
          "L’ECC est disponible sur AM5 avec certaines cartes mères et de la DDR5 ECC UDIMM : utile pour les longs calculs.",
        ],
      },
      {
        heading: 'Carte graphique : VRAM et pilotes',
        paragraphs: [
          "Pour le rendu GPU et la 3D, NVIDIA domine grâce à CUDA et OptiX, pris en charge par quasiment tous les moteurs. Une RTX 5070 Ti ou 5080 16 Go convient à la majorité des projets ; la RTX 5090 32 Go est nettement plus rapide et accepte des scènes beaucoup plus lourdes. Si une scène dépasse la VRAM, le rendu devient très lent ou échoue : les professionnels de l’archi-viz et des VFX se tournent donc vers les RTX PRO Blackwell (24 à 96 Go de VRAM, ECC, pilotes certifiés).",
          "AMD est pertinent pour le montage vidéo (DaVinci Resolve exploite bien les Radeon) et prend en charge Blender via HIP, avec des performances en progrès sur RDNA 4 mais encore inférieures à OptiX à prix égal. Pour la CAO, les cartes professionnelles (NVIDIA RTX PRO, AMD Radeon PRO) sont certifiées par les éditeurs : c’est un gage de stabilité et parfois une condition du support technique.",
          "En montage, les encodeurs matériels comptent : les RTX 50 gèrent l’encodage et le décodage AV1 et HEVC 4:2:2 10 bits, les Radeon RX 9000 ont un encodeur AV1 amélioré. Pour la vidéo 8K ou le RAW, 16 Go de VRAM ou plus sont recommandés dans DaVinci Resolve.",
        ],
      },
      {
        heading: 'Mémoire et stockage',
        paragraphs: [
          "La RAM est souvent sous-estimée : 32 Go constituent un minimum pour la création, 64 Go sont recommandés pour le montage 4K, la 3D et Unreal Engine, et 128 Go ou plus pour les grosses simulations, la photogrammétrie ou les compositions After Effects complexes. Sur AM5 et LGA1851, deux barrettes de 48 ou 64 Go offrent 96 à 128 Go tout en gardant une fréquence élevée ; quatre barrettes réduisent souvent la fréquence à 5200-5600 MT/s.",
          "Organisez le stockage en plusieurs volumes : un NVMe pour le système et les logiciels, un NVMe rapide et endurant (TBW élevé) pour les caches et fichiers de travail en cours, et un volume de grande capacité (NVMe 4 To ou disques durs) pour les archives. Un SSD Gen5 est utile ici pour lire des rushes lourds ou déplacer de gros fichiers, bien plus qu’en jeu.",
          "Les projets vidéo remplissent vite plusieurs téraoctets : un NAS en 10 GbE ou 2,5 GbE est un bon complément pour archiver et partager les médias, avec une vraie stratégie de sauvegarde.",
        ],
        tips: [
          "Placez le cache de rendu / media cache de votre logiciel sur un SSD dédié.",
          "Un onduleur (UPS) protège vos rendus longs contre les coupures de courant.",
        ],
      },
      {
        heading: 'Fiabilité, bruit et ergonomie',
        paragraphs: [
          "Une station de travail tourne souvent à pleine charge pendant des heures : privilégiez une alimentation surdimensionnée de 20 à 30 % (80 PLUS Gold ou Platinum), un boîtier spacieux avec un bon flux d’air et un refroidissement CPU capable de dissiper durablement 200 W et plus (ventirad double tour haut de gamme ou AIO 360 mm).",
          "Pour le confort, un écran calibré (couverture DCI-P3 ou Adobe RGB, idéalement une sonde de calibration), un second écran et une connectique rapide (USB4 / Thunderbolt pour les disques externes, 10 GbE pour le NAS) comptent autant que les composants internes. Pensez aussi à l’étalonnage de la sortie vidéo (carte type Blackmagic DeckLink) si vous faites de la colorimétrie professionnelle.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'serveur-homelab-virtualisation',
    title: 'Monter son serveur homelab et de virtualisation',
    excerpt:
      "Proxmox, conteneurs, domotique, VPN ou lab réseau : comment choisir le matériel d’un serveur maison fiable, économe et évolutif, de l’ECC au 10 GbE.",
    icon: 'Server',
    readingMinutes: 12,
    updated: '2026-09-24',
    cta: { label: 'Générer un serveur homelab', to: '/generer?type=server&profile=homelab&budget=1200' },
    sections: [
      {
        heading: 'Définir ses usages',
        paragraphs: [
          "Un homelab peut aller du mini-PC qui fait tourner Home Assistant, Pi-hole et quelques conteneurs Docker, jusqu’au serveur rack qui héberge des dizaines de machines virtuelles, un cluster Kubernetes et un stockage ZFS de plusieurs dizaines de To. Listez vos services, estimez la RAM de chacun et le nombre de cœurs nécessaires : c’est ce qui fixera la plateforme.",
          "La virtualisation est gourmande surtout en mémoire vive : une VM Windows demande 4 à 8 Go, une VM Linux légère 1 à 2 Go, un conteneur LXC quelques centaines de Mo. Le processeur est rarement le facteur limitant à la maison ; mieux vaut beaucoup de RAM et des SSD rapides que des cœurs en surnombre.",
          "Pensez aussi aux usages spécifiques : transcodage vidéo pour Plex ou Jellyfin (un iGPU Intel avec Quick Sync est idéal), passthrough d’un GPU vers une VM (jeu, IA), ou pare-feu virtualisé (OPNsense, pfSense) qui nécessitera plusieurs ports réseau.",
        ],
      },
      {
        heading: 'Choisir la plateforme',
        paragraphs: [
          "Pour un homelab économe, un mini-PC à Intel N100/N150/N305 ou à Ryzen 7 / Core Ultra mobile consomme 6 à 15 W au repos et gère très bien une dizaine de services. Au-dessus, une plateforme de bureau AM5 (Ryzen 7 9700X ou Ryzen 9 9950X) ou LGA1851 offre beaucoup de puissance, un bon iGPU et jusqu’à 192-256 Go de DDR5 selon les cartes mères, avec une consommation au repos maîtrisée.",
          "Si vous voulez de l’ECC, beaucoup de lignes PCIe et une gestion à distance, regardez les plateformes serveur d’entrée de gamme : AMD EPYC 4004/4005 (sur socket AM5, avec DDR5 ECC UDIMM) ou Intel Xeon 6300 sur cartes mères serveur à BMC. Pour les gros labs, EPYC 9004/9005 (SP5) ou 8004 (SP6) et Xeon 6 offrent des dizaines de cœurs et de la DDR5 RDIMM, au prix d’une consommation au repos plus élevée.",
          "Le marché de l’occasion (Dell PowerEdge, HPE ProLiant, Supermicro) propose des serveurs rack puissants à bas prix, mais attention : bruit important, consommation au repos souvent de 80 à 150 W et génération de processeurs ancienne. Sur une année, l’électricité peut coûter plus cher que le serveur lui-même.",
        ],
        tips: [
          "1 W consommé en permanence représente environ 8,8 kWh par an, soit 2 € environ au tarif français actuel.",
          "Pour le transcodage, un iGPU Intel récent remplace avantageusement une carte graphique dédiée.",
        ],
      },
      {
        heading: 'ECC, mémoire et stockage',
        paragraphs: [
          "La mémoire ECC corrige les erreurs de bits isolées et signale les erreurs plus graves. Elle est recommandée pour un serveur qui tourne 24 h/24, surtout avec ZFS qui fait entièrement confiance à la RAM. Sur AM5, certaines cartes mères (ASRock Rack, ASUS Pro, Gigabyte) acceptent la DDR5 ECC UDIMM ; il ne faut pas la confondre avec l’« on-die ECC » présent sur toutes les barrettes DDR5, qui ne protège que l’intérieur de la puce. Les plateformes EPYC/Xeon utilisent de la RDIMM ECC.",
          "Pour le stockage, séparez le système et les VM, sur SSD NVMe (idéalement en miroir ZFS et avec protection contre les coupures, PLP, pour les SSD d’entreprise), des données de masse sur disques durs CMR en RAIDZ ou miroir. Proxmox propose ZFS nativement à l’installation, ce qui simplifie les snapshots et la réplication.",
          "Les SSD grand public s’usent vite sous ZFS et Proxmox à cause des écritures synchrones et des journaux : préférez des modèles au TBW élevé, ou des SSD d’entreprise d’occasion (U.2 / M.2 22110 avec PLP), souvent plus endurants et à peine plus chers au Go.",
        ],
      },
      {
        heading: 'Réseau : 2,5, 10 GbE et plus',
        paragraphs: [
          "Le 2,5 GbE est désormais standard sur les cartes mères et les mini-PC, et suffit pour la plupart des usages domestiques. Le 10 GbE devient intéressant dès que vous transférez de gros fichiers entre un PC et un NAS/serveur, ou pour les migrations de VM entre nœuds d’un cluster Proxmox.",
          "Deux technologies coexistent : le 10GBASE-T (câble RJ45 Cat6a) est pratique mais chauffe et consomme davantage, alors que le SFP+ (câbles DAC en cuivre ou fibre avec modules optiques) est plus économe, moins cher d’occasion et plus flexible. Les cartes Intel X520/X710 ou Mellanox ConnectX-3/4 en SFP+ sont très répandues et bien supportées sous Linux.",
          "Pour les services exposés, segmentez votre réseau avec des VLAN (un switch administrable est nécessaire), placez un pare-feu devant et utilisez un VPN (WireGuard, Tailscale) plutôt que d’ouvrir des ports sur Internet.",
        ],
        tips: [
          "Un switch avec quelques ports SFP+ et le reste en 2,5 GbE est un excellent compromis domestique.",
          "Vérifiez la compatibilité des modules SFP+ avec votre switch : certaines marques verrouillent les modules tiers.",
        ],
      },
      {
        heading: 'Logiciel, gestion à distance et consommation',
        paragraphs: [
          "Proxmox VE est l’hyperviseur de référence en homelab : gratuit, basé sur Debian, il gère VM KVM et conteneurs LXC, ZFS, Ceph, sauvegardes (avec Proxmox Backup Server) et clustering. Les alternatives incluent XCP-ng, TrueNAS SCALE (orienté stockage avec applications), Unraid (payant, très souple pour les disques hétérogènes) ou un simple Linux avec Docker.",
          "Une carte mère avec BMC/IPMI (ASPEED AST2600 sur les cartes serveur) permet d’allumer, éteindre, réinstaller et surveiller la machine à distance, même quand le système est planté. Sur une plateforme grand public, un KVM IP (PiKVM, JetKVM, GL.iNet Comet) apporte l’essentiel de ces fonctions pour quelques dizaines d’euros.",
          "Enfin, surveillez la consommation au repos, car un serveur maison passe l’essentiel de son temps à ne rien faire. Activez les états C du processeur et l’ASPM dans le BIOS, choisissez une alimentation efficace à faible charge (80 PLUS Gold ou mieux, bien dimensionnée), laissez les disques durs se mettre en veille si vos usages le permettent, et mesurez avec une prise wattmètre.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'nas-diy-ou-cle-en-main',
    title: 'NAS : DIY ou clé en main ?',
    excerpt:
      "Synology, QNAP, UGREEN ou NAS maison sous TrueNAS et Unraid : avantages, RAID et ZFS, choix des disques CMR et stratégie de sauvegarde 3-2-1.",
    icon: 'HardDrive',
    readingMinutes: 11,
    updated: '2026-09-24',
    cta: { label: 'Générer un NAS', to: '/generer?type=nas&profile=storage&budget=1000' },
    sections: [
      {
        heading: 'NAS du commerce ou NAS maison',
        paragraphs: [
          "Un NAS clé en main (Synology, QNAP, UGREEN, Asustor, TerraMaster) offre une installation en quelques minutes, un système d’exploitation soigné, des applications mobiles et un support. C’est la solution idéale si vous voulez un stockage fiable sans y passer de temps. En contrepartie, le matériel est souvent modeste pour le prix, et certains fabricants restreignent les disques compatibles ou les mises à jour sur les modèles anciens.",
          "Un NAS DIY, monté à partir de composants PC et d’un système comme TrueNAS SCALE/Community Edition, Unraid ou OpenMediaVault, offre bien plus de puissance et d’évolutivité pour le même budget : processeur récent, RAM ECC, 10 GbE, emplacements NVMe, transcodage matériel, VM et conteneurs. Il demande en revanche un peu de temps pour la configuration et la maintenance.",
          "Pour choisir, posez-vous trois questions : combien de temps voulez-vous y consacrer, quelle capacité visez-vous à cinq ans, et voulez-vous faire tourner d’autres services (Plex, Jellyfin, Immich, Nextcloud, domotique) sur la même machine ?",
        ],
      },
      {
        heading: 'RAID, ZFS et redondance',
        paragraphs: [
          "Le RAID répartit les données sur plusieurs disques pour survivre à une panne. En RAID 1 (miroir), chaque donnée est copiée sur deux disques ; en RAID 5 / RAIDZ1, un disque de parité permet de perdre un disque ; en RAID 6 / RAIDZ2, deux disques peuvent tomber. Avec des disques de 12 To et plus, la reconstruction dure longtemps et sollicite fortement les disques restants : le RAIDZ2 (ou RAID 6) est donc recommandé dès 5-6 disques.",
          "ZFS combine gestionnaire de volumes et système de fichiers : sommes de contrôle sur toutes les données (détection et réparation de la corruption silencieuse), snapshots instantanés, compression transparente, réplication vers un autre serveur. Depuis OpenZFS 2.3, l’extension d’un RAIDZ par ajout de disque est possible, ce qui lève une ancienne limitation. Btrfs (utilisé par Synology) offre des fonctions proches, et Unraid propose un système de parité souple adapté aux disques de tailles différentes.",
          "Le RAID n’est pas une sauvegarde : il protège contre la panne d’un disque, pas contre une suppression accidentelle, un rançongiciel, un incendie ou une erreur de manipulation. Les snapshots aident contre les deux premiers cas, mais seule une copie externe protège vraiment.",
        ],
        tips: [
          "ZFS aime la RAM : comptez 8 Go minimum, et plus pour le cache ARC si vous avez beaucoup de données chaudes.",
          "Lancez un « scrub » mensuel pour détecter et corriger les erreurs silencieuses.",
        ],
      },
      {
        heading: 'Choisir ses disques',
        paragraphs: [
          "Pour un NAS, utilisez exclusivement des disques CMR (enregistrement magnétique conventionnel) conçus pour un usage 24 h/24 : Seagate IronWolf / IronWolf Pro, WD Red Plus / Red Pro, Toshiba N300, ou des disques d’entreprise (Exos, Ultrastar, Toshiba MG). Les disques SMR (enregistrement par bardeaux), comme les anciens WD Red sans « Plus », deviennent extrêmement lents lors des reconstructions RAID et sont à proscrire, en particulier avec ZFS.",
          "Le coût au To est généralement le plus bas entre 16 et 24 To par disque, mais tenez compte du temps de reconstruction et du nombre de baies. Les disques reconditionnés d’entreprise sont une option économique si vous acceptez une garantie plus courte et une redondance solide. Achetez vos disques chez des vendeurs différents ou de lots différents pour limiter les défaillances simultanées.",
          "Les SSD ont aussi leur place : un miroir de NVMe pour les applications et les VM, ou comme « special vdev » ZFS pour accélérer les métadonnées. Un cache de lecture L2ARC n’apporte en revanche que rarement un gain à la maison ; mieux vaut ajouter de la RAM.",
        ],
      },
      {
        heading: 'Matériel d’un NAS DIY',
        paragraphs: [
          "Pour un NAS de stockage et de streaming, un processeur Intel à iGPU (N150/N305, Core i3 / Core Ultra 5) offre le transcodage Quick Sync et une faible consommation. Pour ajouter des VM et de nombreux conteneurs, un Ryzen sur AM5 ou un AMD EPYC 4004/4005 avec DDR5 ECC est plus adapté. Visez 16 à 32 Go de RAM, ECC si possible.",
          "Le boîtier doit accueillir les disques avec une bonne ventilation (Fractal Node 804 / Define 7, Jonsbo N-series, Silverstone CS, ou châssis rack avec fonds de panier). Si la carte mère n’a pas assez de ports SATA, une carte HBA LSI/Broadcom en mode IT (9207, 9300, 9400) ajoute 8 à 16 disques ; évitez les cartes RAID matérielles avec ZFS, qui doit voir les disques directement.",
          "L’alimentation doit supporter le pic au démarrage des disques (environ 2 A sur le 12 V par disque durant quelques secondes) tout en restant efficace au repos : une 450-550 W 80 PLUS Gold suffit pour 6 à 8 disques. Ajoutez un onduleur avec arrêt automatique via NUT pour éviter les corruptions en cas de coupure.",
        ],
      },
      {
        heading: 'La règle de sauvegarde 3-2-1',
        paragraphs: [
          "La règle 3-2-1 consiste à conserver 3 copies de vos données, sur 2 supports différents, dont 1 hors site. Par exemple : les données originales sur votre PC, une copie sur le NAS, et une copie chiffrée dans le cloud (Backblaze B2, Hetzner Storage Box, Synology C2, OVHcloud) ou sur un disque externe conservé ailleurs. On parle aujourd’hui de 3-2-1-1-0 : une copie hors ligne ou immuable et zéro erreur lors des tests de restauration.",
          "Automatisez les sauvegardes (Hyper Backup, Proxmox Backup Server, restic, Borg, Kopia, rclone) et testez régulièrement la restauration : une sauvegarde jamais testée n’est pas une sauvegarde. Activez les snapshots immuables quand le système le permet, c’est la meilleure défense contre les rançongiciels.",
        ],
        tips: [
          "Ne sauvegardez dans le cloud que des données chiffrées côté client.",
          "Notez la procédure de restauration quelque part hors du NAS lui-même.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'choisir-pc-portable',
    title: 'Choisir un PC portable en 2026',
    excerpt:
      "Ultraportable, portable gamer, station mobile ou Copilot+ PC : processeurs Intel, AMD, Qualcomm et Apple, écran, autonomie et pièges à éviter.",
    icon: 'Laptop',
    readingMinutes: 10,
    updated: '2026-09-24',
    cta: { label: 'Générer un PC portable', to: '/generer?type=laptop&profile=office&budget=1000' },
    sections: [
      {
        heading: 'Quel type de portable ?',
        paragraphs: [
          "Un portable est un compromis entre puissance, poids, autonomie et prix : impossible d’avoir tout à la fois. Les ultraportables (13-14 pouces, 1 à 1,4 kg) privilégient l’autonomie et la mobilité ; les modèles polyvalents de 15-16 pouces offrent un grand écran et souvent un pavé numérique ; les portables gamers et créateurs embarquent une carte graphique dédiée au prix d’un poids et d’un bruit plus élevés.",
          "Contrairement à un PC de bureau, un portable ne s’améliore presque pas : le processeur et la carte graphique sont soudés, et la RAM l’est de plus en plus souvent (LPDDR5X). Choisissez donc dès l’achat la quantité de mémoire dont vous aurez besoin sur toute la durée de vie de la machine, en vérifiant si le SSD est remplaçable (M.2 2280 ou 2230).",
        ],
      },
      {
        heading: 'Processeurs : Intel, AMD, Qualcomm, Apple',
        paragraphs: [
          "Côté Intel, les Core Ultra 200V « Lunar Lake » excellent en autonomie et intègrent un iGPU Arc 140V performant et un NPU de 48 TOPS, mais avec une RAM limitée à 16 ou 32 Go soudés. Les Core Ultra 200H « Arrow Lake H » offrent plus de puissance pour les portables polyvalents et gamers, et la génération Core Ultra série 3 « Panther Lake » (procédé Intel 18A), arrivée début 2026, combine efficacité et iGPU Xe3 plus puissant.",
          "AMD propose les Ryzen AI 300 « Strix Point » (jusqu’à 12 cœurs Zen 5, iGPU Radeon 880M/890M, NPU 50 TOPS), les Ryzen AI 300 « Krackan » plus abordables, et les Ryzen AI Max « Strix Halo » dont l’iGPU Radeon 8060S rivalise avec une carte graphique dédiée d’entrée de gamme, idéal pour la création et l’IA locale grâce à jusqu’à 128 Go de mémoire unifiée.",
          "Qualcomm Snapdragon X et X2 Elite (architecture ARM) offrent une autonomie remarquable sous Windows 11 ; l’émulation Prism fait tourner la plupart des applications x86, mais certains jeux à anti-triche, pilotes et logiciels professionnels restent incompatibles. Apple, avec les MacBook Air et Pro à puces M4 / M5, reste la référence en autonomie, silence et qualité de fabrication, à condition d’accepter macOS.",
        ],
        tips: [
          "Le label Copilot+ PC exige un NPU d’au moins 40 TOPS : utile pour certaines fonctions IA de Windows, pas indispensable.",
          "Les performances d’un même processeur varient fortement selon la puissance (TDP) que le constructeur lui alloue.",
        ],
      },
      {
        heading: 'Portables gamers et créateurs',
        paragraphs: [
          "Les GPU mobiles GeForce RTX 50 Laptop (5050, 5060, 5070, 5070 Ti, 5080, 5090) portent le même nom que leurs équivalents de bureau mais sont nettement moins puissants. Surtout, leurs performances dépendent de la puissance allouée (TGP, de 60 à 175 W) : une RTX 5070 à 115 W peut dépasser une RTX 5070 Ti bridée à 80 W. Vérifiez toujours le TGP dans la fiche technique ou les tests.",
          "La VRAM compte aussi : les RTX 5050, 5060 et 5070 Laptop n’ont que 8 Go, la 5070 Ti en a 12 et la 5080 16 Go, la 5090 Laptop 24 Go. Un commutateur MUX (ou Advanced Optimus) améliore les performances en jeu en connectant directement le GPU à l’écran.",
          "Pour la création, privilégiez un écran couvrant 100 % du DCI-P3 (OLED ou mini-LED), 32 Go de RAM minimum, un SSD de 1 To ou plus et un port Thunderbolt 4/5 ou USB4 pour les disques externes rapides.",
        ],
      },
      {
        heading: 'Écran, autonomie et connectique',
        paragraphs: [
          "L’écran est le composant avec lequel vous interagissez en permanence : visez au minimum une dalle IPS ou OLED de 300 nits, en 1920 × 1200 (16:10) ou plus. L’OLED offre des noirs parfaits et des couleurs éclatantes mais peut consommer plus sur fond clair ; un écran 120 Hz améliore la fluidité même en bureautique. Une dalle mate est préférable si vous travaillez souvent près d’une fenêtre.",
          "L’autonomie annoncée par les constructeurs est rarement atteinte : fiez-vous aux tests indépendants. Une batterie de 70 Wh et plus est un bon indicateur. Côté connectique, recherchez au moins deux ports USB‑C (dont un USB4 / Thunderbolt avec Power Delivery pour la charge), un port USB‑A, une sortie HDMI 2.1 et, idéalement, un lecteur de cartes SD pour la photo. Le Wi‑Fi 7 est désormais courant sur les modèles de milieu de gamme.",
        ],
        tips: [
          "16 Go de RAM sont un minimum en 2026, 32 Go pour le développement, la création ou l’IA locale.",
          "Vérifiez la présence d’un second emplacement M.2 si vous prévoyez d’ajouter du stockage.",
          "Le clavier et le touchpad s’essaient en magasin quand c’est possible : ils font toute la différence au quotidien.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'choisir-smartphone',
    title: 'Choisir un smartphone en 2026',
    excerpt:
      "Puce, photo, écran, autonomie, durée des mises à jour : les critères qui comptent vraiment pour bien choisir son smartphone, de l’entrée de gamme au haut de gamme.",
    icon: 'Smartphone',
    readingMinutes: 9,
    updated: '2026-09-24',
    cta: { label: 'Générer un smartphone', to: '/generer?type=phone&profile=mobile&budget=600' },
    sections: [
      {
        heading: 'Les critères essentiels',
        paragraphs: [
          "Avant les fiches techniques, identifiez vos priorités : photo, jeu, autonomie, compacité ou durée de vie. En 2026, même un smartphone à 300 € est suffisamment rapide pour un usage courant ; ce sont la qualité de l’appareil photo, de l’écran, la longévité logicielle et l’autonomie qui distinguent vraiment les gammes.",
          "La durée des mises à jour est devenue un critère majeur : Apple suit ses iPhone 6 à 7 ans environ, Google (Pixel 8 et suivants) et Samsung (Galaxy S24 et suivants, ainsi que de nombreux Galaxy A récents) promettent jusqu’à 7 ans de mises à jour Android et de sécurité. Depuis juin 2025, le règlement européen sur l’écoconception impose aussi au moins 5 ans de mises à jour après la fin de commercialisation, une meilleure réparabilité et une étiquette énergie indiquant l’autonomie et la durabilité de la batterie.",
        ],
      },
      {
        heading: 'Puce, mémoire et stockage',
        paragraphs: [
          "Dans l’univers Android haut de gamme, les Qualcomm Snapdragon 8 Elite et 8 Elite Gen 5, les MediaTek Dimensity 9400 / 9500 et les Google Tensor G5 dominent ; chez Apple, les puces A19 et A19 Pro équipent les iPhone 17. En milieu de gamme, les Snapdragon 7 et Dimensity 7000/8000 offrent un excellent compromis. Pour le jeu mobile exigeant, la gestion thermique compte autant que la puce elle-même.",
          "Visez 8 Go de RAM au minimum sur Android, 12 Go ou plus si vous voulez profiter des fonctions d’IA générative embarquées (Gemini Nano, Galaxy AI) qui en consomment beaucoup. Pour le stockage, 128 Go deviennent justes : 256 Go sont conseillés, surtout si vous filmez en 4K, car très peu de modèles acceptent encore une carte microSD.",
        ],
        tips: [
          "Le stockage UFS 4.0 est nettement plus rapide que l’UFS 2.2 des modèles d’entrée de gamme.",
          "Prendre la capacité supérieure coûte souvent moins cher qu’un abonnement cloud sur plusieurs années.",
        ],
      },
      {
        heading: 'Photo et vidéo',
        paragraphs: [
          "Le nombre de mégapixels ne suffit pas à juger un appareil photo : la taille du capteur, la qualité de l’optique et surtout le traitement logiciel comptent davantage. Un capteur principal de type 1/1,3 pouce ou plus grand, un téléobjectif périscopique (zoom optique 3x à 5x) et un ultra grand-angle correct caractérisent les photophones haut de gamme.",
          "En vidéo, les iPhone restent une référence (stabilisation, Dolby Vision, ProRes Log sur les modèles Pro), suivis de près par les Samsung Galaxy S Ultra, les Google Pixel Pro, les Vivo X et les Xiaomi Ultra. Consultez des comparatifs de photos réelles en basse lumière, c’est là que les écarts sont les plus visibles.",
        ],
      },
      {
        heading: 'Écran, autonomie et charge',
        paragraphs: [
          "Un écran OLED (AMOLED) à 120 Hz est désormais présent dès le milieu de gamme. Recherchez une luminosité élevée en extérieur (plus de 1500 nits en pic) et, pour le haut de gamme, une dalle LTPO qui adapte sa fréquence pour économiser la batterie. La taille est une affaire de goût : les modèles compacts (6,1-6,3 pouces) sont plus rares mais existent encore.",
          "Côté autonomie, les batteries silicium-carbone ont permis à de nombreux Android de dépasser 5500 à 7000 mAh sans épaissir les appareils. La charge rapide varie de 25 W à plus de 100 W ; la norme Qi2 (magnétique, 15 à 25 W) se généralise sur Android après l’iPhone. Pour préserver la batterie, activez la limite de charge à 80-85 % proposée par la plupart des constructeurs.",
        ],
      },
      {
        heading: 'Par budget',
        paragraphs: [
          "Moins de 300 € : recherchez un écran OLED, 8 Go de RAM, 128-256 Go de stockage, une grosse batterie et au moins 4 à 6 ans de mises à jour (Samsung Galaxy A2x/A3x, Xiaomi Redmi Note, Motorola Moto G). Entre 300 et 600 € : c’est le meilleur rapport qualité-prix, avec des modèles comme les Google Pixel « a », Galaxy A5x, Nothing Phone ou les anciens haut de gamme en promotion.",
          "Au-delà de 700 € : photo polyvalente avec téléobjectif, puce haut de gamme, finitions premium et IA embarquée avancée (iPhone 17 / 17 Pro, Galaxy S25 / S25 Ultra, Pixel 10 Pro, OnePlus, Xiaomi, Vivo). Un flagship de l’année précédente en promotion ou reconditionné en grade « très bon état » reste souvent le meilleur choix économique et écologique.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'compatibilite-composants',
    title: 'La compatibilité des composants expliquée',
    excerpt:
      "Socket, chipset, génération de RAM, format de carte mère, dimensions et alimentation : tout ce qu’il faut vérifier pour que vos composants fonctionnent ensemble du premier coup.",
    icon: 'Code2',
    readingMinutes: 11,
    updated: '2026-09-24',
    cta: { label: 'Configurer un PC pas à pas', to: '/configurer/desktop' },
    sections: [
      {
        heading: 'Processeur, socket et chipset',
        paragraphs: [
          "Le socket est l’interface physique entre le processeur et la carte mère : un processeur ne peut se monter que sur une carte mère au socket identique. En 2026, les sockets courants sont l’AM5 (Ryzen 7000, 8000, 9000 et EPYC 4004/4005), l’AM4 (anciens Ryzen, en fin de vie), le LGA1851 (Intel Core Ultra 200S), le LGA1700 (Core de 12e à 14e génération), et côté serveur/HEDT le sTR5 (Threadripper), le SP5 (EPYC 9004/9005) et le LGA4677/4710 (Xeon).",
          "Le chipset détermine les fonctionnalités de la carte mère : nombre de ports USB et SATA, lignes PCIe supplémentaires, overclocking. Sur AM5, les chipsets A620, B650, B850, X670(E) et X870(E) acceptent tous les Ryzen AM5 ; les versions « E » garantissent le PCIe 5.0 pour le GPU et le M.2. Sur LGA1851, le Z890 permet l’overclocking et le B860/H810 sont plus économiques. Chez Intel, seul un chipset Z permet d’overclocker un processeur « K ».",
          "Un point de vigilance : la version du BIOS. Une carte mère fabriquée avant la sortie d’un processeur peut nécessiter une mise à jour pour le reconnaître. De nombreuses cartes récentes disposent d’une fonction « BIOS Flashback » qui permet la mise à jour sans processeur installé.",
        ],
        tips: [
          "Vérifiez toujours la liste de compatibilité processeurs (CPU support list) sur le site du fabricant de la carte mère.",
          "Les Ryzen 9000 sur carte B650 de première génération exigent parfois un BIOS récent.",
        ],
      },
      {
        heading: 'Mémoire vive',
        paragraphs: [
          "La génération de mémoire doit correspondre à la carte mère : DDR5 pour AM5 et LGA1851 (et la plupart des cartes LGA1700 récentes), DDR4 pour AM4 et certaines cartes LGA1700. Les deux ne sont pas interchangeables, les encoches sont placées différemment. Le format compte aussi : DIMM pour les PC de bureau, SO-DIMM ou CAMM2 pour les portables et mini-PC, RDIMM pour les serveurs (incompatible avec les cartes grand public).",
          "La fréquence maximale dépend du contrôleur mémoire du processeur et de la carte mère : sur AM5, 6000 MT/s est l’idéal et les kits plus rapides apportent peu ou rien ; sur LGA1851, 6400 à 8000 MT/s sont accessibles, et les barrettes CUDIMM (avec pilote d’horloge intégré) facilitent les très hautes fréquences. Deux barrettes sont toujours plus faciles à stabiliser que quatre.",
          "Pour un serveur ou une station de travail, vérifiez la prise en charge de l’ECC : il faut à la fois un processeur, une carte mère et des barrettes compatibles. Sur AM5, l’ECC UDIMM fonctionne avec les Ryzen (hors APU 8000G non-PRO) sur les cartes mères qui l’activent.",
        ],
      },
      {
        heading: 'Format, boîtier et dimensions',
        paragraphs: [
          "Les formats de cartes mères les plus courants sont l’E-ATX, l’ATX (30,5 × 24,4 cm), le micro-ATX (24,4 × 24,4 cm) et le mini-ITX (17 × 17 cm). Un boîtier compatible ATX accepte généralement les formats plus petits, l’inverse n’est pas vrai. Les nouveaux standards à connecteurs arrière (ASUS BTF, MSI Project Zero) exigent un boîtier spécifique avec découpes adaptées.",
          "Trois dimensions sont à vérifier systématiquement : la longueur maximale de carte graphique (les modèles haut de gamme dépassent souvent 33 cm) et son épaisseur (3 à 4 slots), la hauteur maximale de ventirad, et l’emplacement et la taille des radiateurs de watercooling AIO (240, 280, 360 mm) en façade ou au sommet.",
          "Pensez aussi à l’encombrement : une grosse carte graphique peut masquer un slot M.2 ou PCIe, et des barrettes RAM à dissipateurs hauts peuvent gêner un ventirad double tour. Les fabricants de ventirads publient des listes de compatibilité avec les cartes mères et les barrettes.",
        ],
        tips: [
          "Mesurez en tenant compte des ventilateurs en façade, qui réduisent la longueur utile de 2,5 cm environ.",
          "Les boîtiers mini-ITX imposent souvent une alimentation SFX et des cartes graphiques plus courtes.",
        ],
      },
      {
        heading: 'Stockage et lignes PCIe',
        paragraphs: [
          "Les SSD M.2 NVMe se déclinent en plusieurs longueurs (2230, 2242, 2280, 22110) et générations PCIe. Un SSD PCIe 5.0 fonctionne dans un slot PCIe 4.0, mais à la vitesse Gen4. Sur certaines cartes mères, utiliser un slot M.2 désactive des ports SATA ou réduit la bande passante du slot PCIe principal (par exemple x16 vers x8) : lisez le manuel, rubrique « partage de bande passante ».",
          "Le nombre total de lignes PCIe est limité par le processeur : 24 lignes utilisables sur AM5 (x16 pour le GPU et 2 × x4 pour les M.2) et 24 lignes sur LGA1851 (20 en PCIe 5.0 et 4 en PCIe 4.0), en plus du lien vers le chipset. Pour de nombreux SSD, GPU et cartes réseau, il faut une plateforme HEDT ou serveur (Threadripper, EPYC, Xeon) qui propose 64 à 128 lignes.",
        ],
      },
      {
        heading: 'Alimentation et connecteurs',
        paragraphs: [
          "L’alimentation doit fournir assez de puissance et les bons connecteurs : 24 broches ATX pour la carte mère, un ou deux 8 broches EPS pour le processeur (certaines cartes mères haut de gamme en demandent deux), des 8 broches PCIe ou un connecteur 12V‑2x6 (anciennement 12VHPWR) pour la carte graphique. Les RTX 50 utilisent presque toutes le 12V‑2x6, les Radeon RX 9000 restent le plus souvent en 8 broches classiques.",
          "Une alimentation ATX 3.1 est conçue pour absorber les pics de consommation transitoires des GPU modernes et fournit un câble 12V‑2x6 natif ; c’est le choix recommandé en 2026. Évitez les adaptateurs douteux, les rallonges de mauvaise qualité et ne mélangez jamais les câbles modulaires de deux alimentations différentes : les brochages ne sont pas standardisés côté alimentation.",
          "EnginePC vérifie automatiquement ces règles (socket, chipset, génération et format de RAM, format de carte mère et boîtier, longueur de GPU, puissance et connecteurs d’alimentation) et signale les incompatibilités ou les points à vérifier avant l’achat.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'alimentation-refroidissement',
    title: 'Bien dimensionner son alimentation et son refroidissement',
    excerpt:
      "Combien de watts pour votre configuration, quelle certification viser, ventirad ou watercooling AIO, et comment organiser le flux d’air pour un PC frais et silencieux.",
    icon: 'Server',
    readingMinutes: 10,
    updated: '2026-09-24',
    cta: { label: 'Configurer mon PC', to: '/configurer/desktop' },
    sections: [
      {
        heading: 'Calculer la puissance nécessaire',
        paragraphs: [
          "Additionnez la consommation maximale du processeur (PPT chez AMD, par exemple 88 W pour un Ryzen 5 9600X, 162 W pour un Ryzen 7 9800X3D de 120 W de TDP, 230 W pour un 9950X ; PL2 chez Intel, jusqu’à 250 W pour un Core Ultra 9 285K) et celle de la carte graphique (TGP/TBP : environ 145-180 W pour une RTX 5060 / 5060 Ti, 250 W pour une RTX 5070, 300 W pour une 5070 Ti, 360 W pour une 5080, 575 W pour une 5090 ; 304 W pour une RX 9070 XT de référence). Ajoutez 50 à 100 W pour la carte mère, la RAM, les SSD, les ventilateurs et les périphériques USB.",
          "Appliquez ensuite une marge de 30 à 40 % : elle absorbe les pics transitoires des GPU, permet à l’alimentation de fonctionner dans sa zone de meilleur rendement (40 à 60 % de charge) et de rester silencieuse. À titre indicatif : 550-650 W pour un PC avec RTX 5060 / RX 9060 XT, 750 W pour une RTX 5070 / RX 9070, 850 W pour une 5070 Ti / 9070 XT, 1000 W pour une 5080 avec un processeur haut de gamme, 1200 W et plus pour une RTX 5090.",
          "Les fabricants de cartes graphiques indiquent une puissance d’alimentation recommandée, souvent prudente. Surdimensionner excessivement n’est pas utile : une alimentation de 1200 W sous-chargée en usage bureautique a un rendement moindre au repos.",
        ],
        tips: [
          "Les modèles « OC » d’usine des cartes graphiques peuvent consommer 10 à 15 % de plus que la référence.",
          "Pour un serveur 24/7, choisissez une alimentation efficace à faible charge (80 PLUS Platinum/Titanium ou Cybenetics).",
        ],
      },
      {
        heading: 'Qualité et certifications',
        paragraphs: [
          "La certification 80 PLUS (Bronze, Silver, Gold, Platinum, Titanium) mesure le rendement à différents niveaux de charge ; la certification Cybenetics (ETA pour le rendement, LAMBDA pour le bruit) est plus complète et plus stricte. Le rendement ne dit cependant rien de la qualité des protections ou de la stabilité des tensions : consultez les tests détaillés et les classements de référence (tiers lists) avant d’acheter.",
          "Privilégiez une alimentation ATX 3.1 avec connecteur 12V‑2x6 natif, des condensateurs japonais, une garantie longue (7 à 12 ans pour les bons modèles) et les protections OCP, OVP, UVP, SCP, OPP et OTP. Une alimentation entièrement modulaire facilite le câblage et le flux d’air. Au format compact, les alimentations SFX et SFX-L permettent des PC mini-ITX puissants, jusqu’à 1000 W et plus.",
        ],
      },
      {
        heading: 'Refroidir le processeur',
        paragraphs: [
          "Un ventirad tour de qualité (Thermalright Peerless Assassin / Phantom Spirit, Arctic Freezer, Noctua, be quiet!) refroidit sans difficulté la majorité des processeurs actuels, y compris un Ryzen 7 9800X3D ou un Core Ultra 7 265K. Il est fiable, silencieux et bon marché, sans pompe susceptible de tomber en panne.",
          "Le watercooling tout-en-un (AIO) de 240 à 360 mm est pertinent pour les processeurs très gourmands (Ryzen 9 9950X, Core Ultra 9 285K sous charge lourde), pour l’esthétique ou lorsque la hauteur de ventirad est limitée. Placez le radiateur de préférence au sommet ou en façade avec les tuyaux vers le bas, en veillant à ce que la pompe ne soit pas le point le plus haut du circuit pour éviter l’accumulation d’air.",
          "Les processeurs modernes fonctionnent volontairement près de leur limite thermique (jusqu’à 95 °C chez AMD, 100-105 °C chez Intel) pour maximiser leur boost : une température élevée sous charge n’est pas forcément anormale. Si vous voulez plus de silence, le mode Eco d’AMD ou la limitation de puissance d’Intel réduisent fortement la chaleur pour une perte de performances souvent faible.",
        ],
        tips: [
          "Une noisette de pâte thermique au centre suffit ; remplacez-la seulement lors d’un démontage ou après plusieurs années.",
          "Les pads à changement de phase (type PTM7950) offrent une excellente durabilité.",
        ],
      },
      {
        heading: 'Flux d’air du boîtier',
        paragraphs: [
          "Un bon flux d’air suit un chemin simple : l’air frais entre par l’avant et le bas, l’air chaud sort par l’arrière et le haut. Une pression légèrement positive (un peu plus d’entrée que d’extraction) limite l’accumulation de poussière, surtout si les entrées sont filtrées. Deux à trois ventilateurs de 140 mm en façade et un en extraction arrière suffisent dans la plupart des cas.",
          "Les boîtiers à façade mesh sont bien plus efficaces que les façades pleines en verre. Pour les cartes graphiques très puissantes, l’ajout de ventilateurs en bas (boîtiers « aquarium » sans colonne) ou d’une façade bien ouverte améliore sensiblement les températures du GPU et de la mémoire GDDR7.",
          "Enfin, réglez les courbes de ventilation dans le BIOS ou avec FanControl : des ventilateurs qui accélèrent progressivement selon la température du CPU ou du GPU évitent les montées en régime brutales et rendent le PC bien plus agréable au quotidien.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'pc-bureautique-teletravail',
    title: 'PC bureautique et télétravail silencieux et économique',
    excerpt:
      "Pour la bureautique, la visioconférence et la navigation, inutile de dépenser une fortune : mini-PC, APU, silence, consommation et confort de travail au quotidien.",
    icon: 'Briefcase',
    readingMinutes: 8,
    updated: '2026-09-24',
    cta: { label: 'Générer un PC bureautique', to: '/generer?type=desktop&profile=office&budget=600' },
    sections: [
      {
        heading: 'De quoi a-t-on vraiment besoin ?',
        paragraphs: [
          "La bureautique, la messagerie, les visioconférences Teams ou Zoom et la navigation web demandent peu de puissance brute, mais beaucoup de réactivité. Les trois éléments qui comptent le plus sont un SSD NVMe (jamais de disque dur pour le système), 16 Go de RAM (les navigateurs modernes avec de nombreux onglets et les applications Electron consomment beaucoup) et un processeur récent avec une bonne performance mono-cœur.",
          "Une carte graphique dédiée est inutile : les iGPU des processeurs actuels gèrent jusqu’à trois ou quatre écrans en 4K, le décodage vidéo AV1 et les effets de flou d’arrière-plan des visios. C’est aussi ce qui permet d’obtenir un PC silencieux et économe.",
        ],
      },
      {
        heading: 'Mini-PC ou tour compacte',
        paragraphs: [
          "Les mini-PC (Intel N150 / N355, Core Ultra, Ryzen 5/7 mobiles, Ryzen AI 300) sont devenus la solution la plus logique pour le télétravail : ils tiennent derrière un écran grâce à la fixation VESA, consomment 5 à 15 W au repos et sont très silencieux. Un modèle à Ryzen 7 ou Core Ultra 5 avec 16-32 Go et 1 To de SSD coûte de 350 à 600 € et reste confortable pendant des années.",
          "Une tour compacte micro-ATX construite autour d’un APU (Ryzen 5 8600G, ou Ryzen 5 9600 avec iGPU basique) ou d’un Core Ultra 5 225 / 245 offre davantage d’évolutivité : ajout d’une carte graphique plus tard, de disques, remplacement facile des composants. Elle permet aussi un refroidissement plus gros et donc plus silencieux.",
          "Pour les entreprises, les gammes professionnelles (Dell OptiPlex, HP Elite/Pro, Lenovo ThinkCentre) apportent une gestion à distance (Intel vPro, AMD PRO), un support sur site et une garantie longue, un avantage réel quand on gère un parc de machines.",
        ],
        tips: [
          "Vérifiez que le mini-PC accepte le nombre d’écrans voulu et leur définition (HDMI, DisplayPort, USB‑C DP Alt).",
          "Préférez un modèle avec RAM et SSD remplaçables pour pouvoir évoluer.",
        ],
      },
      {
        heading: 'Silence et consommation',
        paragraphs: [
          "Le silence s’obtient d’abord en réduisant la chaleur produite : un processeur de 35 à 65 W, un ventirad surdimensionné tournant lentement, une alimentation dont le ventilateur s’arrête à faible charge (mode semi-passif) et un boîtier fermé avec des panneaux insonorisants. Les ventilateurs de 120 ou 140 mm réglés sous 800 tr/min deviennent quasi inaudibles.",
          "Un PC bureautique bien choisi consomme 10 à 25 W au repos et 40 à 80 W en activité, contre 60 à 100 W au repos pour un PC gamer mal optimisé. Sur 8 heures par jour ouvré, la différence représente plusieurs dizaines d’euros par an. Activez la mise en veille automatique et éteignez les écrans lors des pauses prolongées.",
        ],
      },
      {
        heading: 'L’ergonomie avant tout',
        paragraphs: [
          "Pour un poste de télétravail, l’écran, le clavier, la souris et la chaise ont plus d’impact sur votre confort que le processeur. Un écran de 27 pouces en 1440p (ou deux écrans 24 pouces), réglable en hauteur et placé à hauteur des yeux, réduit la fatigue. Un écran USB‑C avec Power Delivery et hub intégré permet de brancher un portable professionnel avec un seul câble.",
          "Côté visio, une webcam 1080p correcte et un casque ou un micro dédié améliorent nettement la qualité perçue par vos interlocuteurs. Enfin, un onduleur de petite capacité protège votre travail et votre box Internet des micro-coupures.",
        ],
        tips: [
          "Windows 10 n’est plus supporté depuis octobre 2025 : un nouveau PC doit être compatible Windows 11 (TPM 2.0), ou passer sous Linux.",
          "Un SSD de 512 Go suffit si vos documents sont synchronisés dans le cloud de l’entreprise ; 1 To sinon.",
        ],
      },
    ],
  },
]
