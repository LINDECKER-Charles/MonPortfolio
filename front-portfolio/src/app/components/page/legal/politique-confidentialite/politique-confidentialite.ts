import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { LegalLayout, LegalTocItem } from '../legal-layout/legal-layout';
import { LEGAL_UPDATED, otherLegalLinks } from '../legal.constants';

@Component({
  selector: 'app-politique-confidentialite',
  standalone: true,
  imports: [LegalLayout],
  templateUrl: './politique-confidentialite.html',
  styleUrls: ['../legal-content.css'],
})
export class PolitiqueConfidentialite {
  protected readonly ts = inject(TranslationService);
  protected readonly updated = LEGAL_UPDATED;

  protected readonly toc: LegalTocItem[] = [
    { fragment: 'responsable', key: 'legal.pc.toc.responsable' },
    { fragment: 'donnees', key: 'legal.pc.toc.donnees' },
    { fragment: 'destinataires', key: 'legal.pc.toc.destinataires' },
    { fragment: 'transferts', key: 'legal.pc.toc.transferts' },
    { fragment: 'duree', key: 'legal.pc.toc.duree' },
    { fragment: 'securite', key: 'legal.pc.toc.securite' },
    { fragment: 'droits', key: 'legal.pc.toc.droits' },
    { fragment: 'evolution', key: 'legal.pc.toc.evolution' },
  ];

  private readonly links = otherLegalLinks('privacy');
  protected readonly tocLinks = this.links.tocLinks;
  protected readonly crossLinks = this.links.crossLinks;
}
