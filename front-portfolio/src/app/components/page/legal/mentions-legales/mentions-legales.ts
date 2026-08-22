import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { LegalLayout, LegalTocItem } from '../legal-layout/legal-layout';
import { LEGAL_UPDATED, otherLegalLinks } from '../legal.constants';

@Component({
  selector: 'app-mentions-legales',
  standalone: true,
  imports: [LegalLayout],
  templateUrl: './mentions-legales.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  private readonly links = otherLegalLinks('mentions');
  protected readonly tocLinks = this.links.tocLinks;
  protected readonly crossLinks = this.links.crossLinks;
}
