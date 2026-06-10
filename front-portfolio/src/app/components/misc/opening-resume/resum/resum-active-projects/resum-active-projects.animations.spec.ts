import gsap from 'gsap';
import {
  animateProjectHoverIn,
  animateProjectHoverOut,
  animateProjectPress,
  animateProjectRelease,
} from './resum-active-projects.animations';

function makeLink(withChildren: boolean): HTMLElement {
  const link = document.createElement('a');
  if (withChildren) {
    const label = document.createElement('span');
    label.className = 'label';
    const icon = document.createElement('img');
    link.append(label, icon);
  }
  return link;
}

describe('resum-active-projects.animations', () => {
  beforeEach(() => {
    spyOn(gsap, 'to');
    spyOn(gsap, 'killTweensOf');
  });

  it('hoverIn animates link + label + icon when present', () => {
    animateProjectHoverIn(makeLink(true));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(3);
  });

  it('hoverIn animates only the link when label/icon absent', () => {
    animateProjectHoverIn(makeLink(false));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(1);
  });

  it('hoverOut animates link + label + icon when present', () => {
    animateProjectHoverOut(makeLink(true));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(3);
  });

  it('hoverOut animates only the link when label/icon absent', () => {
    animateProjectHoverOut(makeLink(false));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(1);
  });

  it('press and release target only the link', () => {
    const link = makeLink(true);
    animateProjectPress(link);
    expect((gsap.to as jasmine.Spy).calls.mostRecent().args[0]).toBe(link);
    animateProjectRelease(link);
    expect((gsap.to as jasmine.Spy).calls.mostRecent().args[0]).toBe(link);
  });
});
