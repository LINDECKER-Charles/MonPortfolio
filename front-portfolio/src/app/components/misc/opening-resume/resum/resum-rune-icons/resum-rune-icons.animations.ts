import { createLiftHoverAnimations } from '../resum-lift-hover.animations';

const runeLiftHover = createLiftHoverAnimations({
  hoverIn: { y: -3, scale: 1.04, duration: 0.2, ease: 'power2.out' },
  hoverOut: { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' },
  press: { y: 0, scale: 0.96, duration: 0.1, ease: 'power2.out' },
  release: { y: -3, scale: 1.04, duration: 0.14, ease: 'power2.out' },
  children: [
    {
      selector: 'img',
      hoverIn: { scale: 1.08, rotate: -6, duration: 0.22, ease: 'power2.out' },
      hoverOut: { scale: 1, rotate: 0, duration: 0.2, ease: 'power2.out' },
    },
  ],
});

export const animateRuneHoverIn = runeLiftHover.hoverIn;
export const animateRuneHoverOut = runeLiftHover.hoverOut;
export const animateRunePress = runeLiftHover.press;
export const animateRuneRelease = runeLiftHover.release;
