// Contenu éditorial : questions fréquentes (FR).

export interface FaqItem {
  q: string
  a: string
}

export const FAQ: FaqItem[] = [
  // --- Utiliser EnginePC ------------------------------------------------------
  {
    q: 'Qu’est-ce qu’EnginePC ?',
    a: 'EnginePC génère et compare des configurations de PC de bureau, PC portables, serveurs, NAS, tablettes et smartphones selon votre usage (jeu, IA, création, streaming, bureautique, développement, homelab, virtualisation, stockage…) et votre budget. Vous pouvez partir d’une configuration générée automatiquement, la modifier composant par composant dans le configurateur, puis la sauvegarder, la partager ou l’exporter.',
  },
  {
    q: 'Comment fonctionne le générateur de configurations ?',
    a: 'Choisissez un type d’appareil, un profil d’usage et un budget. Le moteur explore les combinaisons de composants compatibles du catalogue, calcule pour chacune un score adapté au profil (par exemple le GPU pèse davantage en jeu, la VRAM en IA, les baies et l’ECC pour un NAS) et vous propose les meilleures configurations qui respectent le budget. Vous pouvez ensuite ouvrir n’importe quelle proposition dans le configurateur pour l’ajuster.',
  },
  {
    q: 'Comment sont calculés les scores ?',
    a: 'Les scores sont des estimations relatives sur une échelle de 0 à 100, calculées à partir des caractéristiques et d’indices de performance des composants (performances mono et multi-cœur, puissance graphique, VRAM, quantité de RAM, stockage…). Les estimations d’images par seconde sont normalisées par rapport à une configuration de référence très haut de gamme. Ils servent à comparer des configurations entre elles, pas à prédire un résultat exact dans un jeu ou un logiciel donné : pour cela, référez-vous aux tests indépendants.',
  },
  {
    q: 'Comment la compatibilité est-elle vérifiée ?',
    a: 'Chaque configuration passe par une série de règles : socket processeur / carte mère, génération et format de mémoire (DDR4, DDR5, SO-DIMM, RDIMM…), nombre d’emplacements et capacité maximale, format de carte mère et de boîtier, longueur de la carte graphique, hauteur du ventirad, emplacements M.2 et SATA, puissance et connecteurs de l’alimentation, etc. Les problèmes bloquants apparaissent comme des erreurs, les points de vigilance comme des avertissements. Vérifiez toujours la fiche du fabricant avant l’achat (version de BIOS notamment).',
  },
  {
    q: 'Que signifie « Base ouverte » ?',
    a: 'En plus du catalogue principal vérifié, EnginePC peut charger une base étendue issue de jeux de données ouverts, qui ajoute de nombreux composants. Ces données sont moins fiables : les prix y sont souvent convertis depuis le dollar américain avec les taux de change de la BCE, et certaines caractéristiques sont estimées lorsqu’elles manquent. Les composants concernés portent le badge « Base ouverte », et les règles de compatibilité qui reposent sur une valeur estimée sont signalées comme avertissements « à vérifier » plutôt que comme erreurs.',
  },
  {
    q: 'Les prix affichés sont-ils fiables ?',
    a: 'Les prix sont indicatifs : ils correspondent à un ordre de grandeur constaté sur le marché et peuvent varier fortement selon les promotions, les stocks et les revendeurs (la mémoire vive, notamment, a connu de fortes hausses depuis fin 2025). Lorsque le comparateur de prix est connecté, EnginePC affiche les offres réelles des marchands. Vérifiez toujours le prix final chez le revendeur avant d’acheter.',
  },
  {
    q: 'Comment afficher les prix HT ou TTC et choisir mon pays ?',
    a: 'Dans les paramètres, choisissez l’affichage TTC, HT ou les deux, ainsi que votre pays : le taux de TVA correspondant est appliqué automatiquement (20 % en France, 21 % en Belgique, 17 % au Luxembourg, 8,1 % en Suisse, etc.). Vous pouvez aussi forcer un taux personnalisé ou activer la franchise en base de TVA pour les micro-entrepreneurs. Les prix du catalogue étant exprimés TTC France, le HT est recalculé puis la TVA du pays choisi est appliquée.',
  },
  {
    q: 'Puis-je créer un devis ?',
    a: 'Oui. Depuis le menu d’export d’une configuration, choisissez « Devis HT / TTC » : EnginePC génère un devis détaillé avec le prix de chaque composant, les totaux HT, le montant de TVA et le total TTC, que vous pouvez imprimer ou enregistrer en PDF depuis votre navigateur. C’est pratique pour un assembleur, un revendeur ou un achat professionnel.',
  },
  {
    q: 'Où sont stockées mes configurations ?',
    a: 'Vos configurations sauvegardées et vos paramètres sont enregistrés localement dans votre navigateur (stockage local). Aucun compte n’est nécessaire et rien n’est envoyé sur un serveur. En contrepartie, vider les données du site ou changer de navigateur ou d’appareil les fait disparaître : exportez-les en JSON ou utilisez un lien de partage pour les conserver ou les transférer.',
  },
  {
    q: 'Comment partager une configuration ?',
    a: 'Utilisez « Copier le lien de partage » dans le menu d’export. La configuration est encodée directement dans l’adresse du lien : la personne qui l’ouvre voit exactement les mêmes composants, sans compte ni serveur intermédiaire, et peut à son tour l’ouvrir dans le configurateur ou la sauvegarder.',
  },
  {
    q: 'Quels formats d’export sont disponibles ?',
    a: 'Vous pouvez exporter une configuration en JSON (format EnginePC, réimportable et exploitable par d’autres outils), en CSV (ouvrable dans Excel ou LibreOffice), en Markdown (idéal pour un forum, Reddit ou Discord), en devis HT/TTC imprimable en PDF, ou simplement imprimer la page.',
  },
  {
    q: 'Qu’apporte la connexion au comparateur de prix ?',
    a: 'Dans les paramètres, vous pouvez renseigner l’adresse du comparateur de prix partenaire. EnginePC l’interroge alors pour récupérer les offres des marchands (prix, frais de livraison, disponibilité) et affiche la meilleure offre en stock pour chaque composant, avec un lien direct vers la fiche produit. Sans connexion, l’application fonctionne normalement avec les prix indicatifs du catalogue, y compris hors ligne.',
  },
  {
    q: 'Comment comparer plusieurs appareils ou composants ?',
    a: 'La page « Comparer » affiche côte à côte les caractéristiques de plusieurs composants ou appareils (processeurs, cartes graphiques, portables, smartphones…), en mettant en évidence les meilleures valeurs. Vous pouvez y ajouter des éléments depuis le catalogue.',
  },

  // --- Questions matérielles générales ----------------------------------------
  {
    q: 'AMD ou Intel pour un nouveau PC en 2026 ?',
    a: 'Pour le jeu, les Ryzen X3D sur AM5 (Ryzen 7 9800X3D en tête) sont les plus performants, et la plateforme AM5 offre une bonne évolutivité. Les Intel Core Ultra 200S sur LGA1851 sont compétitifs en productivité multi-thread, consomment peu au repos et intègrent Quick Sync, apprécié en montage vidéo. Les deux sont d’excellents choix : comparez au prix du jour, carte mère comprise.',
  },
  {
    q: 'Combien de RAM me faut-il ?',
    a: '16 Go pour la bureautique, 32 Go pour le jeu et le développement, 64 Go pour la création 4K, la 3D, la virtualisation ou l’IA locale, et 128 Go ou plus pour les grosses simulations ou les modèles d’IA en partie sur CPU. Privilégiez deux barrettes plutôt que quatre sur les plateformes DDR5 grand public, et activez le profil EXPO ou XMP dans le BIOS.',
  },
  {
    q: 'Un SSD PCIe 5.0 vaut-il le coup ?',
    a: 'Pour le jeu et la bureautique, pas vraiment : un bon SSD NVMe PCIe 4.0 offre des temps de chargement quasi identiques pour moins cher et chauffe moins. Le PCIe 5.0 est utile pour les gros transferts de fichiers, le montage vidéo en RAW ou le chargement fréquent de modèles d’IA volumineux.',
  },
  {
    q: 'Quelle puissance d’alimentation choisir ?',
    a: 'Additionnez la consommation maximale du processeur et de la carte graphique, ajoutez 50 à 100 W pour le reste, puis une marge de 30 à 40 %. En pratique : 550-650 W pour une carte d’entrée de gamme, 750-850 W pour le milieu et haut de gamme, 1000 W pour une RTX 5080 et 1200 W et plus pour une RTX 5090. Choisissez une alimentation ATX 3.1 de qualité, 80 PLUS Gold au minimum. EnginePC vérifie automatiquement que la puissance est suffisante.',
  },
  {
    q: 'Combien de VRAM pour l’IA locale ?',
    a: 'Environ 12 Go pour des modèles de langage de 7 à 14 milliards de paramètres quantifiés en 4 bits et pour SDXL, 16 Go pour Flux et les modèles de 20 à 24 milliards, 24 à 32 Go pour les modèles de 27 à 32 milliards avec un long contexte, et 48 Go ou plus (deux cartes ou mémoire unifiée) pour les modèles de 70 milliards. NVIDIA reste le choix le plus simple grâce à CUDA ; AMD offre souvent plus de VRAM pour le prix avec ROCm.',
  },
  {
    q: 'Faut-il de la mémoire ECC pour un serveur ou un NAS ?',
    a: 'Elle est fortement recommandée pour une machine qui tourne en permanence et stocke des données importantes, surtout avec ZFS : l’ECC corrige les erreurs de bits en mémoire avant qu’elles ne corrompent vos fichiers. Il faut un processeur, une carte mère et des barrettes compatibles (DDR5 ECC UDIMM sur AM5 avec certaines cartes et sur EPYC 4004/4005, RDIMM sur les plateformes serveur). Elle ne remplace pas une sauvegarde 3-2-1.',
  },
]
