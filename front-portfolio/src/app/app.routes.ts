import { Routes } from '@angular/router';
import { OpeningHome } from './components/misc/opening-home/opening-home';
import { OpeningResume } from './components/misc/opening-resume/opening-resume';
import { Resum } from './components/misc/opening-resume/resum/resum';
import { Home } from './components/page/home/home';
import { Projects } from './components/page/projects/projects';
import { Works } from './components/page/works/works';

export const routes: Routes = [
  {
    path: 'opening-resume',
    component: OpeningResume,
    title: 'Charles Lindecker - Developpeur Web & Solutions sur mesure',
    data: {
      description:
        'Developpeur web specialise en .NET, Angular et Symfony. Conception de webapps performantes, architecture back-end solide et solutions sur mesure.',
      canonical: 'https://charles-lindecker.com',
      robots: 'noindex, nofollow',
      ogTitle: 'Charles Lindecker - Developpeur Web',
      ogDescription:
        'Developpement web moderne, architecture robuste et solutions sur mesure en .NET, Angular et Symfony.',
      ogImage: 'https://charles-lindecker.com/logo/80x80_logo_white.webp',
      ogUrl: 'https://charles-lindecker.com',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Charles Lindecker - Developpeur Web',
      twitterDescription:
        'Webapps performantes et solutions sur mesure avec .NET, Angular et Symfony.',
      twitterImage: 'https://charles-lindecker.com/meta/logo1.webp',
      showFooter: false,
    },
  },
  {
    path: 'opening-home',
    component: OpeningHome,
    title: 'Animation d ouverture - Charles Lindecker',
    data: {
      description:
        "Sequence d'ouverture du portfolio de Charles Lindecker avant redirection vers l'accueil.",
      canonical: 'https://charles-lindecker.com',
      robots: 'noindex, nofollow',
      ogTitle: 'Animation d ouverture - Charles Lindecker',
      ogDescription:
        "Sequence d'ouverture du portfolio avant redirection vers la page d'accueil.",
      ogImage: 'https://charles-lindecker.com/logo/80x80_logo_white.webp',
      ogUrl: 'https://charles-lindecker.com',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Animation d ouverture - Charles Lindecker',
      twitterDescription:
        "Sequence d'ouverture du portfolio avant redirection vers la page d'accueil.",
      twitterImage: 'https://charles-lindecker.com/meta/logo1.webp',
      showFooter: false,
    },
  },
  {
    path: 'resume',
    component: Resum,
    title: 'Charles Lindecker - CV & Parcours Developpeur Web',
    data: {
      description:
        'Decouvrez le parcours, les competences et les experiences de Charles Lindecker, developpeur web specialise en back-end et architectures modernes.',
      canonical: 'https://charles-lindecker.com/resume',
      robots: 'index, follow',
      ogTitle: 'CV - Charles Lindecker',
      ogDescription:
        'Competences en .NET, Angular, Symfony, PostgreSQL et architecture back-end.',
      ogImage: 'https://charles-lindecker.com/logo/80x80_logo_white.webp',
      ogUrl: 'https://charles-lindecker.com/resume',
      ogType: 'profile',
      twitterCard: 'summary_large_image',
      twitterTitle: 'CV - Charles Lindecker',
      twitterDescription: 'Parcours, competences et stack technique.',
      twitterImage: 'https://charles-lindecker.com/meta/logo1.webp',
      showFooter: true,
    },
  },
  {
    path: '',
    component: Home,
    title: 'Charles Lindecker - Portfolio Developpeur Full Stack',
    data: {
      description:
        'Portfolio de Charles Lindecker, developpeur full stack .NET, Angular et Symfony, avec projets, resume, animations et interfaces modernes.',
      canonical: 'https://charles-lindecker.com',
      robots: 'index, follow',
      ogTitle: 'Charles Lindecker - Portfolio Developpeur Full Stack',
      ogDescription:
        'Portfolio personnel avec projets, resume, branding technique et experiences web modernes.',
      ogImage: 'https://charles-lindecker.com/logo/80x80_logo_white.webp',
      ogUrl: 'https://charles-lindecker.com',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Charles Lindecker - Portfolio Developpeur Full Stack',
      twitterDescription:
        'Portfolio personnel avec projets, resume, branding technique et experiences web modernes.',
      twitterImage: 'https://charles-lindecker.com/meta/logo1.webp',
      showFooter: true,
    },
  },
  {
    path: 'projects',
    component: Projects,
    title: 'Projets - Charles Lindecker',
    data: {
      description:
        'Selection de projets personnels, open source et clients de Charles Lindecker, avec filtres par categorie, tags, stack et details techniques.',
      canonical: 'https://charles-lindecker.com/projects',
      robots: 'index, follow',
      ogTitle: 'Projets - Charles Lindecker',
      ogDescription:
        'Travaux personnels, open source et clients presentes avec approche technique, stack et resultats.',
      ogImage: 'https://charles-lindecker.com/logo/80x80_logo_white.webp',
      ogUrl: 'https://charles-lindecker.com/projects',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Projets - Charles Lindecker',
      twitterDescription:
        'Travaux personnels, open source et clients presentes avec approche technique, stack et resultats.',
      twitterImage: 'https://charles-lindecker.com/meta/logo1.webp',
      showFooter: true,
    },
  },
  {
    path: 'works',
    component: Works,
    title: 'Parcours - Charles Lindecker',
    data: {
      description:
        'Page parcours de Charles Lindecker actuellement en preparation, avec une presentation bientot disponible.',
      canonical: 'https://charles-lindecker.com/works',
      robots: 'index, follow',
      ogTitle: 'Parcours - Charles Lindecker',
      ogDescription:
        'Section parcours professionnel actuellement en cours de construction.',
      ogImage: 'https://charles-lindecker.com/logo/80x80_logo_white.webp',
      ogUrl: 'https://charles-lindecker.com/works',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Parcours - Charles Lindecker',
      twitterDescription:
        'Section parcours professionnel actuellement en cours de construction.',
      twitterImage: 'https://charles-lindecker.com/meta/logo1.webp',
      showFooter: true,
    },
  },
];
