import { Routes } from '@angular/router';
// Seul PROJECTS_DATA reste un import statique : c'est de la donnée (utilisée pour le
// JSON-LD ItemList ci-dessous), pas un composant. Tous les composants de page sont
// chargés à la demande via loadComponent pour alléger le bundle initial.
import { PROJECTS_DATA } from './components/page/projects/projects.state';
import {
  LOGO_URL,
  SITE_URL,
  breadcrumb,
  buildRouteMeta,
  organizationSchema,
  personRef,
  personSchema,
  webPage,
  websiteRef,
  websiteSchema,
} from './seo/route-meta';

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
    loadComponent: () =>
      import('./components/misc/opening-resume/opening-resume').then((m) => m.OpeningResume),
    title: 'Charles Lindecker - Developpeur Web & Solutions sur mesure',
    data: buildRouteMeta({
      description:
        'Developpeur web specialise en .NET, Angular et Symfony. Conception de webapps performantes, architecture back-end solide et solutions sur mesure.',
      canonical: SITE_URL,
      robots: 'noindex, nofollow',
      ogTitle: 'Charles Lindecker - Developpeur Web',
      ogDescription:
        'Developpement web moderne, architecture robuste et solutions sur mesure en .NET, Angular et Symfony.',
      twitterDescription:
        'Webapps performantes et solutions sur mesure avec .NET, Angular et Symfony.',
      structuredData: [webPage('Opening Resume', `${SITE_URL}/opening-resume`)],
      showFooter: false,
    }),
  },
  {
    path: 'opening-home',
    loadComponent: () =>
      import('./components/misc/opening-home/opening-home').then((m) => m.OpeningHome),
    title: 'Animation d ouverture - Charles Lindecker',
    data: buildRouteMeta({
      description:
        "Sequence d'ouverture du portfolio de Charles Lindecker avant redirection vers l'accueil.",
      canonical: SITE_URL,
      robots: 'noindex, nofollow',
      ogTitle: 'Animation d ouverture - Charles Lindecker',
      ogDescription: "Sequence d'ouverture du portfolio avant redirection vers la page d'accueil.",
      structuredData: [webPage("Animation d'ouverture", `${SITE_URL}/opening-home`)],
      showFooter: false,
    }),
  },
  {
    path: 'resume',
    loadComponent: () =>
      import('./components/misc/opening-resume/resum/resum').then((m) => m.Resum),
    title: 'Charles Lindecker - CV & Parcours Developpeur Web',
    data: buildRouteMeta({
      description:
        'Decouvrez le parcours, les competences et les experiences de Charles Lindecker, developpeur web specialise en back-end et architectures modernes.',
      canonical: `${SITE_URL}/resume`,
      ogTitle: 'CV - Charles Lindecker',
      ogDescription: 'Competences en .NET, Angular, Symfony, PostgreSQL et architecture back-end.',
      ogType: 'profile',
      twitterDescription: 'Parcours, competences et stack technique.',
      structuredData: [
        personSchema,
        organizationSchema,
        {
          '@type': 'ProfilePage',
          name: 'CV - Charles Lindecker',
          url: `${SITE_URL}/resume`,
          mainEntity: personRef,
          isPartOf: websiteRef,
        },
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Resume', url: `${SITE_URL}/resume` },
        ]),
      ],
    }),
  },
  {
    path: '',
    loadComponent: () => import('./components/page/home/home').then((m) => m.Home),
    title: 'Charles Lindecker - Portfolio Developpeur Full Stack',
    data: buildRouteMeta({
      description:
        'Portfolio de Charles Lindecker, developpeur full stack .NET, Angular et Symfony, avec projets, resume, animations et interfaces modernes.',
      canonical: SITE_URL,
      ogTitle: 'Charles Lindecker - Portfolio Developpeur Full Stack',
      ogDescription:
        'Portfolio personnel avec projets, resume, branding technique et experiences web modernes.',
      structuredData: [
        websiteSchema,
        organizationSchema,
        personSchema,
        webPage('Accueil - Charles Lindecker', SITE_URL, {
          about: personRef,
          primaryImageOfPage: LOGO_URL,
        }),
      ],
    }),
  },
  {
    path: 'projects',
    loadComponent: () => import('./components/page/projects/projects').then((m) => m.Projects),
    title: 'Projets - Charles Lindecker',
    data: buildRouteMeta({
      description:
        'Selection de projets personnels, open source et clients de Charles Lindecker, avec filtres par categorie, tags, stack et details techniques.',
      canonical: `${SITE_URL}/projects`,
      ogTitle: 'Projets - Charles Lindecker',
      ogDescription:
        'Travaux personnels, open source et clients presentes avec approche technique, stack et resultats.',
      structuredData: [
        personSchema,
        {
          '@type': 'CollectionPage',
          name: 'Projets - Charles Lindecker',
          url: `${SITE_URL}/projects`,
          isPartOf: websiteRef,
          about: personRef,
        },
        projectsItemList,
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Projets', url: `${SITE_URL}/projects` },
        ]),
      ],
    }),
  },
  {
    path: 'works',
    loadComponent: () => import('./components/page/works/works').then((m) => m.Works),
    title: 'Parcours - Charles Lindecker',
    data: buildRouteMeta({
      description:
        'Page parcours de Charles Lindecker actuellement en preparation, avec une presentation bientot disponible.',
      canonical: `${SITE_URL}/works`,
      // En construction : on ne laisse pas Google indexer une page sans contenu.
      // Repasser en 'index, follow' une fois la timeline parcours remplie.
      robots: 'noindex, nofollow',
      ogTitle: 'Parcours - Charles Lindecker',
      ogDescription: 'Section parcours professionnel actuellement en cours de construction.',
      structuredData: [
        personSchema,
        webPage('Parcours - Charles Lindecker', `${SITE_URL}/works`, { about: personRef }),
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Parcours', url: `${SITE_URL}/works` },
        ]),
      ],
    }),
  },
  {
    path: 'linktree',
    loadComponent: () => import('./components/page/linktree/linktree').then((m) => m.Linktree),
    title: 'Linktree - Charles Lindecker',
    data: buildRouteMeta({
      description:
        'Tous les liens de Charles Lindecker : LinkedIn, GitHub, Discord, plateformes de code et contact direct rassembles sur une seule page.',
      canonical: `${SITE_URL}/linktree`,
      ogTitle: 'Linktree - Charles Lindecker',
      ogDescription:
        'LinkedIn, GitHub, Discord, Frontend Mentor, freeCodeCamp, Root-Me, npm, email et plus : tous mes liens reunis.',
      twitterDescription:
        'Tous les liens de Charles Lindecker reunis : reseaux, plateformes de pratique et contact direct.',
      structuredData: [
        personSchema,
        webPage('Linktree - Charles Lindecker', `${SITE_URL}/linktree`, { about: personRef }),
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Linktree', url: `${SITE_URL}/linktree` },
        ]),
      ],
    }),
  },
  {
    path: 'mentions-legales',
    loadComponent: () =>
      import('./components/page/legal/mentions-legales/mentions-legales').then(
        (m) => m.MentionsLegales,
      ),
    title: 'Mentions legales - Charles Lindecker',
    data: buildRouteMeta({
      description:
        'Mentions legales du site de Charles Lindecker : editeur, directeur de publication, hebergeur, propriete intellectuelle et droit applicable.',
      canonical: `${SITE_URL}/mentions-legales`,
      ogTitle: 'Mentions legales - Charles Lindecker',
      ogDescription:
        'Editeur, hebergeur, propriete intellectuelle et droit applicable du site charles-lindecker.com.',
      twitterCard: 'summary',
      twitterDescription:
        'Editeur, hebergeur, propriete intellectuelle et droit applicable du site.',
      structuredData: [
        webPage('Mentions legales - Charles Lindecker', `${SITE_URL}/mentions-legales`, {
          about: personRef,
        }),
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Mentions legales', url: `${SITE_URL}/mentions-legales` },
        ]),
      ],
    }),
  },
  {
    path: 'politique-confidentialite',
    loadComponent: () =>
      import('./components/page/legal/politique-confidentialite/politique-confidentialite').then(
        (m) => m.PolitiqueConfidentialite,
      ),
    title: 'Politique de confidentialite - Charles Lindecker',
    data: buildRouteMeta({
      description:
        'Politique de confidentialite du site de Charles Lindecker : donnees traitees, finalites, durees de conservation et droits RGPD des utilisateurs.',
      canonical: `${SITE_URL}/politique-confidentialite`,
      ogTitle: 'Politique de confidentialite - Charles Lindecker',
      ogDescription:
        'Traitement des donnees personnelles, finalites, conservation et droits RGPD sur charles-lindecker.com.',
      twitterCard: 'summary',
      twitterDescription:
        'Donnees traitees, finalites, conservation et droits RGPD des utilisateurs.',
      structuredData: [
        webPage(
          'Politique de confidentialite - Charles Lindecker',
          `${SITE_URL}/politique-confidentialite`,
          { about: personRef },
        ),
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Politique de confidentialite', url: `${SITE_URL}/politique-confidentialite` },
        ]),
      ],
    }),
  },
  {
    path: 'politique-cookies',
    loadComponent: () =>
      import('./components/page/legal/politique-cookies/politique-cookies').then(
        (m) => m.PolitiqueCookies,
      ),
    title: 'Politique de cookies - Charles Lindecker',
    data: buildRouteMeta({
      description:
        'Politique de cookies et de stockage local du site de Charles Lindecker : aucun cookie ni traceur, seules des preferences fonctionnelles en localStorage.',
      canonical: `${SITE_URL}/politique-cookies`,
      ogTitle: 'Politique de cookies - Charles Lindecker',
      ogDescription:
        'Aucun cookie ni traceur : seules des preferences fonctionnelles (langue, audio) en stockage local.',
      twitterCard: 'summary',
      twitterDescription:
        'Aucun cookie ni traceur : seules des preferences fonctionnelles en stockage local.',
      structuredData: [
        webPage('Politique de cookies - Charles Lindecker', `${SITE_URL}/politique-cookies`, {
          about: personRef,
        }),
        breadcrumb([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Politique de cookies', url: `${SITE_URL}/politique-cookies` },
        ]),
      ],
    }),
  },
  {
    path: '**',
    loadComponent: () => import('./components/page/not-found/not-found').then((m) => m.NotFound),
    title: 'Page introuvable - Charles Lindecker',
    data: buildRouteMeta({
      description: 'Page 404 : la ressource demandée est introuvable.',
      canonical: `${SITE_URL}/404`,
      robots: 'noindex, nofollow',
      ogTitle: 'Page introuvable - Charles Lindecker',
      ogDescription: 'Vous avez été banni de ces terres.',
      ogUrl: SITE_URL,
      twitterCard: 'summary',
      twitterTitle: 'Page introuvable',
      structuredData: [],
    }),
  },
];
