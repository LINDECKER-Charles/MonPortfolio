import {
  buildClusters,
  buildEdges,
  buildNodes,
  connectedIds,
  resolveSeeds,
  STARS,
  UNIVERSE,
  VIEWBOX,
} from './constellation.layout';
import { ConstellationCategory, ConstellationItem } from './constellation.model';

const cat = (id: string, seed?: ConstellationCategory['seed']): ConstellationCategory => ({
  id,
  label: id,
  color: '#fff',
  glyph: '◆',
  seed,
});

const item = (id: string, category: string, tags: string[] = []): ConstellationItem => ({
  id,
  title: id,
  category,
  tags,
});

describe('constellation.layout', () => {
  describe('resolveSeeds', () => {
    it('honours an explicit seed', () => {
      const seed = { cx: 10, cy: 20, spread: 5, angle: 1 };
      const seeds = resolveSeeds([cat('a', seed)]);
      expect(seeds.get('a')).toEqual(seed);
    });

    it('places a single seedless category at the core centre', () => {
      const seeds = resolveSeeds([cat('solo')]);
      const s = seeds.get('solo')!;
      expect(s.cx).toBe(VIEWBOX.w / 2);
      expect(s.cy).toBe(VIEWBOX.h / 2 - 4);
      expect(s.spread).toBe(20);
    });

    it('distributes multiple seedless categories on an ellipse (wide spread <=3)', () => {
      const seeds = resolveSeeds([cat('a'), cat('b'), cat('c')]);
      expect(seeds.size).toBe(3);
      for (const s of seeds.values()) expect(s.spread).toBe(16);
    });

    it('uses a tighter spread for >3 categories', () => {
      const seeds = resolveSeeds([cat('a'), cat('b'), cat('c'), cat('d')]);
      for (const s of seeds.values()) expect(s.spread).toBe(12);
    });
  });

  describe('buildNodes', () => {
    it('places a lone node in its cluster at the seed', () => {
      const nodes = buildNodes(
        [item('x', 'a')],
        [cat('a', { cx: 40, cy: 30, spread: 10, angle: 0 })],
      );
      expect(nodes.length).toBe(1);
      expect(nodes[0].x).toBe(40);
      expect(nodes[0].y).toBeCloseTo(30 - 10 * 0.15, 5);
    });

    it('spreads several nodes around the seed and clamps to the frame', () => {
      const items = ['a', 'b', 'c', 'd'].map((id) => item(id, 'g'));
      const nodes = buildNodes(items, [cat('g', { cx: 50, cy: 36, spread: 40, angle: 0 })]);
      expect(nodes.length).toBe(4);
      for (const n of nodes) {
        expect(n.x).toBeGreaterThanOrEqual(7);
        expect(n.x).toBeLessThanOrEqual(VIEWBOX.w - 7);
        expect(n.y).toBeGreaterThanOrEqual(9);
        expect(n.y).toBeLessThanOrEqual(63);
      }
    });

    it('sets labelBelow for high (small-y) nodes', () => {
      const nodes = buildNodes(
        [item('hi', 'a')],
        [cat('a', { cx: 50, cy: 15, spread: 4, angle: 0 })],
      );
      expect(nodes[0].labelBelow).toBeTrue();
    });

    it('is deterministic for the same id', () => {
      const a = buildNodes([item('z', 'a')], [cat('a', { cx: 50, cy: 36, spread: 10, angle: 0 })]);
      const b = buildNodes([item('z', 'a')], [cat('a', { cx: 50, cy: 36, spread: 10, angle: 0 })]);
      expect(a[0].driftDelay).toBe(b[0].driftDelay);
      expect(a[0].driftDur).toBe(b[0].driftDur);
    });

    it('skips items whose category has no seed', () => {
      // Category present but resolveSeeds always yields a seed; ensure unknown cat items are ignored.
      const nodes = buildNodes([item('x', 'a'), item('y', 'ghost')], [cat('a')]);
      expect(nodes.map((n) => n.id)).toEqual(['x']);
    });
  });

  describe('buildClusters', () => {
    it('only emits rings for categories that have items', () => {
      const rings = buildClusters([item('x', 'a')], [cat('a'), cat('b')]);
      expect(rings.map((r) => r.id)).toEqual(['a']);
      expect(rings[0].rx).toBeGreaterThan(0);
      expect(rings[0].ry).toBeGreaterThan(0);
    });
  });

  describe('buildEdges', () => {
    it('links items sharing a tag, deduplicated', () => {
      const edges = buildEdges([item('one', 'a', ['x', 'y']), item('two', 'b', ['y', 'z'])]);
      expect(edges.length).toBe(1);
      expect([edges[0].a, edges[0].b].sort()).toEqual(['one', 'two']);
    });

    it('returns no edge when no tag is shared', () => {
      expect(buildEdges([item('a', 'c', ['p']), item('b', 'c', ['q'])])).toEqual([]);
    });

    it('ignores empty / whitespace tags', () => {
      const edges = buildEdges([item('a', 'c', ['', '  ']), item('b', 'c', ['', '  '])]);
      expect(edges).toEqual([]);
    });

    it('caps to the 2 strongest neighbours per node', () => {
      // 'hub' shares with 3 others; sorted by weight then id, keeps the 2 strongest.
      const edges = buildEdges([
        item('hub', 'c', ['a', 'b', 'c']),
        item('strong1', 'c', ['a', 'b']),
        item('strong2', 'c', ['a', 'c']),
        item('weak', 'c', ['c']),
      ]);
      const hubEdges = edges.filter((e) => e.a === 'hub' || e.b === 'hub');
      expect(hubEdges.length).toBeLessThanOrEqual(3); // hub's own 2 + reverse links
      const partners = new Set(hubEdges.map((e) => (e.a === 'hub' ? e.b : e.a)));
      expect(partners.has('strong1')).toBeTrue();
      expect(partners.has('strong2')).toBeTrue();
    });
  });

  describe('connectedIds', () => {
    const edges = [
      { a: 'one', b: 'two' },
      { a: 'two', b: 'three' },
    ];

    it('returns empty for a null selection', () => {
      expect(connectedIds(null, edges).size).toBe(0);
    });

    it('returns neighbours on both edge sides', () => {
      expect([...connectedIds('two', edges)].sort()).toEqual(['one', 'three']);
      expect([...connectedIds('one', edges)]).toEqual(['two']);
    });
  });

  describe('STARS', () => {
    it('is a stable decorative field within the universe bounds', () => {
      expect(STARS.length).toBe(220);
      for (const s of STARS) {
        expect(Number.isFinite(s.x)).toBeTrue();
        expect(Number.isFinite(s.y)).toBeTrue();
        expect(s.r).toBeGreaterThan(0);
      }
      expect(UNIVERSE.w).toBeGreaterThan(VIEWBOX.w);
    });
  });
});
