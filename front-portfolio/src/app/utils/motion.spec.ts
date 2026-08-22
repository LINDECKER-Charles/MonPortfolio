import { prefersReducedMotion, shouldSkipEntrance } from './motion';

function fakeElement(top: number, bottom: number): Element {
  return {
    getBoundingClientRect: () => ({ top, bottom }) as DOMRect,
  } as Element;
}

describe('motion utils', () => {
  describe('prefersReducedMotion()', () => {
    it('reflects the media query result', () => {
      const spy = spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      expect(prefersReducedMotion()).toBeTrue();
      expect(spy).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });

  describe('shouldSkipEntrance()', () => {
    it('skips when reduced motion is requested, whatever the navigation context', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      expect(shouldSkipEntrance(fakeElement(2000, 2100), { hasNavigated: () => true })).toBeTrue();
    });

    it('skips an element visible at initial render (aucune navigation client)', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      expect(shouldSkipEntrance(fakeElement(0, 120), { hasNavigated: () => false })).toBeTrue();
    });

    it('does not skip an element below the fold at initial render', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      const below = fakeElement(window.innerHeight * 2, window.innerHeight * 2 + 100);
      expect(shouldSkipEntrance(below, { hasNavigated: () => false })).toBeFalse();
    });

    it('does not skip after a client navigation, even for a visible element', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
      expect(shouldSkipEntrance(fakeElement(0, 120), { hasNavigated: () => true })).toBeFalse();
    });
  });
});
