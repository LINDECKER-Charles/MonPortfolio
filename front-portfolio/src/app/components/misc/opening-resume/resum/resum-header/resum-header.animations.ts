import { createLiftHoverAnimations } from '../resum-lift-hover.animations';

const resumTitleLiftHover = createLiftHoverAnimations({
  hoverIn: {
    x: 4,
    scale: 1.015,
    color: '#f3eee3',
    textShadow: '0 0 12px rgba(220, 188, 120, 0.18)',
    duration: 0.22,
    ease: 'power2.out',
  },
  hoverOut: {
    x: 0,
    scale: 1,
    color: '#d7c09a',
    textShadow: '0 0 0 rgba(0,0,0,0)',
    duration: 0.22,
    ease: 'power2.out',
  },
  press: { x: 1, scale: 0.99, duration: 0.1, ease: 'power2.out' },
  release: { x: 4, scale: 1.015, duration: 0.14, ease: 'power2.out' },
});

export const animateResumTitleHoverIn = resumTitleLiftHover.hoverIn;
export const animateResumTitleHoverOut = resumTitleLiftHover.hoverOut;
export const animateResumTitlePress = resumTitleLiftHover.press;
export const animateResumTitleRelease = resumTitleLiftHover.release;
