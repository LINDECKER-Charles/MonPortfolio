import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

/**
 * Révélation rituelle du hero d'en-tête de page : fondu + remontée + déflou.
 * À appeler uniquement côté navigateur (la garde SSR reste dans le composant).
 */
export function revealHero(el: HTMLElement, duration: number): void {
  gsap.registerPlugin(CSSPlugin);
  gsap.fromTo(
    el,
    { autoAlpha: 0, y: 28, filter: 'blur(12px)' },
    {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration,
      ease: 'power3.out',
      clearProps: 'filter',
    }
  );
}
