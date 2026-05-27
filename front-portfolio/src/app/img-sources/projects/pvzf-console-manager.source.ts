import { ProjectMediaImage } from '../../components/page/projects/projects.state';
import { buildProjectImage } from './project-image.builder';

export const PVZF_CONSOLE_MANAGER_IMAGE = buildProjectImage(
  'PVZF-Console-Manager',
  'pvzf-console',
  'PVZ Fuzion Console Manager',
  [
    { width: 24, height: 18 },
    { width: 40, height: 30 },
    { width: 80, height: 61 },
    { width: 160, height: 121 },
    { width: 320, height: 242 },
    { width: 640, height: 484 },
    { width: 768, height: 581 },
    { width: 1024, height: 775 },
  ]
);

export const PVZF_CONSOLE_MANAGER_IMAGES: ProjectMediaImage[] = [PVZF_CONSOLE_MANAGER_IMAGE];
