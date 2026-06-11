import { DAMP, K_ANCHOR, Sim, simStep, SpringAnchor, SpringEdge } from './constellation.physics';

const at = (id: string, x: number, y: number): SpringAnchor => ({ id, x, y });
const sim = (x: number, y: number, vx = 0, vy = 0): Sim => ({ x, y, vx, vy });

describe('constellation.physics', () => {
  it('settles immediately when everything is at home and nothing is dragged', () => {
    const { next, settled } = simStep([at('a', 10, 20)], [], new Map(), null, { x: 0, y: 0 });
    expect(settled).toBeTrue();
    expect(next.get('a')).toEqual(sim(10, 20));
  });

  it('pulls a displaced node back toward its anchor (damped Euler step)', () => {
    const displaced = new Map([['a', sim(20, 10)]]);
    const { next, settled } = simStep([at('a', 10, 10)], [], displaced, null, { x: 0, y: 0 });

    expect(settled).toBeFalse();
    // vx = (0 + (10 - 20) * K_ANCHOR) * DAMP, appliqué à la position.
    const vx = (10 - 20) * K_ANCHOR * DAMP;
    expect(next.get('a')!.vx).toBeCloseTo(vx, 12);
    expect(next.get('a')!.x).toBeCloseTo(20 + vx, 12);
    expect(next.get('a')!.y).toBe(10);
  });

  it('converges back to rest after repeated steps', () => {
    const homes = [at('a', 10, 10)];
    let displaced: Map<string, Sim> = new Map([['a', sim(20, 10)]]);
    let settled = false;

    for (let i = 0; i < 500 && !settled; i++) {
      ({ next: displaced, settled } = simStep(homes, [], displaced, null, { x: 0, y: 0 }));
    }

    // `settled` = énergie cinétique sous le seuil ; la position peut rester
    // légèrement décalée — le composant snappe alors aux positions d'origine.
    expect(settled).toBeTrue();
    expect(Math.abs(displaced.get('a')!.x - 10)).toBeLessThan(2);
    expect(displaced.get('a')!.vx).toBeCloseTo(0, 1);
  });

  it('pins the dragged node on the pointer target with zero velocity', () => {
    const { next, settled } = simStep([at('a', 10, 10)], [], new Map(), 'a', { x: 60, y: 40 });
    expect(settled).toBeFalse(); // jamais au repos tant qu'un drag est actif
    expect(next.get('a')).toEqual(sim(60, 40));
  });

  it('propagates the drag to neighbours through edge tension', () => {
    const homes = [at('a', 0, 0), at('b', 10, 0)];
    const edges: SpringEdge[] = [{ a: 'a', b: 'b' }];
    const { next } = simStep(homes, edges, new Map(), 'a', { x: -10, y: 0 });

    // a épinglée à -10 → lien étiré (20 > 10 au repos) → b tirée vers a.
    expect(next.get('a')).toEqual(sim(-10, 0));
    expect(next.get('b')!.x).toBeLessThan(10);
    expect(next.get('b')!.y).toBe(0);
  });

  it('ignores edges referencing unknown anchors', () => {
    const { next, settled } = simStep([at('a', 0, 0)], [{ a: 'a', b: 'ghost' }], new Map(), null, {
      x: 0,
      y: 0,
    });
    expect(settled).toBeTrue();
    expect(next.get('a')).toEqual(sim(0, 0));
  });
});
