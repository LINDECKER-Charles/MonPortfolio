export type ProjectCategory =
  | 'all'
  | 'personal'
  | 'open_source'
  | 'client'
  | 'training';

export type ProjectStatus =
  | 'done'
  | 'in_progress'
  | 'archived';

export interface ProjectLinkSet {
  github?: string;
  demo?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  period: string;
  shortDescription: string;
  longDescription: string;
  category: Exclude<ProjectCategory, 'all'>;
  status: ProjectStatus;
  stack: string[];
  tags: string[];
  highlights: string[];
  links: ProjectLinkSet;
  isOpen: boolean;
  featured?: boolean;
}

export interface ProjectFilterItem {
  id: ProjectCategory;
  label: string;
}

export const PROJECT_FILTERS: ProjectFilterItem[] = [
  { id: 'all', label: 'Tous' },
  { id: 'personal', label: 'Personnel' },
  { id: 'open_source', label: 'Open Source' },
  { id: 'client', label: 'Client' },
  { id: 'training', label: 'Formation' },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'omnicard',
    title: 'Omnicard',
    period: '2025 - en cours',
    shortDescription:
      'Moteur de jeu de cartes orienté architecture métier, logique complexe et temps réel.',
    longDescription:
      'Omnicard est un projet personnel centré sur la conception d’un moteur de jeu de cartes robuste. Le projet met l’accent sur la modélisation métier, la gestion des effets, la clarté de l’architecture et la communication temps réel entre les joueurs. Il me permet de travailler à la fois la qualité du back-end, la structuration des règles de jeu et l’intégration front avec Angular.',
    category: 'personal',
    status: 'in_progress',
    stack: ['C#', '.NET', 'Angular', 'SignalR', 'PostgreSQL'],
    tags: ['Architecture', 'Temps réel', 'Jeu', 'DDD'],
    highlights: [
      'Conception d’un moteur métier modulaire et testable',
      'Gestion des sessions et synchronisation temps réel',
      'Réflexion poussée sur les effets, événements et règles',
    ],
    links: {
      github: '#',
      demo: '#',
    },
    isOpen: false,
    featured: true,
  },
  {
    id: 'portfolio',
    title: 'Portfolio Bloodborne',
    period: '2026',
    shortDescription:
      'Portfolio personnel avec direction artistique forte, animations et structure modulaire Angular.',
    longDescription:
      'Ce portfolio est pensé comme une expérience à part entière. Au-delà de la présentation de mon travail, il me sert de terrain d’expérimentation sur les animations, le découpage en composants, le responsive design, le SSR Angular et l’identité visuelle. Chaque section est conçue pour rester maintenable tout en conservant une forte personnalité graphique.',
    category: 'personal',
    status: 'in_progress',
    stack: ['Angular', 'TypeScript', 'GSAP', 'SSR'],
    tags: ['UI', 'Animation', 'Portfolio', 'Design system'],
    highlights: [
      'Architecture modulaire par section et sous-composants',
      'Animations progressives SSR-safe',
      'Construction d’une identité visuelle cohérente',
    ],
    links: {
      github: '#',
      demo: '#',
    },
    isOpen: false,
  },
  {
    id: 'opensource-tools',
    title: 'Outils & Contributions Open Source',
    period: '2024 - 2026',
    shortDescription:
      'Scripts, utilitaires, correctifs et contributions orientés productivité et qualité logicielle.',
    longDescription:
      'En parallèle de mes projets principaux, je développe et publie des outils ou contributions qui me permettent d’explorer d’autres problématiques : automatisation, correction de bugs, amélioration de workflows ou petits utilitaires techniques. Ces travaux prolongent ma pratique du développement en dehors du cadre purement client ou académique.',
    category: 'open_source',
    status: 'done',
    stack: ['TypeScript', 'Python', 'GitHub', 'Symfony'],
    tags: ['Open Source', 'Outils', 'Automatisation', 'Qualité'],
    highlights: [
      'Développement d’outils réutilisables',
      'Approche orientée clarté et maintenabilité',
      'Publication et structuration du code pour partage',
    ],
    links: {
      github: '#',
    },
    isOpen: false,
  },
];
