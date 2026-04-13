import gsap from 'gsap';

export function animateResumRowHoverIn(row: HTMLElement): void {
  const label = row.querySelector('.label');
  const value = row.querySelector('.value');
  const icon = row.querySelector('img');

  gsap.killTweensOf([row, label, value, icon]);

  gsap.to(row, {
    x: 4,
    duration: 0.2,
    ease: 'power2.out',
  });

  if (label) {
    gsap.to(label, {
      x: 2,
      duration: 0.2,
      ease: 'power2.out',
    });
  }

  if (value) {
    gsap.to(value, {
      x: -2,
      color: '#f3eee3',
      duration: 0.2,
      ease: 'power2.out',
    });
  }

  if (icon) {
    gsap.to(icon, {
      scale: 1.08,
      rotate: -4,
      duration: 0.22,
      ease: 'power2.out',
    });
  }
}

export function animateResumRowHoverOut(row: HTMLElement): void {
  const label = row.querySelector('.label');
  const value = row.querySelector('.value');
  const icon = row.querySelector('img');

  gsap.killTweensOf([row, label, value, icon]);

  gsap.to(row, {
    x: 0,
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

  if (value) {
    gsap.to(value, {
      x: 0,
      color: '#ddd6cb',
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
