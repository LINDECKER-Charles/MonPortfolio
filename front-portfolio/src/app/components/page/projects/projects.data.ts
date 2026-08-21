import { OMNICARD_IMAGES } from '../../../img-sources/projects/omnicard.sources';
import { LIS_WEB_IMAGES } from '../../../img-sources/projects/lis.source';
import { DEV_MATES_IMAGES } from '../../../img-sources/projects/devmates.source';
import { SHREK_IMAGES } from '../../../img-sources/projects/shrek.source';
import { LODB_IMAGES } from '../../../img-sources/projects/lodb.source';
import { BLENDER_COLLECTION_IMAGES } from '../../../img-sources/projects/blendercollection.source';
import { GLOSSAIRE_QUEST_IMAGES } from '../../../img-sources/projects/glossairequest.source';
import { PORTFOLIO_IMAGES } from '../../../img-sources/projects/portfolio.source';
import { PVZF_CONSOLE_MANAGER_IMAGES } from '../../../img-sources/projects/pvzf-console-manager.source';
import { PVZF_TRADUCTION_IMAGES } from '../../../img-sources/projects/pvzf-traduction.source';
import { GUP_IMAGES } from '../../../img-sources/projects/gup.source';
import { IMG_CONVERTOR_IMAGES } from '../../../img-sources/projects/img-convertor.source';
import { LUCIE_FIQUET_ALBIN_IMAGES } from '../../../img-sources/projects/lucie-fiquet-albin.source';
import { FUSION_DOCS_IMAGES } from '../../../img-sources/projects/fusiondocs.source';
import { ProjectFilterItem, ProjectItem } from './projects.types';

