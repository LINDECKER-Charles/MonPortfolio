import gsap from 'gsap';

export function animateProjectHoverIn(link: HTMLElement): void {
  const label = link.querySelector('.label');
  const icon = link.querySelector('img');

  gsap.killTweensOf([link, label, icon]);

  gsap.to(link, {
    y: -2,
    scale: 1.012,
    duration: 0.2,
    ease: 'power2.out',
  });

  if (label) {
    gsap.to(label, {
      x: 3,
      duration: 0.2,
      ease: 'power2.out',
    });
  }

  if (icon) {
    gsap.to(icon, {
      scale: 1.08,
      rotate: -8,
      duration: 0.22,
      ease: 'power2.out',
    });
  }
}

export function animateProjectHoverOut(link: HTMLElement): void {
  const label = link.querySelector('.label');
  const icon = link.querySelector('img');

  gsap.killTweensOf([link, label, icon]);

  gsap.to(link, {
    y: 0,
    scale: 1,
    duration: 0.22,
    ease: 'power2.out',
  });

  if (label) {
    gsap.to(label, {
      x: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  }

  if (icon) {
    gsap.to(icon, {
      scale: 1,
      rotate: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  }
}

export function animateProjectPress(link: HTMLElement): void {
  gsap.killTweensOf(link);
  gsap.to(link, {
    y: 0,
    scale: 0.985,
    duration: 0.1,
    ease: 'power2.out',
  });
}

export function animateProjectRelease(link: HTMLElement): void {
  gsap.killTweensOf(link);
  gsap.to(link, {
    y: -2,
    scale: 1.012,
    duration: 0.14,
    ease: 'power2.out',
  });
}
