import gsap from 'gsap';
import {
  animateContactHoverIn,
  animateContactHoverOut,
  animateContactPress,
  animateContactRelease,
} from './resum-contact-links.animations';

function makeRow(withChildren: boolean): HTMLElement {
  const row = document.createElement('a');
  if (withChildren) {
    const label = document.createElement('span');
    label.className = 'contact-label';
    const icon = document.createElement('img');
    row.append(label, icon);
  }
  return row;
}

describe('resum-contact-links.animations', () => {
  beforeEach(() => {
    spyOn(gsap, 'to');
    spyOn(gsap, 'killTweensOf');
  });

  it('hoverIn animates row + label + icon when present', () => {
    animateContactHoverIn(makeRow(true));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(3);
  });

  it('hoverIn animates only the row when label/icon absent', () => {
    animateContactHoverIn(makeRow(false));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(1);
  });

  it('hoverOut animates row + label + icon when present', () => {
    animateContactHoverOut(makeRow(true));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(3);
  });

  it('hoverOut animates only the row when label/icon absent', () => {
    animateContactHoverOut(makeRow(false));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(1);
  });

  it('press and release target only the row', () => {
    const row = makeRow(true);
    animateContactPress(row);
    expect((gsap.to as jasmine.Spy).calls.mostRecent().args[0]).toBe(row);
    animateContactRelease(row);
    expect((gsap.to as jasmine.Spy).calls.mostRecent().args[0]).toBe(row);
  });
});