export const PROJECT_FILTERS: ProjectFilterItem[] = [
  { id: 'all', label: 'Tous' },
  { id: 'personal', label: 'Personnel' },
  { id: 'open_source', label: 'Open Source' },
  { id: 'client', label: 'Client' },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'omnicard',
    title: 'Omnicard',
    period: {
      dateStart: new Date('2026-03-01'),
      isEnd: false,
    },
    shortDescription:
      'Jeu de cartes stratégique avec moteur métier custom, architecture modulaire et logique temps réel.',
    longDescription:
      'Omnicard est un projet personnel ambitieux centré sur la création d’un jeu de cartes stratégique complet, avec un moteur métier dédié, une logique de règles complexe et une architecture pensée pour durer. Le projet me permet de travailler la modélisation métier, la gestion des effets, la synchronisation temps réel, ainsi que l’articulation entre un back-end structuré et une interface moderne. C’est un terrain d’expérimentation très riche, à la croisée du game design, de l’architecture logicielle et du développement full stack.',
    category: 'personal',
    status: 'in_progress',
    stack: ['C#', '.NET', 'Angular', 'SignalR', 'PostgreSQL', 'TypeScript', 'XUnit'],
    tags: ['Architecture', 'Jeu', 'Temps réel', 'DDD', 'Moteur métier', 'Full Stack'],
    links: {
      demo: 'https://test.omnicard.fr',
    },
    highlights: [
      'Conception d’un moteur métier modulaire et orienté règles',
      'Gestion des effets, événements, états de jeu et interactions complexes',
      'Communication temps réel entre joueurs et synchronisation des parties',
    ],
    detail: {
      images: OMNICARD_IMAGES,
      lessonsLearned: [
        'Structurer une logique métier complexe sans perdre en lisibilité',
        'Faire évoluer un moteur de jeu de manière propre et testable',
        'Penser l’architecture d’un projet long terme mêlant front, back et gameplay',
      ],
    },
    featured: true,
  },
  {
    id: 'pvzf-translation-fr',
    title: 'PVZF Translation FR',
    period: {
      dateStart: new Date('2025-09-01'),
      isEnd: false,
    },
    shortDescription:
      'Pilotage de la partie française de la traduction PVZ Fusion en tant que lead.',
    longDescription:
      'PVZF Translation FR est la branche francophone du travail de traduction autour de PVZ Fusion, que je pilote en tant que lead. Ce projet mélange coordination, relecture, uniformisation terminologique et suivi de contribution. Il ne s’agit pas seulement de traduire, mais de maintenir une cohérence de ton, de qualité et de suivi sur un travail collectif évolutif.',
    category: 'open_source',
    status: 'in_progress',
    stack: ['GitHub', 'Localisation', 'Workflow'],
    tags: ['Open Source', 'Traduction', 'Lead', 'Coordination', 'Qualité', 'Communauté'],
    links: {
      github: 'https://github.com/LINDECKER-Charles/PVZF-Translation-fr',
    },
    highlights: [
      'Lead sur la partie française du projet',
      'Suivi de cohérence terminologique et qualitative',
      'Travail de coordination et de structuration de contribution',
    ],
    detail: {
      images: PVZF_TRADUCTION_IMAGES,
      lessonsLearned: [
        'Piloter un travail collaboratif avec une exigence de cohérence',
        'Formaliser des standards de traduction et de validation',
        'Travailler la qualité dans un contexte communautaire évolutif',
      ],
    },
    featured: true,
  },
  {
    id: 'fusion-docs',
    title: 'FusionDocs',
    period: {
      dateStart: new Date('2026-06-07'),
      isEnd: false,
    },
    shortDescription:
      'Plateforme communautaire full stack pour le modding de PVZ Fusion : curriculum de tutoriels multilingue, forum modéré et messagerie temps réel.',
    longDescription:
      'FusionDocs est une plateforme communautaire complète dédiée au modding de Plants vs. Zombies Fusion. Elle articule trois piliers : apprendre via un curriculum de tutoriels versionné et structuré en blocs de contenu (markdown, code, vidéo, galeries, comparaisons avant/après) avec suivi de progression par utilisateur ; échanger sur un forum modéré multilingue avec catégories, tags, réactions et réponses acceptées ; se connecter grâce aux profils, amis, messagerie privée et notifications temps réel via SignalR. Le back-end .NET 10 suit une clean architecture avec une hiérarchie de rôles stricte, une authentification JWT en cookies HTTP-only et un back-office d’administration complet (modération, audit, analytics, dons Stripe). Le front Angular 20 est servi en SSR zoneless avec un traitement SEO multilingue de bout en bout.',
    category: 'personal',
    status: 'in_progress',
    stack: ['Angular', 'ASP.NET Core', '.NET 10', 'C#', 'PostgreSQL', 'SignalR', 'TypeScript'],
    tags: ['Full Stack', 'Communauté', 'Tutoriels', 'Forum', 'Temps réel', 'i18n', 'SEO'],
    links: {
      github: 'https://github.com/LINDECKER-Charles/PVZ-Modding-Tutorial-Web',
      website: 'https://modding.pvzf-almanac.com',
    },
    highlights: [
      'Curriculum de tutoriels versionné par blocs de contenu avec progression par utilisateur',
      'Forum modéré multilingue, messagerie privée et présence temps réel via SignalR',
      'Back-office complet : rôles hiérarchisés, modération, audit, analytics et dons Stripe',
    ],
    detail: {
      images: FUSION_DOCS_IMAGES,
      lessonsLearned: [
        'Structurer une clean architecture .NET autour d’une hiérarchie de rôles stricte',
        'Industrialiser la qualité avec un gate de couverture fail-closed et des tests e2e/a11y/perf',
        'Mener un SEO multilingue SSR de bout en bout (hreflang, JSON-LD, sitemap dynamique)',
      ],
    },
    featured: true,
  },
  {
    id: 'portfolio',
    title: 'Ce Portfolio',
    period: {
      dateStart: new Date('2026-03-01'),
      isEnd: false,
    },
    shortDescription:
      'Portfolio nouvelle génération pensé comme une expérience immersive, alliant branding personnel, animation avancée et architecture front moderne.',
    longDescription:
      'Ce portfolio a été conçu comme bien plus qu’un simple site vitrine : il s’agit d’une démonstration technique complète de mon approche du développement front-end moderne. L’objectif était de créer une expérience immersive et hautement qualitative, capable de refléter mon niveau technique, ma sensibilité produit ainsi que mon attention au détail. L’ensemble de l’interface repose sur une architecture Angular moderne avec SSR, animations avancées, composants responsives réutilisables et optimisation poussée des performances.',
    category: 'personal',
    status: 'in_progress',
    stack: ['Angular', 'TypeScript', 'GSAP', 'SSR', 'CSS', 'Zoneless'],
    tags: ['Frontend', 'Animation', 'UX', 'Architecture UI', 'Branding', 'Performance'],
    links: {
      github: 'https://github.com/LINDECKER-Charles/MonPortfolio',
      website: 'https://charles-lindecker.com',
    },
    highlights: [
      'Architecture Angular moderne avec SSR et hydration',
      'Système de composants responsive réutilisables et fortement typés',
      'Animations avancées avec GSAP et reveal dynamique au scroll',
      'Optimisation Lighthouse / Core Web Vitals orientée performance réelle',
      'Design system custom cohérent avec identité visuelle forte',
    ],
    detail: {
      images: PORTFOLIO_IMAGES,
      lessonsLearned: [
        'Construire une architecture front scalable pour un site fortement animé',
        'Concilier animations riches et performances élevées sur mobile',
        'Travailler l’UX comme vecteur de branding technique',
        'Industrialiser la gestion des médias responsives dans Angular',
      ],
    },
  },
  {
    id: 'lis-web',
    title: 'LIS Web',
    period: {
      dateStart: new Date('2025-10-01'),
      dateEnd: new Date('2025-11-01'),
      isEnd: true,
    },
    shortDescription: 'Projet professionnel orienté présence web, vitrine et prestation réelle.',
    longDescription:
      'LIS Web représente un projet professionnel concret, pensé comme une solution web réelle et exploitable. Ce type de projet me permet de confronter les exigences techniques à des attentes de communication, de lisibilité, de clarté de contenu et de crédibilité de présence en ligne. Au-delà du développement pur, il s’agit aussi de produire une interface cohérente avec une identité et des besoins métier précis.',
    category: 'client',
    status: 'done',
    stack: ['Web', 'Front-end', 'Back-end'],
    tags: ['Professionnel', 'Vitrine', 'Client', 'Présence web', 'Communication'],
    links: {
      website: 'https://lis-web.com',
    },
    highlights: [
      'Travail sur une présence web crédible et exploitable',
      'Alignement entre attentes métier et réalisation technique',
      'Projet ancré dans une logique professionnelle réelle',
    ],
    detail: {
      images: LIS_WEB_IMAGES,
      lessonsLearned: [
        'Traduire des besoins métier en interface claire et structurée',
        'Travailler une présence web avec une vraie exigence de crédibilité',
        'Faire converger technique, image et lisibilité',
      ],
    },
  },
  {
    id: 'dev-mates',
    title: 'Dev-Mates',
    period: {
      dateStart: new Date('2025-09-01'),
      dateEnd: new Date('2026-12-01'),
      isEnd: true,
    },
    shortDescription:
      'Site vitrine de société, centré sur l’identité, la présentation de service et la crédibilité.',
    longDescription:
      'Dev-Mates est aujourd’hui le site vitrine de ma société. Le projet s’inscrit dans une logique de présence professionnelle, d’identité claire et de mise en valeur d’une offre de service. Il s’agit d’un support de communication autant qu’un projet technique, ce qui implique de trouver un équilibre entre image, structure, clarté du message et exécution propre.',
    category: 'client',
    status: 'done',
    stack: ['Web', 'Front-end', 'Branding'],
    tags: ['Société', 'Vitrine', 'Branding', 'Communication', 'Professionnel'],
    links: {
      website: 'https://dev-mates.com',
    },
    highlights: [
      'Travail sur la mise en valeur d’une activité professionnelle',
      'Cohérence entre message, image et structure du site',
      'Projet centré sur la crédibilité et la lisibilité',
    ],
    detail: {
      images: DEV_MATES_IMAGES,
      lessonsLearned: [
        'Construire un site qui sert autant la communication que la technique',
        'Mieux penser l’identité d’une structure à travers le web',
        'Assumer une approche plus orientée image sans perdre en rigueur',
      ],
    },
  },
  {
    id: 'lucie-fiquet-albin',
    title: 'Lucie Fiquet-Albin — Portfolio',
    period: {
      dateStart: new Date('2026-04-01'),
      isEnd: false,
    },
    shortDescription:
      'Portfolio sur-mesure pour une étudiante en communication évènementielle, articulé autour d’une carte stellaire des projets.',
    longDescription:
      'Portfolio professionnel conçu pour Lucie Fiquet-Albin, étudiante en BTS Communication à Nice qui se lance en freelance dans la communication évènementielle. Le site met en scène son identité avec une direction artistique sombre, typographique et cinématographique : titre gravé, italiques sang, vignettes lumineuses et navigation entre Projets, Expériences, Photographie et Profil. La section projets s’appuie sur une carte stellaire interactive permettant d’explorer les dossiers (Ink Intention, Hominum Game, COM ça Rouge, Chris Mae Rénovation, SDIS 06…) avec relations entre projets, fiche dédiée, filtres par constellation et recherche. Une page expériences détaille les missions (notamment G-Addiction Jeunesse Citoyenne) et un espace photographie réservé à son travail documentaire complète le dispositif. C’est un projet client qui pousse l’exigence visuelle et narrative, avec composants réutilisés et adaptés depuis mon propre portfolio.',
    category: 'client',
    status: 'in_progress',
    stack: ['Angular', 'TypeScript', 'GSAP', 'SSR', 'CSS'],
    tags: [
      'Client',
      'Portfolio',
      'Vitrine',
      'Communication',
      'Constellation',
      'Branding',
      'Animation',
    ],
    links: {
      website: 'https://test.lucie-fiquet-albin.com',
    },
    highlights: [
      'Direction artistique sombre, gravée et cinématographique alignée sur l’identité de Lucie',
      'Carte stellaire interactive des projets avec relations, filtres et fiche détaillée',
      'Architecture front réutilisant et adaptant les composants de mon propre portfolio',
    ],
    detail: {
      images: LUCIE_FIQUET_ALBIN_IMAGES,
      lessonsLearned: [
        'Adapter un design system existant à une identité cliente sans le diluer',
        'Industrialiser un composant constellation générique servant deux portfolios',
        'Traduire un univers visuel exigeant en interface lisible et navigable',
      ],
    },
    featured: true,
  },
  {
    id: 'pvz-fuzion-console-manager',
    title: 'PVZ Fuzion Console Manager',
    period: {
      dateStart: new Date('2025-01-01'),
      isEnd: false,
    },
    shortDescription:
      'Outil console permettant de vérifier les traductions manquantes sur une version donnée.',
    longDescription:
      'PVZ Fuzion Console Manager est un outil développé pour assister le suivi et la validation des traductions. Son rôle est de détecter les traductions manquantes sur une version précise et de simplifier le contrôle qualité autour du projet. C’est un utilitaire technique orienté productivité, pensé pour réduire les oublis, gagner du temps et fiabiliser le travail communautaire.',
    category: 'open_source',
    status: 'in_progress',
    stack: ['Console', 'Python', 'GitHub'],
    tags: ['Open Source', 'Outil', 'Console', 'Automatisation', 'Traduction', 'Qualité'],
    links: {
      github: 'https://github.com/LINDECKER-Charles/PVZ-Fuzion-ConsolManager',
    },
    highlights: [
      'Détection automatisée des traductions manquantes',
      'Outil de support à la qualité et au suivi de version',
      'Approche orientée utilité concrète pour la communauté',
    ],
    detail: {
      images: PVZF_CONSOLE_MANAGER_IMAGES,
      lessonsLearned: [
        'Créer des outils simples mais réellement utiles à un workflow existant',
        'Automatiser des tâches répétitives pour fiabiliser la qualité',
        'Penser un utilitaire à partir d’un besoin terrain très concret',
      ],
    },
  },
  {
    id: 'gup',
    title: 'Gup',
    period: {
      dateStart: new Date('2026-05-15'),
      isEnd: false,
    },
    shortDescription:
      'CLI unique pour scanner et mettre à jour tout ce qui est installé sur une machine de dev — plus de 130 gestionnaires de paquets.',
    longDescription:
      'gup (Global Updater) est un outil en ligne de commande qui unifie la mise à jour des logiciels installés sur une machine, en agrégeant plus de 130 sources : winget, scoop, choco, npm, pnpm, yarn, bun, pip, pipx, uv, cargo, gem, dotnet tools, helm, kubectl, terraform, extensions VSCode/JetBrains, distributions WSL et bien d’autres. Il répond à la fragmentation des gestionnaires de paquets via une interface unique, un mode interactif de sélection, un scan rapide, une sortie JSON pour le scripting CI/CD et une commande doctor de détection des providers. La sécurité est traitée en profondeur : exécution sans shell via execa (vecteur argv), HTTPS strict, analyse statique CodeQL/Semgrep/gitleaks et audit de dépendances automatisé.',
    category: 'open_source',
    status: 'in_progress',
    stack: ['TypeScript', 'Node.js', 'CLI', 'Vitest', 'execa'],
    tags: [
      'Open Source',
      'CLI',
      'Outil',
      'Automatisation',
      'DevTools',
      'Sécurité',
      'Cross-platform',
    ],
    links: {
      github: 'https://github.com/LINDECKER-Charles/gup',
      website: 'https://www.npmjs.com/package/@charles_lindecker/gup',
    },
    highlights: [
      'Interface unique de mise à jour pour 130+ providers (winget, npm, cargo, pip, kubectl…)',
      'Mode interactif, scan rapide, sortie JSON et commande doctor de détection',
      'Sécurité en profondeur : execa sans shell, HTTPS strict, CodeQL/Semgrep/gitleaks',
    ],
    detail: {
      images: GUP_IMAGES,
      lessonsLearned: [
        'Concevoir une abstraction commune au-dessus de dizaines de gestionnaires hétérogènes',
        'Industrialiser une CLI testable et scriptable pensée pour la CI/CD',
        'Appliquer une approche sécurité défense-en-profondeur à un outil système',
      ],
    },
    featured: true,
  },
  {
    id: 'img-convertor',
    title: 'Img Convertor',
    period: {
      dateStart: new Date('2026-04-20'),
      dateEnd: new Date('2026-04-20'),
      isEnd: true,
    },
    shortDescription:
      'Convertisseur d’images et redimensionneur responsive rapide pour le web — WebP, AVIF, JPEG, PNG, en CLI ou mode interactif.',
    longDescription:
      'img-convertor est un outil en ligne de commande dédié à la préparation d’assets web : conversion entre WebP, AVIF, JPEG et PNG, et génération de variantes responsives à des largeurs de breakpoints en préservant le ratio. Il propose à la fois une CLI soignée et une console interactive guidée, le traitement récursif de répertoires, des presets de breakpoints nommés et une configuration persistante (~/.img-convertor/config.json). L’architecture sépare une logique pure (core/) réutilisable des couches d’interface, autorisant un usage programmatique comme en standalone. Le projet s’appuie sur sharp pour l’encodage, Commander pour la CLI et Inquirer pour l’interactif, avec une couverture de tests à 100% et une CI GitHub Actions multi-OS.',
    category: 'open_source',
    status: 'done',
    stack: ['TypeScript', 'Node.js', 'sharp', 'Commander', 'Vitest'],
    tags: ['Open Source', 'CLI', 'Outil', 'Images', 'WebP', 'AVIF', 'Responsive'],
    links: {
      github: 'https://github.com/LINDECKER-Charles/Web-Image-Formateur',
      website: 'https://www.npmjs.com/package/@charles_lindecker/img-convertor',
    },
    highlights: [
      'Conversion WebP / AVIF / JPEG / PNG et redimensionnement responsive par breakpoints',
      'CLI soignée + console interactive, traitement récursif et presets configurables',
      'Architecture core/ pure découplée de l’UI, couverture de tests à 100%',
    ],
    detail: {
      images: IMG_CONVERTOR_IMAGES,
      lessonsLearned: [
        'Découpler une logique métier pure d’interfaces CLI et interactives',
        'Outiller la préparation d’assets web responsives de bout en bout',
        'Tenir une couverture de tests exhaustive sur un outil de traitement d’images',
      ],
    },
  },
  {
    id: 'shreksophone',
    title: 'Shreksophone',
    period: {
      dateStart: new Date('2025-09-01'),
      dateEnd: new Date('2026-03-31'),
      isEnd: true,
    },
    shortDescription:
      'Mini CDN troll qui remplace l’expérience utilisateur par une vidéo plein écran de Shrek au saxophone.',
    longDescription:
      'Shreksophone est un projet volontairement absurde, techniquement simple mais totalement assumé dans sa direction. Le principe est direct : un clic, et toute l’interface abandonne sa dignité pour laisser la place à une vidéo plein écran de Shrek sur un solo de saxophone. Derrière le ton volontairement troll, le projet m’a servi de terrain de jeu pour expérimenter un concept ultra-court, mémorable et poussé jusqu’au bout dans son identité.',
    category: 'personal',
    status: 'done',
    stack: ['HTML', 'Tailwind', 'CSS', 'JavaScript'],
    tags: ['Troll', 'Expérimentation', 'Front-end', 'UI', 'Humour', 'Concept'],
    links: {
      github: 'https://github.com/LINDECKER-Charles/ShrekSophone',
      website: 'https://shrek.charles-lindecker.com',
    },
    highlights: [
      'Concept volontairement minimaliste et immédiatement identifiable',
      'Exécution front-end simple mais efficace',
      'Direction créative entièrement assumée',
    ],
    detail: {
      images: SHREK_IMAGES,
      lessonsLearned: [
        'Aller au bout d’un concept même lorsqu’il est volontairement absurde',
        'Créer un projet mémorable avec très peu de complexité technique',
        'Travailler le ton, l’impact et la cohérence d’une expérience utilisateur atypique',
      ],
    },
  },
  {
    id: 'glossairequest',
    title: 'GlossaireQuest',
    period: {
      dateStart: new Date('2025-09-01'),
      dateEnd: new Date('2025-11-30'),
      isEnd: true,
    },
    shortDescription: 'Application web de quiz pédagogiques avec Angular et ASP.NET Core.',
    longDescription:
      'GlossaireQuest est une application web moderne développée avec Angular côté front-end et ASP.NET Core côté back-end. Elle permet aux utilisateurs de participer à des quiz interactifs sur différents thèmes pédagogiques, tout en proposant des statistiques, un suivi des résultats et une gestion d’administration pour la création de contenus. Le projet met en avant une architecture claire, une authentification sécurisée et une interface responsive pensée pour l’usage réel.',
    category: 'personal',
    status: 'done',
    stack: [
      'Angular 17',
      'ASP.NET Core',
      '.NET 8',
      'C#',
      'Tailwind CSS',
      'Entity Framework Core',
      'PostgreSQL',
      'JWT',
    ],
    tags: ['Quiz', 'Pédagogie', 'Authentification', 'Statistiques', 'Responsive', 'API REST'],
    links: {
      github: 'https://github.com/LINDECKER-Charles/GlossaireQuest',
      website: 'https://glossaire.bloodsouls-mail.com/home',
    },
    highlights: [
      'Authentification sécurisée via JWT',
      'Gestion de quiz, scores et statistiques utilisateur',
      'Architecture front/back claire entre Angular et ASP.NET Core',
    ],
    detail: {
      images: GLOSSAIRE_QUEST_IMAGES,
      lessonsLearned: [
        'Renforcer la séparation des responsabilités entre front Angular et API .NET',
        'Structurer des routes protégées et un cycle d’authentification propre',
        'Concevoir une application pédagogique avec logique métier et suivi utilisateur',
      ],
    },
    featured: false,
  },
  {
    id: 'league-of-data-base',
    title: 'League of Data Base',
    period: {
      dateStart: new Date('2025-06-01'),
      dateEnd: new Date('2025-10-31'),
      isEnd: true,
    },
    shortDescription:
      'Application web de centralisation des données de League of Legends, multilingue et multi-version.',
    longDescription:
      'League of Data Base est une application web conçue pour centraliser, stocker et afficher les données de League of Legends via une interface claire, responsive et rapide. Le projet répond à un besoin concret : accéder facilement aux informations du jeu, dans la langue et la version souhaitées, sans dépendre d’outils dispersés ou incomplets. L’application a été pensée comme une base extensible, capable de gérer champions, objets, runes et autres ressources tout en restant maintenable dans le temps.',
    category: 'personal',
    status: 'done',
    stack: ['Symfony 7', 'PHP 8.3', 'Twig', 'Tailwind CSS', 'Riot API', 'JavaScript', 'Linux'],
    tags: [
      'API',
      'Architecture',
      'Multilingue',
      'Multi-version',
      'Performance',
      'Responsive',
      'Web App',
    ],
    links: {
      github: 'https://github.com/LINDECKER-Charles/LeagueOfDataBaseFinal',
      website: 'https://www.league-of-data-base.com',
    },
    highlights: [
      'Intégration de l’API Riot Games avec gestion du multilingue et du multi-version',
      'Optimisation du stockage avec hard links pour éviter la duplication d’images',
      'Interface responsive claire et rapide avec Twig et Tailwind CSS',
    ],
    detail: {
      images: LODB_IMAGES,
      lessonsLearned: [
        'Concevoir une architecture extensible autour d’une API évolutive',
        'Optimiser le stockage et le rendu d’un grand volume de médias',
        'Gérer des préférences utilisateur partagées entre sessions, cookies et URL',
      ],
    },
    featured: true,
  },
  {
    id: 'blender-collection',
    title: 'Blender Collection',
    period: {
      dateStart: new Date('2025-07-01'),
      dateEnd: new Date('2025-09-31'),
      isEnd: true,
    },
    shortDescription: 'Plateforme web de gestion et de partage de collections d’add-ons Blender.',
    longDescription:
      'Blender Collection est une application web pensée pour centraliser, organiser et partager des add-ons Blender. L’objectif est de permettre aux utilisateurs de créer leurs propres collections, de les rendre publiques ou privées, puis de télécharger leurs extensions en un seul fichier. Le projet met l’accent sur la gestion communautaire, les rôles, la supervision administrative et une expérience fluide malgré la manipulation de fichiers potentiellement volumineux.',
    category: 'personal',
    status: 'done',
    stack: [
      'Symfony 7',
      'PHP 8.3',
      'PostgreSQL',
      'Tailwind CSS',
      'JavaScript',
      'Docker',
      'GitHub Actions',
      'PHPUnit',
    ],
    tags: [
      'Communauté',
      'Dashboard',
      'Admin',
      'Fichiers',
      'Workers',
      'Cache',
      'CI/CD',
      'Open Source',
    ],
    links: {
      github: 'https://github.com/LINDECKER-Charles/BlenderAdd-OnListe',
      website: 'https://www.blend-collection.com',
    },
    highlights: [
      'Gestion de profils utilisateurs, collections et visibilité publique/privée',
      'Dashboard administrateur avec analytics et supervision',
      'Workers asynchrones et cache pour améliorer l’expérience utilisateur',
    ],
    detail: {
      images: BLENDER_COLLECTION_IMAGES,
      lessonsLearned: [
        'Structurer une application communautaire avec plusieurs niveaux de rôles',
        'Traiter des opérations lourdes sans bloquer l’interface',
        'Mettre en place une chaîne de déploiement plus professionnelle avec Docker et GitHub Actions',
      ],
    },
    featured: true,
  },
];
