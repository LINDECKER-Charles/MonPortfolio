import { createLiftHoverAnimations } from '../resum-lift-hover.animations';

const contactLiftHover = createLiftHoverAnimations({
  hoverIn: { y: -2, scale: 1.012, duration: 0.2, ease: 'power2.out' },
  hoverOut: { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' },
  press: { y: 0, scale: 0.985, duration: 0.1, ease: 'power2.out' },
  release: { y: -2, scale: 1.012, duration: 0.14, ease: 'power2.out' },
  children: [
    {
      selector: '.contact-label',
      hoverIn: { x: 3, duration: 0.22, ease: 'power2.out' },
      hoverOut: { x: 0, duration: 0.2, ease: 'power2.out' },
    },
    {
      selector: 'img',
      hoverIn: { rotate: -8, scale: 1.08, duration: 0.22, ease: 'power2.out' },
      hoverOut: { rotate: 0, scale: 1, duration: 0.2, ease: 'power2.out' },
    },
  ],
});

export const animateContactHoverIn = contactLiftHover.hoverIn;
export const animateContactHoverOut = contactLiftHover.hoverOut;
export const animateContactPress = contactLiftHover.press;
export const animateContactRelease = contactLiftHover.release;
