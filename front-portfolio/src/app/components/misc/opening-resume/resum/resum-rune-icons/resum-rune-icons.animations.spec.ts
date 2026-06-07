import gsap from 'gsap';
import {
  animateRuneHoverIn,
  animateRuneHoverOut,
  animateRunePress,
  animateRuneRelease,
} from './resum-rune-icons.animations';

function makeRune(withIcon: boolean): HTMLElement {
  const rune = document.createElement('button');
  if (withIcon) rune.appendChild(document.createElement('img'));
  return rune;
}

describe('resum-rune-icons.animations', () => {
  beforeEach(() => {
    spyOn(gsap, 'to');
    spyOn(gsap, 'killTweensOf');
  });

  it('hoverIn animates rune + icon when present', () => {
    animateRuneHoverIn(makeRune(true));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(2);
  });

  it('hoverIn animates only the rune when icon absent', () => {
    animateRuneHoverIn(makeRune(false));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(1);
  });

  it('hoverOut animates rune + icon when present', () => {
    animateRuneHoverOut(makeRune(true));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(2);
  });

  it('hoverOut animates only the rune when icon absent', () => {
    animateRuneHoverOut(makeRune(false));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(1);
  });

  it('press and release target only the rune', () => {
    const rune = makeRune(true);
    animateRunePress(rune);
    expect((gsap.to as jasmine.Spy).calls.mostRecent().args[0]).toBe(rune);
    animateRuneRelease(rune);
    expect((gsap.to as jasmine.Spy).calls.mostRecent().args[0]).toBe(rune);
  });
});
