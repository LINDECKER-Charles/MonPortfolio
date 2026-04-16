import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Tilt 3D subtil suivant le curseur — effet "objet précieux encadré".
 *
 * Utilisation :
 *   <div appTilt [tiltMax]="4">…</div>
 *
 * L'élément cible reçoit un `transform: perspective(...) rotateX/Y(...)` qui
 * s'adoucit à la sortie de la souris via une transition CSS (déclarée par le
 * composant, non appliquée ici pour laisser le contrôle visuel au caller).
 *
 * Ne fait rien si le périphérique est sans pointeur fin (tactile) ou si
 * l'utilisateur demande `prefers-reduced-motion`.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements AfterViewInit, OnDestroy {
  /** Angle max (en degrés) sur chaque axe — 3-5 est subtil, 10 est exagéré. */
  @Input() tiltMax = 4;

  /** Profondeur de la perspective (px) — plus grand = effet plus doux. */
  @Input() tiltPerspective = 900;

  /** Smoothing à la sortie (ms). */
  @Input() tiltResetMs = 500;

  private readonly isBrowser: boolean;
  private enabled = false;
  private rafId: number | null = null;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.enabled = supportsFinePointer && !reducedMotion;

    if (!this.enabled) return;

    const el = this.host.nativeElement;
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = `transform ${this.tiltResetMs}ms cubic-bezier(0.2, 0.7, 0.2, 1)`;
    el.style.willChange = 'transform';
  }

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent): void {
    if (!this.enabled) return;

    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.applyTilt(event));
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (!this.enabled) return;

    const el = this.host.nativeElement;
    el.style.transform = `perspective(${this.tiltPerspective}px) rotateX(0deg) rotateY(0deg)`;
  }

  private applyTilt(event: MouseEvent): void {
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();

    // Position souris relative au centre (−0.5 à +0.5).
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    // Rotation inversée sur Y : souris à droite → rotation vers la gauche
    // (perspective classique façon "regarder à l'intérieur").
    const rotY = x * this.tiltMax * 2;
    const rotX = -y * this.tiltMax * 2;

    el.style.transform = `perspective(${this.tiltPerspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
