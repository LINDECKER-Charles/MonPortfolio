import { Routes } from '@angular/router';
import { OpeningHome } from './components/misc/opening-home/opening-home';
import { OpeningResume } from './components/misc/opening-resume/opening-resume';
import { Resum } from './components/misc/opening-resume/resum/resum';
import { Home } from './components/page/home/home';
import { PROJECTS_DATA } from './components/page/projects/projects.state';
import { Projects } from './components/page/projects/projects';
import { Works } from './components/page/works/works';

const SITE_URL = 'https://charles-lindecker.com';
const LOGO_URL = `${SITE_URL}/logo/80x80_logo_white.webp`;
const SOCIAL_IMAGE_URL = `${SITE_URL}/meta/logo1.webp`;

const personSchema = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#charles-lindecker`,
  name: 'Charles Lindecker',
  url: SITE_URL,
  image: `${SITE_URL}/photos/640x853_me.webp`,
  jobTitle: 'Developpeur Full Stack',
  knowsAbout: [
    '.NET',
    'Angular',
    'Symfony',
    'TypeScript',
    'PostgreSQL',
    'Architecture logicielle',
  ],
  sameAs: [
    'https://github.com/LINDECKER-Charles',
    'https://www.linkedin.com/in/charles-lindecker/',
  ],
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Charles Lindecker',
  description:
    'Portfolio de Charles Lindecker, developpeur full stack .NET, Angular et Symfony.',
  publisher: {
    '@id': `${SITE_URL}/#charles-lindecker`,
  },
  inLanguage: 'fr-FR',
};

const organizationSchema = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Charles Lindecker',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
};

const breadcrumb = (
  items: Array<{ name: string; url: string }>
): Record<string, unknown> => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const projectsItemList = {
  '@type': 'ItemList',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: PROJECTS_DATA.length,
  itemListElement: PROJECTS_DATA.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: project.title,
    url: `${SITE_URL}/projects#${project.id}`,
  })),
};

export const routes: Routes = [
  {
    path: 'opening-resume',
    component: OpeningResume,
    title: 'Charles Lindecker - Developpeur Web & Solutions sur mesure',
    data: {
      description:
        'Developpeur web specialise en .NET, Angular et Symfony. Conception de webapps performantes, architecture back-end solide et solutions sur mesure.',
      canonical: SITE_URL,
      robots: 'noindex, nofollow',
      ogTitle: 'Charles Lindecker - Developpeur Web',
      ogDescription:
        'Developpement web moderne, architecture robuste et solutions sur mesure en .NET, Angular et Symfony.',
      ogImage: LOGO_URL,
      ogUrl: SITE_URL,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Charles Lindecker - Developpeur Web',
      twitterDescription:
        'Webapps performantes et solutions sur mesure avec .NET, Angular et Symfony.',
      twitterImage: SOCIAL_IMAGE_URL,
      structuredData: [
        {
          '@type': 'WebPage',
          name: 'Opening Resume',
          url: `${SITE_URL}/opening-resume`,
          isPartOf: { '@id': `${SITE_URL}/#website` },
        },
      ],
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
      canonical: SITE_URL,
      robots: 'noindex, nofollow',
      ogTitle: 'Animation d ouverture - Charles Lindecker',
      ogDescription:
        "Sequence d'ouverture du portfolio avant redirection vers la page d'accueil.",
      ogImage: LOGO_URL,
      ogUrl: SITE_URL,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Animation d ouverture - Charles Lindecker',
      twitterDescription:
        "Sequence d'ouverture du portfolio avant redirection vers la page d'accueil.",
      twitterImage: SOCIAL_IMAGE_URL,
      structuredData: [
        {
          '@type': 'WebPage',
          name: "Animation d'ouverture",
          url: `${SITE_URL}/opening-home`,
          isPartOf: { '@id': `${SITE_URL}/#website` },
        },
      ],
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
      canonical: `${SITE_URL}/resume`,
      robots: 'index, follow',
      ogTitle: 'CV - Charles Lindecker',
      ogDescription:
        'Competences en .NET, Angular, Symfony, PostgreSQL et architecture back-end.',
      ogImage: LOGO_URL,
      ogUrl: `${SITE_URL}/resume`,
      ogType: 'profile',
      twitterCard: 'summary_large_image',
      twitterTitle: 'CV - Charles Lindecker',
      twitterDescription: 'Parcours, competences et stack technique.',
      twitterImage: SOCIAL_IMAGE_URL,
      structuredData: [
        personSchema,
        organizationSchema,
        {
          '@type': 'ProfilePage',
          name: 'CV - Charles Lindecker',
          url: `${SITE_URL}/resume`,
          mainEntity: { '@id': `${SITE_URL}/#charles-lindecker` },
          isPartOf: { '@id': `${SITE_URL}/#website` },
        },
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Resume', url: `${SITE_URL}/resume` },
        ]),
      ],
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
      canonical: SITE_URL,
      robots: 'index, follow',
      ogTitle: 'Charles Lindecker - Portfolio Developpeur Full Stack',
      ogDescription:
        'Portfolio personnel avec projets, resume, branding technique et experiences web modernes.',
      ogImage: LOGO_URL,
      ogUrl: SITE_URL,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Charles Lindecker - Portfolio Developpeur Full Stack',
      twitterDescription:
        'Portfolio personnel avec projets, resume, branding technique et experiences web modernes.',
      twitterImage: SOCIAL_IMAGE_URL,
      structuredData: [
        websiteSchema,
        organizationSchema,
        personSchema,
        {
          '@type': 'WebPage',
          name: 'Accueil - Charles Lindecker',
          url: SITE_URL,
          about: { '@id': `${SITE_URL}/#charles-lindecker` },
          isPartOf: { '@id': `${SITE_URL}/#website` },
          primaryImageOfPage: LOGO_URL,
        },
      ],
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
      canonical: `${SITE_URL}/projects`,
      robots: 'index, follow',
      ogTitle: 'Projets - Charles Lindecker',
      ogDescription:
        'Travaux personnels, open source et clients presentes avec approche technique, stack et resultats.',
      ogImage: LOGO_URL,
      ogUrl: `${SITE_URL}/projects`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Projets - Charles Lindecker',
      twitterDescription:
        'Travaux personnels, open source et clients presentes avec approche technique, stack et resultats.',
      twitterImage: SOCIAL_IMAGE_URL,
      structuredData: [
        personSchema,
        {
          '@type': 'CollectionPage',
          name: 'Projets - Charles Lindecker',
          url: `${SITE_URL}/projects`,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#charles-lindecker` },
        },
        projectsItemList,
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Projets', url: `${SITE_URL}/projects` },
        ]),
      ],
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
      canonical: `${SITE_URL}/works`,
      robots: 'index, follow',
      ogTitle: 'Parcours - Charles Lindecker',
      ogDescription:
        'Section parcours professionnel actuellement en cours de construction.',
      ogImage: LOGO_URL,
      ogUrl: `${SITE_URL}/works`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Parcours - Charles Lindecker',
      twitterDescription:
        'Section parcours professionnel actuellement en cours de construction.',
      twitterImage: SOCIAL_IMAGE_URL,
      structuredData: [
        personSchema,
        {
          '@type': 'WebPage',
          name: 'Parcours - Charles Lindecker',
          url: `${SITE_URL}/works`,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#charles-lindecker` },
        },
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Parcours', url: `${SITE_URL}/works` },
        ]),
      ],
      showFooter: true,
    },
  },
];
