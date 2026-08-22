import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { prefersReducedMotion } from '../utils/motion';

/**
 * Lumière de lanterne qui suit le curseur — la surface hôte s'éclaire d'un
 * halo chaud centré sur le pointeur, comme une lanterne promenée sur la pierre.
 *
 * Utilisation (la couche lumineuse est un enfant direct de la surface) :
 *   <section class="surface-altar" appLanternLight>
 *     <span class="lantern-light" aria-hidden="true"></span>
 *     …contenu (position: relative; z-index ≥ 1)…
 *   </section>
 *
 * La directive ne pose que des variables CSS sur l'hôte — `--lantern-x` /
 * `--lantern-y` (en px, depuis le coin haut-gauche de l'hôte) et `--lantern-on`
 * (0|1) ; le rendu appartient à la primitive `.lantern-light` (ornaments.css),
 * qui translate une couche de taille fixe (déplacement compositor-only, sans
 * repaint). La position est posée dès `pointerenter`, avant l'allumage, pour ne
 * jamais éclairer une position périmée. Inactive sans pointeur fin (tactile),
 * en `prefers-reduced-motion` et côté serveur.
 */
@Directive({
  selector: '[appLanternLight]',
  standalone: true,
})
export class LanternLightDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private enabled = false;
  private rafId: number | null = null;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.enabled = finePointer && !prefersReducedMotion();
  }

  @HostListener('pointerenter', ['$event'])
  onEnter(event: PointerEvent): void {
    if (!this.enabled) return;
    this.applyPosition(event);
    this.host.nativeElement.style.setProperty('--lantern-on', '1');
  }

  @HostListener('pointermove', ['$event'])
  onMove(event: PointerEvent): void {
    if (!this.enabled) return;

    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.applyPosition(event);
    });
  }

  @HostListener('pointerleave')
  onLeave(): void {
    if (!this.enabled) return;
    this.host.nativeElement.style.setProperty('--lantern-on', '0');
  }

  private applyPosition(event: PointerEvent): void {
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();

    el.style.setProperty('--lantern-x', `${(event.clientX - rect.left).toFixed(1)}px`);
    el.style.setProperty('--lantern-y', `${(event.clientY - rect.top).toFixed(1)}px`);
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
