import gsap from 'gsap';
import { animateResumRowHoverIn, animateResumRowHoverOut } from './resum-row-hover.animations';

function makeRow(withChildren: boolean): HTMLElement {
  const row = document.createElement('div');
  if (withChildren) {
    const label = document.createElement('span');
    label.className = 'label';
    const value = document.createElement('span');
    value.className = 'value';
    const icon = document.createElement('img');
    row.append(label, value, icon);
  }
  return row;
}

describe('resum-row-hover.animations', () => {
  beforeEach(() => {
    spyOn(gsap, 'to');
    spyOn(gsap, 'killTweensOf');
  });

  it('hoverIn animates row + label + value + icon when present', () => {
    animateResumRowHoverIn(makeRow(true));
    expect(gsap.killTweensOf).toHaveBeenCalledTimes(1);
    // row, label, value, icon -> 4 tweens
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(4);
  });

  it('hoverIn animates only the row when children are absent', () => {
    animateResumRowHoverIn(makeRow(false));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(1);
    const [target] = (gsap.to as jasmine.Spy).calls.argsFor(0);
    expect(target instanceof HTMLElement).toBeTrue();
  });

  it('hoverOut animates row + label + value + icon when present', () => {
    animateResumRowHoverOut(makeRow(true));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(4);
  });

  it('hoverOut animates only the row when children are absent', () => {
    animateResumRowHoverOut(makeRow(false));
    expect((gsap.to as jasmine.Spy).calls.count()).toBe(1);
  });
});
