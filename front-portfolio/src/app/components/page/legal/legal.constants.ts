import type { LegalCrossLink, LegalSideLink } from './legal-layout/legal-layout';

/** Date de dernière mise à jour des documents légaux (affichée sur le sceau). */
export const LEGAL_UPDATED = '27·05·2026';

/** Slugs des pages légales — source unique pour routes, footer et cross-links. */
export const LEGAL_PATHS = {
  mentions: '/mentions-legales',
  privacy: '/politique-confidentialite',
  cookies: '/politique-cookies',
} as const;

export type LegalPageId = keyof typeof LEGAL_PATHS;

/** Ordre canonique des pages — détermine l'ordre des liens croisés. */
const LEGAL_PAGE_ORDER: readonly LegalPageId[] = ['mentions', 'privacy', 'cookies'];

const LEGAL_CROSS_KEYS: Record<LegalPageId, { kickerKey: string; titleKey: string }> = {
  mentions: { kickerKey: 'legal.cross.mentions_kicker', titleKey: 'legal.cross.mentions_title' },
  privacy: {
    kickerKey: 'legal.cross.confidentialite_kicker',
    titleKey: 'legal.cross.confidentialite_title',
  },
  cookies: { kickerKey: 'legal.cross.cookies_kicker', titleKey: 'legal.cross.cookies_title' },
};

/** Liens latéraux et cartes de renvoi vers les deux autres pages légales. */
export function otherLegalLinks(self: LegalPageId): {
  tocLinks: LegalSideLink[];
  crossLinks: LegalCrossLink[];
} {
  const others = LEGAL_PAGE_ORDER.filter((page) => page !== self);
  return {
    tocLinks: others.map((page) => ({
      path: LEGAL_PATHS[page],
      key: LEGAL_CROSS_KEYS[page].titleKey,
    })),
    crossLinks: others.map((page) => ({ path: LEGAL_PATHS[page], ...LEGAL_CROSS_KEYS[page] })),
  };
}
