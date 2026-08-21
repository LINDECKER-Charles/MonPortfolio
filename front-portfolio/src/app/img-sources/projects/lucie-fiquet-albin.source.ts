import { ProjectMediaImage } from '../../components/page/projects/projects.state';
import { buildProjectImage } from './project-image.builder';

export const LUCIE_FIQUET_ALBIN_HOME_IMAGE = buildProjectImage(
  'LucieFiquetAlbin-Portefolio',
  'home',
  'Lucie Fiquet-Albin portfolio home',
  [
    { width: 24, height: 15 },
    { width: 40, height: 25 },
    { width: 80, height: 49 },
    { width: 160, height: 99 },
    { width: 320, height: 198 },
    { width: 640, height: 395 },
    { width: 768, height: 474 },
    { width: 1024, height: 632 },
    { width: 1280, height: 790 },
    { width: 1536, height: 949 },
  ],
);

export const LUCIE_FIQUET_ALBIN_PROFIL_IMAGE = buildProjectImage(
  'LucieFiquetAlbin-Portefolio',
  'profil',
  'Lucie Fiquet-Albin page profil',
  [
    { width: 24, height: 17 },
    { width: 40, height: 28 },
    { width: 80, height: 57 },
    { width: 160, height: 114 },
    { width: 320, height: 227 },
    { width: 640, height: 454 },
    { width: 768, height: 545 },
    { width: 1024, height: 727 },
    { width: 1280, height: 909 },
    { width: 1536, height: 1091 },
  ],
);

export const LUCIE_FIQUET_ALBIN_PROJECT_IMAGE = buildProjectImage(
  'LucieFiquetAlbin-Portefolio',
  'project',
  'Lucie Fiquet-Albin carte stellaire des projets',
  [
    { width: 24, height: 14 },
    { width: 40, height: 23 },
    { width: 80, height: 46 },
    { width: 160, height: 92 },
    { width: 320, height: 184 },
    { width: 640, height: 368 },
    { width: 768, height: 442 },
    { width: 1024, height: 589 },
    { width: 1280, height: 737 },
    { width: 1536, height: 884 },
  ],
);

export const LUCIE_FIQUET_ALBIN_XP_IMAGE = buildProjectImage(
  'LucieFiquetAlbin-Portefolio',
  'xp-1',
  'Lucie Fiquet-Albin fiche expérience G-Addiction',
  [
    { width: 24, height: 14 },
    { width: 40, height: 23 },
    { width: 80, height: 47 },
    { width: 160, height: 93 },
    { width: 320, height: 187 },
    { width: 640, height: 374 },
    { width: 768, height: 448 },
    { width: 1024, height: 598 },
    { width: 1280, height: 747 },
    { width: 1536, height: 897 },
  ],
);

export const LUCIE_FIQUET_ALBIN_PHOTO_IMAGE = buildProjectImage(
  'LucieFiquetAlbin-Portefolio',
  'photo',
  'Lucie Fiquet-Albin galerie Le regard documentaire',
  [
    { width: 24, height: 15 },
    { width: 40, height: 24 },
    { width: 80, height: 49 },
    { width: 160, height: 97 },
    { width: 320, height: 195 },
    { width: 640, height: 390 },
    { width: 768, height: 468 },
    { width: 1024, height: 624 },
    { width: 1280, height: 780 },
    { width: 1536, height: 936 },
  ],
);

export const LUCIE_FIQUET_ALBIN_IMAGES: ProjectMediaImage[] = [
  LUCIE_FIQUET_ALBIN_HOME_IMAGE,
  LUCIE_FIQUET_ALBIN_PROFIL_IMAGE,
  LUCIE_FIQUET_ALBIN_PROJECT_IMAGE,
  LUCIE_FIQUET_ALBIN_XP_IMAGE,
  LUCIE_FIQUET_ALBIN_PHOTO_IMAGE,
];
