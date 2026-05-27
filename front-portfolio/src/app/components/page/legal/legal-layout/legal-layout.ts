import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../../services/translation.service';

/** Entrée du sommaire — ancre interne vers une section du manuscrit. */
export interface LegalTocItem {
  fragment: string;
  key: string;
}

/** Lien latéral / pied de sommaire vers une autre page légale (SPA). */
export interface LegalSideLink {
  path: string;
  key: string;
}

/** Carte de renvoi en bas de manuscrit vers une page sœur. */
export interface LegalCrossLink {
  path: string;
  kickerKey: string;
  titleKey: string;
}

/**
 * Chrome présentiel partagé des pages légales : en-tête gravé + sceau de mise à
 * jour, sommaire sticky et cartes de renvoi. Le manuscrit est projeté via
 * <ng-content> par la page consommatrice (mentions, confidentialité, cookies).
 */
@Component({
  selector: 'app-legal-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './legal-layout.html',
  styleUrl: './legal-layout.css',
})
export class LegalLayout {
  protected readonly ts = inject(TranslationService);

  readonly kickerKey = input.required<string>();
  readonly titlePreKey = input.required<string>();
  readonly titlePostKey = input.required<string>();
  readonly subtitleKey = input.required<string>();
  readonly updated = input.required<string>();
  readonly tocItems = input.required<LegalTocItem[]>();
  readonly tocLinks = input<LegalSideLink[]>([]);
  readonly crossLinks = input<LegalCrossLink[]>([]);
}
