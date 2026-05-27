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
  selector: 'app-mentions-legales',
  standalone: true,
  imports: [LegalLayout],
  templateUrl: './mentions-legales.html',
  styleUrls: ['../legal-content.css'],
})
export class MentionsLegales {
  protected readonly ts = inject(TranslationService);
  protected readonly updated = LEGAL_UPDATED;

  protected readonly toc: LegalTocItem[] = [
    { fragment: 'editeur', key: 'legal.ml.toc.editeur' },
    { fragment: 'directeur', key: 'legal.ml.toc.directeur' },
    { fragment: 'hebergeur', key: 'legal.ml.toc.hebergeur' },
    { fragment: 'propriete', key: 'legal.ml.toc.propriete' },
    { fragment: 'liens', key: 'legal.ml.toc.liens' },
    { fragment: 'responsabilite', key: 'legal.ml.toc.responsabilite' },
    { fragment: 'donnees', key: 'legal.ml.toc.donnees' },
    { fragment: 'droit', key: 'legal.ml.toc.droit' },
  ];

  protected readonly tocLinks: LegalSideLink[] = [
    { path: LEGAL_PATHS.privacy, key: 'legal.cross.confidentialite_title' },
    { path: LEGAL_PATHS.cookies, key: 'legal.cross.cookies_title' },
  ];

  protected readonly crossLinks: LegalCrossLink[] = [
    {
      path: LEGAL_PATHS.privacy,
      kickerKey: 'legal.cross.confidentialite_kicker',
      titleKey: 'legal.cross.confidentialite_title',
    },
    {
      path: LEGAL_PATHS.cookies,
      kickerKey: 'legal.cross.cookies_kicker',
      titleKey: 'legal.cross.cookies_title',
    },
  ];
}
