import { ResponsiveSource } from '../../../assets/responsive-picture/responsive-picture';

export interface HomeResumeSnippetState {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  iconAlt: string;
  iconSources: ResponsiveSource[];
  iconFallback: string;
}

export const HOME_RESUME_PHOTO_SOURCES: ResponsiveSource[] = [
  { src: '/photos/640x853_me.webp' +
      '', maxWidth: 730, type: 'image/webp' },
  { src: '/photos/me.webp', type: 'image/webp' },
];

export const HOME_RESUME_PHOTO_FALLBACK = '/photos/me.webp';

export const HOME_RESUME_LUCIDITY_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_lucidity.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_lucidity.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_lucidity.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_lucidity.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/lucidity.webp', type: 'image/webp' },
];

export const HOME_RESUME_LUCIDITY_FALLBACK = '/icon/lucidity.webp';

export const HOME_RESUME_LEVEL_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_level.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_level.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_level.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_level.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/level.webp', type: 'image/webp' },
];

export const HOME_RESUME_LEVEL_FALLBACK = '/icon/level.webp';

export const HOME_RESUME_ESO_RESIST_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_eso_resist.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_eso_resist.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_eso_resist.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_eso_resist.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/eso_resist.webp', type: 'image/webp' },
];

export const HOME_RESUME_ESO_RESIST_FALLBACK = '/icon/eso_resist.webp';

export const HOME_RESUME_FIRE_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_fire.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_fire.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_fire.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_fire.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/fire.webp', type: 'image/webp' },
];

export const HOME_RESUME_FIRE_FALLBACK = '/icon/fire.webp';

export const HOME_RESUME_PHYSIQUE_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_physique.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_physique.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_physique.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_physique.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/physique.webp', type: 'image/webp' },
];

export const HOME_RESUME_PHYSIQUE_FALLBACK = '/icon/physique.webp';

export const HOME_RESUME_POUSSE_RES_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_pousse_res.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_pousse_res.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_pousse_res.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_pousse_res.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/pousse_res.webp', type: 'image/webp' },
];

export const HOME_RESUME_POUSSE_RES_FALLBACK = '/icon/pousse_res.webp';

export const HOME_RESUME_DEX_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_dex.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_dex.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_dex.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_dex.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/dex.webp', type: 'image/webp' },
];

export const HOME_RESUME_DEX_FALLBACK = '/icon/dex.webp';

export const HOME_RESUME_DISCOVER_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_discover.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_discover.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_discover.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_discover.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/discover.webp', type: 'image/webp' },
];

export const HOME_RESUME_DISCOVER_FALLBACK = '/icon/discover.webp';

export const HOME_RESUME_ESO_SOURCES: ResponsiveSource[] = [
  { src: '/icon/24x24_eso.webp', maxWidth: 320, type: 'image/webp' },
  { src: '/icon/40x40_eso.webp', maxWidth: 480, type: 'image/webp' },
  { src: '/icon/80x80_eso.webp', maxWidth: 768, type: 'image/webp' },
  { src: '/icon/160x160_eso.webp', maxWidth: 1200, type: 'image/webp' },
  { src: '/icon/eso.webp', type: 'image/webp' },
];

export const HOME_RESUME_ESO_FALLBACK = '/icon/eso.webp';

export const HOME_RESUME_SNIPPETS: HomeResumeSnippetState[] = [
  {
    id: 'architecture',
    title: 'Architecture',
    content:
      'Développeur web orienté back-end, je conçois des applications robustes avec une attention particulière portée à l’architecture, à la clarté du code et à la maintenabilité. J’apprécie les environnements structurés, les logiques métier exigeantes et les projets où la technique soutient une vision cohérente.',
    isOpen: false,
    iconAlt: 'Icône architecture',
    iconSources: HOME_RESUME_DEX_SOURCES,
    iconFallback: HOME_RESUME_DEX_FALLBACK,
  },
  {
    id: 'stack',
    title: 'Stack',
    content:
      'Je travaille principalement avec ASP.NET, Angular, Symfony, PostgreSQL et JavaScript. Mon approche reste pragmatique : poser des bases solides, factoriser proprement, limiter la dette technique et garder un code lisible, stable et évolutif.',
    isOpen: false,
    iconAlt: 'Icône stack',
    iconSources: HOME_RESUME_DISCOVER_SOURCES,
    iconFallback: HOME_RESUME_DISCOVER_FALLBACK,
  },
  {
    id: 'transmission',
    title: 'Transmission',
    content:
      'En parallèle du développement, j’interviens aussi en formation. J’aime transmettre, vulgariser et aider d’autres personnes à progresser avec sérieux. Cette double approche renforce chez moi une exigence simple : produire un code compréhensible, durable et utile.',
    isOpen: false,
    iconAlt: 'Icône transmission',
    iconSources: HOME_RESUME_ESO_SOURCES,
    iconFallback: HOME_RESUME_ESO_FALLBACK,
  },
];
