import gsap from 'gsap';
import { createLiftHoverAnimations } from './resum-lift-hover.animations';

describe('createLiftHoverAnimations', () => {
  const withChildren = createLiftHoverAnimations({
    hoverIn: { y: -2, duration: 0.2, ease: 'power2.out' },
    hoverOut: { y: 0, duration: 0.22, ease: 'power2.out' },
    press: { scale: 0.985, duration: 0.1, ease: 'power2.out' },
    release: { scale: 1.012, duration: 0.14, ease: 'power2.out' },
    children: [
      { selector: '.label', hoverIn: { x: 3 }, hoverOut: { x: 0 } },
      { selector: 'img', hoverIn: { rotate: -8 }, hoverOut: { rotate: 0 } },
    ],
  });

  const containerOnly = createLiftHoverAnimations({
    hoverIn: { x: 4 },
    hoverOut: { x: 0 },
    press: { x: 1 },
    release: { x: 4 },
  });

  function makeContainer(populated: boolean): HTMLElement {
    const container = document.createElement('a');
    if (populated) {
      const label = document.createElement('span');
      label.className = 'label';
      container.append(label, document.createElement('img'));
    }
    return container;
  }

  beforeEach(() => {
    spyOn(gsap, 'to');
    spyOn(gsap, 'killTweensOf');
  });

  it('hoverIn kills container + children in one batch then tweens each target with its vars', () => {
    const container = makeContainer(true);
    const label = container.querySelector('.label');
    const icon = container.querySelector('img');

    withChildren.hoverIn(container);

    expect(gsap.killTweensOf).toHaveBeenCalledOnceWith([container, label, icon]);
    const toSpy = gsap.to as jasmine.Spy;
    expect(toSpy.calls.count()).toBe(3);
    expect(toSpy.calls.argsFor(0)).toEqual([container, jasmine.objectContaining({ y: -2 })]);
    expect(toSpy.calls.argsFor(1)).toEqual([label, jasmine.objectContaining({ x: 3 })]);
    expect(toSpy.calls.argsFor(2)).toEqual([icon, jasmine.objectContaining({ rotate: -8 })]);
  });

  it('hoverOut skips absent children while keeping them in the kill batch', () => {
    const container = makeContainer(false);

    withChildren.hoverOut(container);

    expect(gsap.killTweensOf).toHaveBeenCalledOnceWith([container, null, null]);
    const toSpy = gsap.to as jasmine.Spy;
    expect(toSpy.calls.count()).toBe(1);
    expect(toSpy.calls.argsFor(0)).toEqual([container, jasmine.objectContaining({ y: 0 })]);
  });

  it('press and release only ever target the container', () => {
    const container = makeContainer(true);

    withChildren.press(container);
    expect(gsap.killTweensOf).toHaveBeenCalledWith(container);
    expect((gsap.to as jasmine.Spy).calls.mostRecent().args).toEqual([
      container,
      jasmine.objectContaining({ scale: 0.985 }),
    ]);

    withChildren.release(container);
    expect((gsap.to as jasmine.Spy).calls.mostRecent().args).toEqual([
      container,
      jasmine.objectContaining({ scale: 1.012 }),
    ]);
  });

  it('without children configured, hover kills tweens on the bare container', () => {
    const container = makeContainer(false);

    containerOnly.hoverIn(container);

    expect(gsap.killTweensOf).toHaveBeenCalledOnceWith(container);
    const toSpy = gsap.to as jasmine.Spy;
    expect(toSpy.calls.count()).toBe(1);
    expect(toSpy.calls.argsFor(0)).toEqual([container, jasmine.objectContaining({ x: 4 })]);
  });
});
