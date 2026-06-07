import gsap from 'gsap';
import {
  animateResumTitleHoverIn,
  animateResumTitleHoverOut,
  animateResumTitlePress,
  animateResumTitleRelease,
} from './resum-header.animations';

describe('resum-header.animations', () => {
  let link: HTMLElement;

  beforeEach(() => {
    spyOn(gsap, 'to');
    spyOn(gsap, 'killTweensOf');
    link = document.createElement('a');
  });

  it('each title animation kills existing tweens and issues a single tween on the link', () => {
    for (const fn of [
      animateResumTitleHoverIn,
      animateResumTitleHoverOut,
      animateResumTitlePress,
      animateResumTitleRelease,
    ]) {
      (gsap.to as jasmine.Spy).calls.reset();
      (gsap.killTweensOf as jasmine.Spy).calls.reset();
      fn(link);
      expect(gsap.killTweensOf).toHaveBeenCalledOnceWith(link);
      expect(gsap.to as jasmine.Spy).toHaveBeenCalledTimes(1);
      expect((gsap.to as jasmine.Spy).calls.argsFor(0)[0]).toBe(link);
    }
  });

  it('hoverIn moves and tints toward the active palette', () => {
    animateResumTitleHoverIn(link);
    const vars = (gsap.to as jasmine.Spy).calls.argsFor(0)[1];
    expect(vars.x).toBe(4);
    expect(vars.color).toBe('#f3eee3');
  });

  it('hoverOut resets to the resting palette', () => {
    animateResumTitleHoverOut(link);
    const vars = (gsap.to as jasmine.Spy).calls.argsFor(0)[1];
    expect(vars.x).toBe(0);
    expect(vars.color).toBe('#d7c09a');
  });
});
