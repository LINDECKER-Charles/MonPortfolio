import { ProjectMediaImage } from '../../components/page/projects/projects.state';
import { buildProjectImage } from './project-image.builder';

export const PVZF_TRADUCTION_GITHUB_IMAGE = buildProjectImage(
  'PVZF-Traduction',
  'github',
  'PVZF Translation FR sur GitHub',
  [
    { width: 24, height: 17 },
    { width: 40, height: 28 },
    { width: 80, height: 56 },
    { width: 160, height: 113 },
    { width: 320, height: 225 },
    { width: 640, height: 451 },
    { width: 768, height: 541 },
    { width: 1024, height: 721 },
    { width: 1280, height: 902 },
    { width: 1536, height: 1082 },
  ],
);

export const PVZF_TRADUCTION_CONTRIBUTION_IMAGE = buildProjectImage(
  'PVZF-Traduction',
  'contribution',
  'PVZF Translation FR contribution',
  [
    { width: 24, height: 20 },
    { width: 40, height: 33 },
    { width: 80, height: 66 },
    { width: 160, height: 132 },
    { width: 320, height: 265 },
    { width: 640, height: 530 },
    { width: 768, height: 636 },
    { width: 1024, height: 848 },
    { width: 1280, height: 1059 },
    { width: 1536, height: 1271 },
  ],
);

export const PVZF_TRADUCTION_P1_IMAGE = buildProjectImage(
  'PVZF-Traduction',
  'p1',
  'PVZF Translation FR aperçu en jeu',
  [
    { width: 24, height: 14 },
    { width: 40, height: 23 },
    { width: 80, height: 45 },
    { width: 160, height: 90 },
    { width: 320, height: 180 },
    { width: 640, height: 360 },
    { width: 768, height: 432 },
    { width: 1024, height: 576 },
  ],
);

export const PVZF_TRADUCTION_IMAGES: ProjectMediaImage[] = [
  PVZF_TRADUCTION_P1_IMAGE,
  PVZF_TRADUCTION_GITHUB_IMAGE,
  PVZF_TRADUCTION_CONTRIBUTION_IMAGE,
];
