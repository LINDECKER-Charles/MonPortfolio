import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

interface Lantern {
  targetSelector: string;
  label: string;
}

/**
 * Lanternes de navigation — marqueurs sticky à droite de l'écran indiquant
 * la section courante. L'allumage suit l'IntersectionObserver sur des
 * cibles désignées (sélecteurs CSS).
 *
 * Masqué en dessous de 1024px pour ne pas surcharger le mobile. Silencieux
 * (pas cliquable) — rôle purement indicatif, comme un feu de camp qui
 * s'allume quand on approche.
 */
@Component({
  selector: 'app-scroll-lanterns',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasTargets()) {
      <aside class="scroll-lanterns" aria-hidden="true">
        @for (lantern of lanterns; track lantern.targetSelector; let idx = $index) {
          <a
            [href]="lantern.targetSelector"
            class="scroll-lanterns__lantern"
            [class.is-lit]="activeIndex() === idx"
            [attr.aria-label]="lantern.label"
            (click)="scrollTo($event, lantern.targetSelector)">
            <span class="scroll-lanterns__flame"></span>
          </a>
        }
      </aside>
    }
  `,
  styleUrl: './scroll-lanterns.css',
})
export class ScrollLanterns implements AfterViewInit, OnDestroy {
  /** Sections à observer — ids posés sur les <section> de home.html.
     Les pages qui n'ont pas ces ids laisseront simplement les lanternes
     éteintes (pas d'erreur). */
  protected readonly lanterns: Lantern[] = [
    { targetSelector: '#hero',     label: 'Accueil' },
    { targetSelector: '#projects', label: 'Projets' },
    { targetSelector: '#work',     label: 'Parcours' },
  ];

  protected activeIndex = signal(0);
  protected hasTargets = signal(false);

  private readonly router = inject(Router);
  private observer?: IntersectionObserver;
  private routerSub?: Subscription;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    queueMicrotask(() => this.setupObserver());

    /* À chaque changement de route, on re-tente de raccrocher les cibles.
       Les ids ne sont posés que sur la home aujourd'hui — le composant
       reste silencieux (masqué) ailleurs. */
    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.observer?.disconnect();
        /* Laisse Angular monter la nouvelle vue avant d'observer. */
        setTimeout(() => this.setupObserver(), 0);
      });
  }

  private setupObserver(): void {
    const elements = this.lanterns
      .map((l, idx) => {
        const el = document.querySelector(l.targetSelector);
        return el ? { el, idx } : null;
      })
      .filter((v): v is { el: Element; idx: number } => v !== null);

    this.hasTargets.set(elements.length > 0);

    if (elements.length === 0) return;

    this.activeIndex.set(0);

    this.observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;

        /* Zone de détection : bande supérieure (0 → 30 % du viewport).
           On prend la section dont le `top` est le plus haut parmi celles
           qui intersectent — c'est celle dans laquelle on vient d'entrer
           en scrollant vers le bas, donc la section "courante". */
        const sorted = intersecting.sort(
          (a, b) => b.boundingClientRect.top - a.boundingClientRect.top
        );
        const first = sorted[0];
        const found = elements.find(({ el }) => el === first.target);
        if (found) this.activeIndex.set(found.idx);
      },
      {
        /* Bande fine en haut du viewport — détecte toutes les sections,
           y compris la dernière quand on est en fin de page. */
        rootMargin: '0px 0px -70% 0px',
        threshold: 0,
      }
    );

    for (const { el } of elements) {
      this.observer.observe(el);
    }
  }

  /** Smooth scroll sur click — remplace le saut natif du navigateur. */
  protected scrollTo(event: MouseEvent, selector: string): void {
    if (!this.isBrowser) return;
    event.preventDefault();

    const target = document.querySelector(selector);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.routerSub?.unsubscribe();
  }
}
