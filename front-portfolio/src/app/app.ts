import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, filter, map, mergeMap, share } from 'rxjs';

import { Loading } from './components/assets/loading/loading';
import { MetaService } from './services/meta-service';
import { RouteMeta } from './seo/route-meta';
import { Footer } from './components/misc/footer/footer';
import { NavBarre } from './components/misc/nav-barre/nav-barre';
import { LangModal } from './components/assets/lang-modal/lang-modal';
import { EmberParticles } from './components/assets/ember-particles/ember-particles';
import { PageTransition } from './components/assets/page-transition/page-transition';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  imports: [Loading, RouterOutlet, Footer, NavBarre, LangModal, EmberParticles, PageTransition],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('front-portfolio');

  protected readonly ts = inject(TranslationService);
  private readonly metaService = inject(MetaService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  /** État d'ouverture du modal de langue — UI propre au shell, hors TranslationService. */
  protected readonly langModalOpen = signal(false);

  /**
   * `data` de la route la plus profonde à chaque fin de navigation.
   * Flux unique partagé entre l'affichage du footer et l'application des
   * métas (contrat `RouteMeta`) : l'arbre de routes n'est parcouru qu'une fois.
   */
  private readonly deepestRouteData$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(() => {
      let route = this.activatedRoute;
      while (route.firstChild) route = route.firstChild;
      return route;
    }),
    filter((route) => route.outlet === 'primary'),
    mergeMap((route) => route.data as Observable<Data & RouteMeta>),
    share(),
  );

  protected readonly showFooter = toSignal(
    this.deepestRouteData$.pipe(map((data) => data['showFooter'] ?? true)),
    { initialValue: true },
  );

  ngOnInit(): void {
    // Chaque route porte un bloc `data` complet construit par buildRouteMeta.
    this.deepestRouteData$.subscribe((data) => this.metaService.applyRouteMeta(data));
  }
}
