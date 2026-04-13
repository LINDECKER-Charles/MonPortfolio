import gsap from 'gsap';

export function animateResumTitleHoverIn(link: HTMLElement): void {
  gsap.killTweensOf(link);
  gsap.to(link, {
    x: 4,
    scale: 1.015,
    color: '#f3eee3',
    textShadow: '0 0 12px rgba(220, 188, 120, 0.18)',
    duration: 0.22,
    ease: 'power2.out',
  });
}

export function animateResumTitleHoverOut(link: HTMLElement): void {
  gsap.killTweensOf(link);
  gsap.to(link, {
    x: 0,
    scale: 1,
    color: '#d7c09a',
    textShadow: '0 0 0 rgba(0,0,0,0)',
    duration: 0.22,
    ease: 'power2.out',
  });
}

export function animateResumTitlePress(link: HTMLElement): void {
  gsap.killTweensOf(link);
  gsap.to(link, {
    x: 1,
    scale: 0.99,
    duration: 0.1,
    ease: 'power2.out',
  });
}

export function animateResumTitleRelease(link: HTMLElement): void {
  gsap.killTweensOf(link);
  gsap.to(link, {
    x: 4,
    scale: 1.015,
    duration: 0.14,
    ease: 'power2.out',
  });
}
