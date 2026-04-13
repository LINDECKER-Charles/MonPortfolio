import { Routes } from '@angular/router';
import {OpeningResume} from './components/misc/opening-resume/opening-resume';
import {Resum} from './components/misc/opening-resume/resum/resum';
import {Home} from './components/page/home/home';

export const routes: Routes = [
  {
    path: '',
    component: OpeningResume,
    title: 'Charles Lindecker - Développeur Web & Solutions sur mesure',
    data: {
      description:
        'Développeur web spécialisé en .NET, Angular et Symfony. Conception de webapps performantes, architecture back-end solide et solutions sur mesure.',
      canonical: 'https://charles-lindecker.com',
      robots: 'index, follow',

      ogTitle: 'Charles Lindecker - Développeur Web',
      ogDescription:
        'Développement web moderne, architecture robuste et solutions sur mesure en .NET, Angular et Symfony.',
      ogImage: 'https://charles-lindecker.com/logo/logo.png',
      ogUrl: 'https://charles-lindecker.com',
      ogType: 'website',

      twitterCard: 'summary_large_image',
      twitterTitle: 'Charles Lindecker - Développeur Web',
      twitterDescription:
        'Webapps performantes et solutions sur mesure avec .NET, Angular et Symfony.',
      twitterImage: 'https://charles-lindecker.com/meta/logo1.webp',
    },
  },
  {
    path: 'resume',
    component: Resum,
    title: 'Charles Lindecker - CV & Parcours Développeur Web',
    data: {
      description:
        'Découvrez le parcours, les compétences et les expériences de Charles Lindecker, développeur web spécialisé en back-end et architectures modernes.',
      canonical: 'https://charles-lindecker.com/resume',
      robots: 'index, follow',

      ogTitle: 'CV - Charles Lindecker',
      ogDescription:
        'Compétences en .NET, Angular, Symfony, PostgreSQL et architecture back-end.',
      ogImage: 'https://charles-lindecker.com/logo/logo.png',
      ogUrl: 'https://charles-lindecker.com/resume',
      ogType: 'profile',

      twitterCard: 'summary_large_image',
      twitterTitle: 'CV - Charles Lindecker',
      twitterDescription: 'Parcours, compétences et stack technique.',
      twitterImage: 'https://charles-lindecker.com/meta/logo1.webp',
    },
  },
  {
    path: 'home',
    component: Home,
  }
];
