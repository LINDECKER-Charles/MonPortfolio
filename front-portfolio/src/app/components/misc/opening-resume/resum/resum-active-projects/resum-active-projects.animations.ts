import { createLiftHoverAnimations } from '../resum-lift-hover.animations';

const projectLiftHover = createLiftHoverAnimations({
  hoverIn: { y: -2, scale: 1.012, duration: 0.2, ease: 'power2.out' },
  hoverOut: { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' },
  press: { y: 0, scale: 0.985, duration: 0.1, ease: 'power2.out' },
  release: { y: -2, scale: 1.012, duration: 0.14, ease: 'power2.out' },
  children: [
    {
      selector: '.label',
      hoverIn: { x: 3, duration: 0.2, ease: 'power2.out' },
      hoverOut: { x: 0, duration: 0.2, ease: 'power2.out' },
    },
    {
      selector: 'img',
      hoverIn: { scale: 1.08, rotate: -8, duration: 0.22, ease: 'power2.out' },
      hoverOut: { scale: 1, rotate: 0, duration: 0.2, ease: 'power2.out' },
    },
  ],
});

export const animateProjectHoverIn = projectLiftHover.hoverIn;
export const animateProjectHoverOut = projectLiftHover.hoverOut;
export const animateProjectPress = projectLiftHover.press;
export const animateProjectRelease = projectLiftHover.release;
