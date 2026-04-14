import gsap from 'gsap';

export function animateRuneHoverIn(rune: HTMLElement): void {
  const icon = rune.querySelector('img');

  gsap.killTweensOf([rune, icon]);

  gsap.to(rune, {
    y: -3,
    scale: 1.04,
    duration: 0.2,
    ease: 'power2.out',
  });

  if (icon) {
    gsap.to(icon, {
      scale: 1.08,
      rotate: -6,
      duration: 0.22,
      ease: 'power2.out',
    });
  }
}

export function animateRuneHoverOut(rune: HTMLElement): void {
  const icon = rune.querySelector('img');

  gsap.killTweensOf([rune, icon]);

  gsap.to(rune, {
    y: 0,
    scale: 1,
    duration: 0.22,
    ease: 'power2.out',
  });

  if (icon) {
    gsap.to(icon, {
      scale: 1,
      rotate: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  }
}

export function animateRunePress(rune: HTMLElement): void {
  gsap.killTweensOf(rune);
  gsap.to(rune, {
    y: 0,
    scale: 0.96,
    duration: 0.1,
    ease: 'power2.out',
  });
}

export function animateRuneRelease(rune: HTMLElement): void {
  gsap.killTweensOf(rune);
  gsap.to(rune, {
    y: -3,
    scale: 1.04,
    duration: 0.14,
    ease: 'power2.out',
  });
}
