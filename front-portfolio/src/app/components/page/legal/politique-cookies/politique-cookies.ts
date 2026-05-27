import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import {
  LegalCrossLink,
  LegalLayout,
  LegalSideLink,
  LegalTocItem,
} from '../legal-layout/legal-layout';
import { LEGAL_PATHS, LEGAL_UPDATED } from '../legal.constants';

@Component({
  selector: 'app-politique-cookies',
  standalone: true,
  imports: [LegalLayout],
  templateUrl: './politique-cookies.html',
  styleUrls: ['../legal-content.css'],
})
export class PolitiqueCookies {
  protected readonly ts = inject(TranslationService);
  protected readonly updated = LEGAL_UPDATED;

  protected readonly toc: LegalTocItem[] = [
    { fragment: 'sans-cookies', key: 'legal.ck.toc.sans' },
    { fragment: 'localstorage', key: 'legal.ck.toc.local' },
    { fragment: 'supprimer', key: 'legal.ck.toc.supprimer' },
    { fragment: 'plus-loin', key: 'legal.ck.toc.plus' },
  ];

  protected readonly tocLinks: LegalSideLink[] = [
    { path: LEGAL_PATHS.mentions, key: 'legal.cross.mentions_title' },
    { path: LEGAL_PATHS.privacy, key: 'legal.cross.confidentialite_title' },
  ];

  protected readonly crossLinks: LegalCrossLink[] = [
    {
      path: LEGAL_PATHS.mentions,
      kickerKey: 'legal.cross.mentions_kicker',
      titleKey: 'legal.cross.mentions_title',
    },
    {
      path: LEGAL_PATHS.privacy,
      kickerKey: 'legal.cross.confidentialite_kicker',
      titleKey: 'legal.cross.confidentialite_title',
    },
  ];
}
