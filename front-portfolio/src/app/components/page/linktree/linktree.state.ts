import { ResponsiveSource } from '../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../img-sources/shared.sources';

export type LinktreeIconKind = 'picture' | 'svg' | 'emoji';

export type LinktreeSvgKey = 'discord' | 'npm';

export interface LinktreeIcon {
  kind: LinktreeIconKind;
  sources?: ResponsiveSource[];
  fallback?: string;
  svg?: LinktreeSvgKey;
  emoji?: string;
}

export interface LinktreeLink {
  id: string;
  /** Brand name kept as-is (non traduit). */
  label: string;
  /** Handle / identifiant affiché sous le label (non traduit). */
  handle: string;
  href: string;
  icon: LinktreeIcon;
  external: boolean;
}

export interface LinktreeSection {
  id: string;
  /** Index romain affiché (I, II, III, IV) pour le numéro cinématique. */
  numeral: string;
  links: LinktreeLink[];
}

const picture = (set: { sources: ResponsiveSource[]; fallbackSrc: string }): LinktreeIcon => ({
  kind: 'picture',
  sources: set.sources,
  fallback: set.fallbackSrc,
});

const svg = (key: LinktreeSvgKey): LinktreeIcon => ({ kind: 'svg', svg: key });

const emoji = (value: string): LinktreeIcon => ({ kind: 'emoji', emoji: value });

export const LINKTREE_SECTIONS: LinktreeSection[] = [
  {
    id: 'network',
    numeral: 'I',
    links: [
      {
        id: 'linkedin',
        label: 'LinkedIn',
        handle: 'in/charles-lindecker',
        href: 'https://www.linkedin.com/in/charles-lindecker/',
        icon: picture(SHARED_IMAGES.stack.linkedin),
        external: true,
      },
      {
        id: 'github',
        label: 'GitHub',
        handle: 'LINDECKER-Charles',
        href: 'https://github.com/LINDECKER-Charles',
        icon: picture(SHARED_IMAGES.stack.github),
        external: true,
      },
      {
        id: 'discord',
        label: 'Discord',
        handle: '@hexanti',
        href: 'https://discord.com/users/hexanti',
        icon: svg('discord'),
        external: true,
      },
    ],
  },
  {
    id: 'craft',
    numeral: 'II',
    links: [
      {
        id: 'frontend-mentor',
        label: 'Frontend Mentor',
        handle: 'LINDECKER-Charles',
        href: 'https://www.frontendmentor.io/profile/LINDECKER-Charles',
        icon: picture(SHARED_IMAGES.other.frontendMentor),
        external: true,
      },
      {
        id: 'freecodecamp',
        label: 'freeCodeCamp',
        handle: '/hexanti',
        href: 'https://www.freecodecamp.org/hexanti',
        icon: picture(SHARED_IMAGES.organism.freecodecamp),
        external: true,
      },
      {
        id: 'rootme',
        label: 'Root-Me',
        handle: 'HexAnti',
        href: 'https://www.root-me.org/HexAnti?lang=fr#fe1d7bf8cf1a086d4c1048db6b9acd55',
        icon: picture(SHARED_IMAGES.other.rootme),
        external: true,
      },
      {
        id: 'npm',
        label: 'npm',
        handle: '~charles_lindecker',
        href: 'https://www.npmjs.com/~charles_lindecker',
        icon: svg('npm'),
        external: true,
      },
    ],
  },
  {
    id: 'arena',
    numeral: 'III',
    links: [
      {
        id: 'gwent',
        label: 'Gwent',
        handle: 'Smoke2420',
        href: 'https://www.playgwent.com/fr/profile/Smoke2420',
        icon: picture(SHARED_IMAGES.other.gwent),
        external: true,
      },
      {
        id: 'opgg',
        label: 'League of Legends',
        handle: 'HexAnti #3382 (EUW)',
        href: 'https://op.gg/fr/lol/summoners/euw/HexAnti-3382',
        icon: picture(SHARED_IMAGES.other.opgg),
        external: true,
      },
    ],
  },
  {
    id: 'summon',
    numeral: 'IV',
    links: [
      {
        id: 'email',
        label: 'Email',
        handle: 'charles.lindecker@outlook.fr',
        href: 'mailto:charles.lindecker@outlook.fr',
        icon: picture(SHARED_IMAGES.stack.mail),
        external: false,
      },
      {
        id: 'devmates',
        label: 'DevMates',
        handle: 'dev-mates.com',
        href: 'https://dev-mates.com',
        icon: picture(SHARED_IMAGES.organism.devmates),
        external: true,
      },
    ],
  },
];
