import gsap from 'gsap';

export function animateContactHoverIn(row: HTMLElement): void {
  const label = row.querySelector('.contact-label');
  const icon = row.querySelector('img');

  gsap.killTweensOf([row, label, icon]);

  gsap.to(row, {
    y: -2,
    scale: 1.012,
    duration: 0.2,
    ease: 'power2.out',
  });

  if (label) {
    gsap.to(label, {
      x: 3,
      duration: 0.22,
      ease: 'power2.out',
    });
  }

  if (icon) {
    gsap.to(icon, {
      rotate: -8,
      scale: 1.08,
      duration: 0.22,
      ease: 'power2.out',
    });
  }
}

export function animateContactHoverOut(row: HTMLElement): void {
  const label = row.querySelector('.contact-label');
  const icon = row.querySelector('img');

  gsap.killTweensOf([row, label, icon]);

  gsap.to(row, {
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
      rotate: 0,
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  }
}

export function animateContactPress(row: HTMLElement): void {
  gsap.killTweensOf(row);
  gsap.to(row, {
    y: 0,
    scale: 0.985,
    duration: 0.1,
    ease: 'power2.out',
  });
}

export function animateContactRelease(row: HTMLElement): void {
  gsap.killTweensOf(row);
  gsap.to(row, {
    y: -2,
    scale: 1.012,
    duration: 0.14,
    ease: 'power2.out',
  });
}
