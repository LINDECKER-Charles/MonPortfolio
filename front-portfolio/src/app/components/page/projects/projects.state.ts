import { ResponsiveSource } from '../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../img-sources/shared.sources';
import {OMNICARD_IMAGES} from '../../../img-sources/projects/omnicard.sources';
import {LIS_WEB_IMAGES} from '../../../img-sources/projects/lis.source';
import {DEV_MATES_IMAGES} from '../../../img-sources/projects/devmates.source';
import {SHREK_IMAGES} from '../../../img-sources/projects/shrek.source';
import {LODB_IMAGES} from '../../../img-sources/projects/lodb.source';
import {BLENDER_COLLECTION_IMAGES} from '../../../img-sources/projects/blendercollection.source';

export interface Period {
  dateStart: Date;
  dateEnd?: Date;
  isEnd: boolean;
}

export interface ProjectMediaImage {
  alt: string;
  fallbackSrc: string;
  sources: ResponsiveSource[];
}

export interface ProjectDetail {
  video?: string;
  images?: ProjectMediaImage[];
  lessonsLearned?: string[];
}

export type ProjectCategory =
  | 'personal'
  | 'open_source'
  | 'client';

export type ProjectStatus =
  | 'done'
  | 'in_progress'
  | 'archived';

export interface ProjectLinkSet {
  github?: string;
  demo?: string;
  website?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  period: Period;
  shortDescription: string;
  longDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  stack: string[];
  tags: string[];
  links: ProjectLinkSet;
  highlights: string[];
  detail?: ProjectDetail;
  featured?: boolean;
}

export interface ProjectFilterItem {
  id: ProjectCategory | 'all';
  label: string;
}

export interface ProjectFiltersState {
  category: ProjectCategory | 'all';
  tags: string[];
  stack: string[];
}

export const PROJECT_FILTERS: ProjectFilterItem[] = [
  { id: 'all', label: 'Tous' },
  { id: 'personal', label: 'Personnel' },
  { id: 'open_source', label: 'Open Source' },
  { id: 'client', label: 'Client' },
];

const omnicardImages: ProjectMediaImage[] = [
  {
    alt: 'Aperçu Omnicard 1',
    fallbackSrc: SHARED_IMAGES.photo.me.fallbackSrc,
    sources: SHARED_IMAGES.photo.me.sources,
  },
  {
    alt: 'Aperçu Omnicard 2',
    fallbackSrc: SHARED_IMAGES.photo.me.fallbackSrc,
    sources: SHARED_IMAGES.photo.me.sources,
  },
];

