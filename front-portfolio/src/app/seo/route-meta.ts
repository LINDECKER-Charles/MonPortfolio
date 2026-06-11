import { Data } from '@angular/router';

import { imageServerUrl } from '../img-sources/image-server';

export const SITE_URL = 'https://charles-lindecker.com';
export const LOGO_URL = `${SITE_URL}/logo/80x80_logo_white.webp`;
export const SOCIAL_IMAGE_URL = `${SITE_URL}/meta/logo1.webp`;

/** Références JSON-LD partagées vers les entités déclarées une seule fois. */
export const personRef = { '@id': `${SITE_URL}/#charles-lindecker` };
export const websiteRef = { '@id': `${SITE_URL}/#website` };

export const personSchema = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#charles-lindecker`,
  name: 'Charles Lindecker',
  url: SITE_URL,
  image: imageServerUrl('/photos/640x960_me-1.webp'),
  jobTitle: 'Developpeur Full Stack',
  knowsAbout: ['.NET', 'Angular', 'Symfony', 'TypeScript', 'PostgreSQL', 'Architecture logicielle'],
  sameAs: [
    'https://github.com/LINDECKER-Charles',
    'https://www.linkedin.com/in/charles-lindecker/',
  ],
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Charles Lindecker',
  description: 'Portfolio de Charles Lindecker, developpeur full stack .NET, Angular et Symfony.',
  publisher: personRef,
  inLanguage: 'fr-FR',
};

export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Charles Lindecker',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
};

export const breadcrumb = (
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

/** Bloc WebPage rattaché au site ; `extra` porte les champs optionnels (about, primaryImageOfPage…). */
export const webPage = (
  name: string,
  url: string,
  extra?: Record<string, unknown>
): Record<string, unknown> => ({
  '@type': 'WebPage',
  name,
  url,
  isPartOf: websiteRef,
  ...extra,
});

export interface RouteMetaConfig {
  description: string;
  canonical: string;
  ogTitle: string;
  structuredData: Record<string, unknown>[];
  robots?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  showFooter?: boolean;
}

/** Construit le bloc `data` SEO complet d'une route, avec les defaults du site. */
export const buildRouteMeta = (config: RouteMetaConfig): Data => {
  const ogDescription = config.ogDescription ?? config.description;
  return {
    description: config.description,
    canonical: config.canonical,
    robots: config.robots ?? 'index, follow',
    ogTitle: config.ogTitle,
    ogDescription,
    ogImage: config.ogImage ?? LOGO_URL,
    ogUrl: config.ogUrl ?? config.canonical,
    ogType: config.ogType ?? 'website',
    twitterCard: config.twitterCard ?? 'summary_large_image',
    twitterTitle: config.twitterTitle ?? config.ogTitle,
    twitterDescription: config.twitterDescription ?? ogDescription,
    twitterImage: config.twitterImage ?? SOCIAL_IMAGE_URL,
    structuredData: config.structuredData,
    showFooter: config.showFooter ?? true,
  };
};
