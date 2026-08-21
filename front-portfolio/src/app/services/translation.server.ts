/**
 * Baseline FR embarquée au build dans le bundle serveur uniquement
 * (importé par app.config.server.ts — jamais référencé côté browser).
 * Le `satisfies Record<Namespace, …>` garantit à la compilation la couverture
 * de tous les namespaces de NAMESPACES (translation.service.ts).
 */
import type { Namespace } from './translation.service';
import common from '../../../public/lang/common/common.fr.json';
import footer from '../../../public/lang/footer/footer.fr.json';
import homeProjects from '../../../public/lang/home-projects/home-projects.fr.json';
import homeResume from '../../../public/lang/home-resume/home-resume.fr.json';
import homeWork from '../../../public/lang/home-work/home-work.fr.json';
import legal from '../../../public/lang/legal/legal.fr.json';
import linktree from '../../../public/lang/linktree/linktree.fr.json';
import navBarre from '../../../public/lang/nav-barre/nav-barre.fr.json';
import opening from '../../../public/lang/opening/opening.fr.json';
import photoCarousel from '../../../public/lang/photo-carousel/photo-carousel.fr.json';
import projects from '../../../public/lang/projects/projects.fr.json';
import resum from '../../../public/lang/resum/resum.fr.json';
import works from '../../../public/lang/works/works.fr.json';

export const SERVER_FR_TRANSLATIONS = {
  common,
  footer,
  'home-projects': homeProjects,
  'home-resume': homeResume,
  'home-work': homeWork,
  legal,
  linktree,
  'nav-barre': navBarre,
  opening,
  'photo-carousel': photoCarousel,
  projects,
  resum,
  works,
} satisfies Record<Namespace, Record<string, string>>;