const portfolioImages: ProjectMediaImage[] = [
  {
    alt: 'Aperçu Portfolio 1',
    fallbackSrc: SHARED_IMAGES.photo.me.fallbackSrc,
    sources: SHARED_IMAGES.photo.me.sources,
  },
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
    stack: [
      'C#',
      '.NET',
      'Angular',
      'SignalR',
      'PostgreSQL',
      'TypeScript',
      'XUnit'
    ],
    tags: [
      'Architecture',
      'Jeu',
      'Temps réel',
      'DDD',
      'Moteur métier',
      'Full Stack',
    ],
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
    tags: [
      'Open Source',
      'Traduction',
      'Lead',
      'Coordination',
      'Qualité',
      'Communauté',
    ],
    links: {
      github: 'https://github.com/LINDECKER-Charles/PVZF-Translation-fr',
    },
    highlights: [
      'Lead sur la partie française du projet',
      'Suivi de cohérence terminologique et qualitative',
      'Travail de coordination et de structuration de contribution',
    ],
    detail: {
      images: [],
      lessonsLearned: [
        'Piloter un travail collaboratif avec une exigence de cohérence',
        'Formaliser des standards de traduction et de validation',
        'Travailler la qualité dans un contexte communautaire évolutif',
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
    stack: [
      'Angular',
      'TypeScript',
      'GSAP',
      'SSR',
      'CSS',
      'Zoneless'
    ],
    tags: [
      'Frontend',
      'Animation',
      'UX',
      'Architecture UI',
      'Branding',
      'Performance',
    ],
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
      images: [],
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
    shortDescription:
      'Projet professionnel orienté présence web, vitrine et prestation réelle.',
    longDescription:
      'LIS Web représente un projet professionnel concret, pensé comme une solution web réelle et exploitable. Ce type de projet me permet de confronter les exigences techniques à des attentes de communication, de lisibilité, de clarté de contenu et de crédibilité de présence en ligne. Au-delà du développement pur, il s’agit aussi de produire une interface cohérente avec une identité et des besoins métier précis.',
    category: 'client',
    status: 'done',
    stack: ['Web', 'Front-end', 'Back-end'],
    tags: [
      'Professionnel',
      'Vitrine',
      'Client',
      'Présence web',
      'Communication',
    ],
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
    tags: [
      'Société',
      'Vitrine',
      'Branding',
      'Communication',
      'Professionnel',
    ],
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
    tags: [
      'Open Source',
      'Outil',
      'Console',
      'Automatisation',
      'Traduction',
      'Qualité',
    ],
    links: {
      github: 'https://github.com/LINDECKER-Charles/PVZ-Fuzion-ConsolManager',
    },
    highlights: [
      'Détection automatisée des traductions manquantes',
      'Outil de support à la qualité et au suivi de version',
      'Approche orientée utilité concrète pour la communauté',
    ],
    detail: {
      images: [],
      lessonsLearned: [
        'Créer des outils simples mais réellement utiles à un workflow existant',
        'Automatiser des tâches répétitives pour fiabiliser la qualité',
        'Penser un utilitaire à partir d’un besoin terrain très concret',
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
    tags: [
      'Troll',
      'Expérimentation',
      'Front-end',
      'UI',
      'Humour',
      'Concept',
    ],
    links: {
      github: 'https://github.com/LINDECKER-Charles/ShrekSophone',
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
    shortDescription:
      'Application web de quiz pédagogiques avec Angular et ASP.NET Core.',
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
    tags: [
      'Quiz',
      'Pédagogie',
      'Authentification',
      'Statistiques',
      'Responsive',
      'API REST',
    ],
    links: {
      github: 'https://github.com/LINDECKER-Charles/GlossaireQuest',
    },
    highlights: [
      'Authentification sécurisée via JWT',
      'Gestion de quiz, scores et statistiques utilisateur',
      'Architecture front/back claire entre Angular et ASP.NET Core',
    ],
    detail: {
      images: [],
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
    stack: [
      'Symfony 7',
      'PHP 8.3',
      'Twig',
      'Tailwind CSS',
      'Riot API',
      'JavaScript',
      'Linux',
    ],
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
    shortDescription:
      'Plateforme web de gestion et de partage de collections d’add-ons Blender.',
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
  {
    id: 'symfony-session',
    title: 'SymfonySession',
    period: {
      dateStart: new Date('2025-06-01'),
      dateEnd: new Date('2025-06-30'),
      isEnd: true,
    },
    shortDescription:
      'Application Symfony complète orientée gestion de sessions, sécurité web et administration.',
    longDescription:
      'SymfonySession est une application web développée pour illustrer des cas concrets de gestion de sessions, de sécurité applicative et d’administration. Le projet sert de base solide pour des outils de back-office ou des plateformes de formation, avec un accent fort sur la sécurité, la maintenabilité et l’expérience utilisateur. Il intègre à la fois des fonctionnalités métier complètes et plusieurs mécanismes de protection contre les abus.',
    category: 'personal',
    status: 'done',
    stack: [
      'Symfony 6',
      'PHP',
      'Doctrine ORM',
      'Tailwind CSS',
      'FullCalendar.js',
      'DomPDF',
    ],
    tags: [
      'Sécurité',
      'Session',
      'Back-office',
      'CRUD',
      'PDF',
      'Calendrier',
      'Administration',
    ],
    links: {
      github: 'https://github.com/LINDECKER-Charles/SymfonySession',
    },
    highlights: [
      'Captcha Google v3, honeypot et rate limiter',
      'CRUD complet pour utilisateurs, stagiaires, modules et programmes',
      'Génération de PDF et visualisation dynamique via FullCalendar',
    ],
    detail: {
      images: [],
      lessonsLearned: [
        'Renforcer une application Symfony avec plusieurs couches de sécurité',
        'Structurer une base de code MVC claire sur un projet administratif complet',
        'Mieux articuler ergonomie front et logique de gestion côté serveur',
      ],
    },
  },
];
