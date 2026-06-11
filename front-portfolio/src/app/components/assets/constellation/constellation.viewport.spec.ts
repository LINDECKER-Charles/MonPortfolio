import { UNIVERSE, VIEWBOX } from './constellation.layout';
import {
  clampCenter,
  clientToViewBox,
  MAX_SCALE,
  MIN_SCALE,
  viewBoxAttr,
  ViewportRect,
  zoomTowardTarget,
} from './constellation.viewport';

const RECT: ViewportRect = { left: 0, top: 0, width: 200, height: 144 };
const HOME = { x: VIEWBOX.w / 2, y: VIEWBOX.h / 2 };

describe('constellation.viewport', () => {
  // ─── clampCenter ───
  it('keeps an in-bounds center untouched', () => {
    expect(clampCenter(60, 40, 2)).toEqual({ x: 60, y: 40 });
  });

  it('clamps the center so the window stays inside the universe', () => {
    // À scale 1 : demi-fenêtre 50×36 → bornes x ∈ [-50, 150], y ∈ [-36, 108].
    expect(clampCenter(10_000, 10_000, 1)).toEqual({ x: 150, y: 108 });
    expect(clampCenter(-10_000, -10_000, 1)).toEqual({ x: -50, y: -36 });
  });

  it('recenters when the window is wider than the universe (scale < min)', () => {
    expect(clampCenter(999, 999, 0.2)).toEqual({ x: HOME.x, y: HOME.y });
  });

  it('pins the center at MIN_SCALE (window exactly covers the universe)', () => {
    const pinned = clampCenter(0, 0, MIN_SCALE);
    expect(pinned.x).toBeCloseTo(HOME.x, 9);
    expect(pinned.y).toBeCloseTo(HOME.y, 9);
  });

  // ─── clientToViewBox ───
  it('maps screen corners and center to viewBox coordinates', () => {
    expect(clientToViewBox(0, 0, RECT, 1, HOME)).toEqual({ x: 0, y: 0 });
    expect(clientToViewBox(200, 144, RECT, 1, HOME)).toEqual({ x: VIEWBOX.w, y: VIEWBOX.h });
    expect(clientToViewBox(100, 72, RECT, 2, HOME)).toEqual({ x: HOME.x, y: HOME.y });
  });

  // ─── zoomTowardTarget ───
  it('keeps the point under the cursor fixed while zooming', () => {
    const before = clientToViewBox(50, 36, RECT, 1, HOME);
    const next = zoomTowardTarget(2, 50, 36, RECT, 1, HOME);
    const after = clientToViewBox(50, 36, RECT, next.scale, next.center);
    expect(next.scale).toBe(2);
    expect(after.x).toBeCloseTo(before.x, 9);
    expect(after.y).toBeCloseTo(before.y, 9);
  });

  it('clamps the target scale to [MIN_SCALE, MAX_SCALE]', () => {
    expect(zoomTowardTarget(99, 100, 72, RECT, 1, HOME).scale).toBe(MAX_SCALE);
    expect(zoomTowardTarget(0.01, 100, 72, RECT, 1, HOME).scale).toBe(MIN_SCALE);
  });

  it('derives MIN_SCALE from the universe / viewBox ratio', () => {
    expect(MIN_SCALE).toBeCloseTo(VIEWBOX.w / UNIVERSE.w, 12);
  });

  // ─── viewBoxAttr ───
  it('serializes the visible window with 3 decimals', () => {
    expect(viewBoxAttr(1, HOME)).toBe('0.000 0.000 100.000 72.000');
    expect(viewBoxAttr(2, HOME)).toBe('25.000 18.000 50.000 36.000');
  });
});
