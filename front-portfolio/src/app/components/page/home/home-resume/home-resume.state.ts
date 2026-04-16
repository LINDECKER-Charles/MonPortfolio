import { ResponsiveSource } from '../../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../../img-sources/shared.sources';

export interface HomeResumeSnippetState {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  iconAlt: string;
  iconSources: ResponsiveSource[];
  iconFallback: string;
}

export const HOME_RESUME_PHOTO_SOURCES: ResponsiveSource[] = SHARED_IMAGES.photo.me.sources;
export const HOME_RESUME_PHOTO_FALLBACK = SHARED_IMAGES.photo.me.fallbackSrc;
export const HOME_RESUME_LUCIDITY_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.lucidity.sources;
export const HOME_RESUME_LUCIDITY_FALLBACK = SHARED_IMAGES.icon.lucidity.fallbackSrc;
export const HOME_RESUME_LEVEL_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.level.sources;
export const HOME_RESUME_LEVEL_FALLBACK = SHARED_IMAGES.icon.level.fallbackSrc;
export const HOME_RESUME_ESO_RESIST_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.esoResist.sources;
export const HOME_RESUME_ESO_RESIST_FALLBACK = SHARED_IMAGES.icon.esoResist.fallbackSrc;
export const HOME_RESUME_FIRE_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.fire.sources;
export const HOME_RESUME_FIRE_FALLBACK = SHARED_IMAGES.icon.fire.fallbackSrc;
export const HOME_RESUME_PHYSIQUE_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.physique.sources;
export const HOME_RESUME_PHYSIQUE_FALLBACK = SHARED_IMAGES.icon.physique.fallbackSrc;
export const HOME_RESUME_POUSSE_RES_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.pousseRes.sources;
export const HOME_RESUME_POUSSE_RES_FALLBACK = SHARED_IMAGES.icon.pousseRes.fallbackSrc;
export const HOME_RESUME_DEX_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.dex.sources;
export const HOME_RESUME_DEX_FALLBACK = SHARED_IMAGES.icon.dex.fallbackSrc;
export const HOME_RESUME_DISCOVER_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.discover.sources;
export const HOME_RESUME_DISCOVER_FALLBACK = SHARED_IMAGES.icon.discover.fallbackSrc;
export const HOME_RESUME_ESO_SOURCES: ResponsiveSource[] = SHARED_IMAGES.icon.eso.sources;
export const HOME_RESUME_ESO_FALLBACK = SHARED_IMAGES.icon.eso.fallbackSrc;

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
