import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { LegalLayout, LegalTocItem } from '../legal-layout/legal-layout';
import { LEGAL_UPDATED, otherLegalLinks } from '../legal.constants';

@Component({
  selector: 'app-politique-cookies',
  standalone: true,
  imports: [LegalLayout],
  templateUrl: './politique-cookies.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  private readonly links = otherLegalLinks('cookies');
  protected readonly tocLinks = this.links.tocLinks;
  protected readonly crossLinks = this.links.crossLinks;
}
