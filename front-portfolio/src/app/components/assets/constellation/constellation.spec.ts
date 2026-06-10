import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Constellation } from './constellation';
import {
  ConstellationCategory,
  ConstellationItem,
  ConstellationLabels,
} from './constellation.model';

const CATEGORIES: ConstellationCategory[] = [
  { id: 'a', label: 'Alpha', color: '#ff934d', glyph: '◆' },
  { id: 'b', label: 'Beta', color: '#8eb8ff', glyph: '✦' },
];

const ITEMS: ConstellationItem[] = [
  {
    id: 'one',
    title: 'One',
    category: 'a',
    tags: ['x', 'y'],
    chips: ['Angular'],
    description: 'first',
    period: '2024',
    statusLabel: 'Done',
    statusTone: 'active',
    actions: [
      { label: 'Repo', href: 'https://gh', icon: 'github' },
      { label: 'Site', href: 'https://site', icon: 'website' },
      { label: 'Demo', href: 'https://demo' },
    ],
  },
  { id: 'two', title: 'Two', category: 'b', tags: ['y', 'z'] },
];

/** Accès aux membres protégés/privés sans `any` qui pollue tout le fichier. */
type Internals = {
  // protected
  isVisible(item: ConstellationItem): boolean;
  isDimmed(node: { id: string; item: ConstellationItem }): boolean;
  isEdgeHighlighted(edge: { a: string; b: string }): boolean;
  isEdgeDimmed(edge: { a: string; b: string }): boolean;
  selectNode(id: string): void;
  toggleCategory(id: string): void;
  onSearch(value: string): void;
  selectedId(): string | null;
  selectedItem(): ConstellationItem | null;
  relatedItems(): ConstellationItem[];
  metaLabel(): string;
  categoryLabel(id: string): string;
  categoryColor(id: string): string;
  categoryGlyph(id: string): string;
  scale(): number;
  galaxyMode(): boolean;
  canReset(): boolean;
  panelAccent(): string;
  zoomIn(): void;
  zoomOut(): void;
  resetView(): void;
  onWheel(e: WheelEvent): void;
  onPointerDown(e: PointerEvent): void;
  onPointerMove(e: PointerEvent): void;
  onPointerUp(e: PointerEvent): void;
  onNodeKeydown(e: KeyboardEvent, id: string): void;
  onLegendKeydown(e: KeyboardEvent, id: string): void;
  openSelectedDetail(): void;
  viewBoxAttr(): string;
  // private
  step(): void;
  displaced(): Map<string, unknown>;
  draggingId: string | null;
  rafId: number | null;
};

const asInternals = (c: Constellation) => c as unknown as Internals;

/** PointerEvent factice : currentTarget = svg réel pour capture/getBoundingClientRect. */
function pointer(
  type: string,
  svg: SVGSVGElement,
  init: Partial<PointerEvent> & { target?: Element } = {}
): PointerEvent {
  const ev = {
    type,
    pointerId: init.pointerId ?? 1,
    pointerType: init.pointerType ?? 'mouse',
    button: init.button ?? 0,
    clientX: init.clientX ?? 0,
    clientY: init.clientY ?? 0,
    currentTarget: svg,
    target: init.target ?? svg,
    preventDefault: () => {},
  } as unknown as PointerEvent;
  return ev;
}

describe('Constellation', () => {
  let component: Constellation;
  let fixture: ComponentFixture<Constellation>;
  let api: Internals;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Constellation],
    }).compileComponents();

    fixture = TestBed.createComponent(Constellation);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('categories', CATEGORIES);
    component = fixture.componentInstance;
    api = asInternals(component);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links items sharing a tag', () => {
    const svg = fixture.nativeElement.querySelectorAll('.constellation__edge');
    expect(svg.length).toBe(1);
  });

  it('renders an empty state with no items', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.constellation__empty')).toBeTruthy();
  });

  // ─── Sélection & panneau ───
  it('defaults the selection to the first visible item', () => {
    expect(api.selectedId()).toBe('one');
  });

  it('selecting a node drives the detail panel and related list', () => {
    api.selectNode('two');
    fixture.detectChanges();
    expect(api.selectedId()).toBe('two');
    // one & two are linked → related contains 'one'
    expect(api.relatedItems().map((i) => i.id)).toEqual(['one']);
  });

  it('falls back to first visible when the selected item is filtered out', () => {
    api.selectNode('one');
    api.onSearch('zzz-no-match'); // hides everything
    fixture.detectChanges();
    expect(api.selectedItem()).toBeNull();
  });

  it('search filters visibility across title, tags, chips and category label', () => {
    api.onSearch('angular'); // chip of 'one'
    expect(api.isVisible(ITEMS[0])).toBeTrue();
    expect(api.isVisible(ITEMS[1])).toBeFalse();

    api.onSearch('beta'); // category label of 'two'
    expect(api.isVisible(ITEMS[1])).toBeTrue();
  });

  // ─── Légende / filtres ───
  it('toggling a category hides its nodes then restores all when last is off', () => {
    api.toggleCategory('a');
    fixture.detectChanges();
    expect(api.isVisible(ITEMS[0])).toBeFalse();
    expect(api.isVisible(ITEMS[1])).toBeTrue();

    // Turn off the remaining one too → set empties → null → everything visible again.
    api.toggleCategory('b');
    fixture.detectChanges();
    expect(api.isVisible(ITEMS[0])).toBeTrue();
    expect(api.isVisible(ITEMS[1])).toBeTrue();
  });

  it('dims nodes that are neither selected nor connected', () => {
    api.onSearch('beta'); // hides 'one'
    expect(api.isDimmed({ id: 'one', item: ITEMS[0] })).toBeTrue();
  });

  it('highlights edges touching the selection and dims the rest', () => {
    api.selectNode('one');
    const edge = { a: 'one', b: 'two' };
    expect(api.isEdgeHighlighted(edge)).toBeTrue();
    expect(api.isEdgeDimmed(edge)).toBeFalse();
    expect(api.isEdgeDimmed({ a: 'x', b: 'y' })).toBeTrue();
  });

  // ─── Helpers catégorie ───
  it('resolves category label/color/glyph with fallbacks', () => {
    expect(api.categoryLabel('a')).toBe('Alpha');
    expect(api.categoryLabel('unknown')).toBe('unknown');
    expect(api.categoryColor('unknown')).toBe('var(--cst-accent)');
    expect(api.categoryGlyph('unknown')).toBe('');
  });

  it('builds the meta label from counts and links', () => {
    expect(api.metaLabel()).toBe('2 items · 1 links');
  });

  it('uses custom labels input', () => {
    const labels: ConstellationLabels = {
      ...({} as ConstellationLabels),
      region: 'R',
      search: 'S',
      zoomIn: 'I',
      zoomOut: 'O',
      reset: 'Re',
      legend: 'L',
      related: 'Rel',
      detail: 'D',
      emptyTitle: 'ET',
      emptyText: 'EX',
      meta: '{count}/{links}',
    };
    fixture.componentRef.setInput('labels', labels);
    fixture.detectChanges();
    expect(api.metaLabel()).toBe('2/1');
  });

  // ─── Zoom / pan ───
  it('zoomIn / zoomOut / resetView drive scale and canReset', () => {
    expect(api.canReset()).toBeFalse();
    api.zoomIn();
    expect(api.scale()).toBeGreaterThan(1);
    expect(api.canReset()).toBeTrue();
    api.resetView();
    expect(api.scale()).toBe(1);
    expect(api.canReset()).toBeFalse();
  });

  it('clamps zoom-out below the galaxy threshold (galaxyMode on)', () => {
    for (let i = 0; i < 12; i++) api.zoomOut();
    expect(api.galaxyMode()).toBeTrue();
    // never goes below MIN_SCALE = VIEWBOX.w / UNIVERSE.w
    expect(api.scale()).toBeGreaterThanOrEqual(100 / 300 - 1e-9);
  });

  it('clamps zoom-in to MAX_SCALE', () => {
    for (let i = 0; i < 20; i++) api.zoomIn();
    expect(api.scale()).toBeLessThanOrEqual(4.5);
  });

  it('wheel zooms toward the cursor and prevents default', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    spyOn(svg, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 144,
    } as DOMRect);
    const prevent = jasmine.createSpy('preventDefault');
    api.onWheel({
      deltaY: -100,
      currentTarget: svg,
      clientX: 100,
      clientY: 72,
      preventDefault: prevent,
    } as unknown as WheelEvent);
    expect(prevent).toHaveBeenCalled();
    expect(api.scale()).toBeGreaterThan(1);
  });

  // ─── Pointeur : sélection au tap, pan au drag ───
  it('tap (no movement) selects the node under the pointer', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    spyOn(svg, 'setPointerCapture');
    spyOn(svg, 'releasePointerCapture');
    spyOn(svg, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 144,
    } as DOMRect);
    const nodeEl = fixture.nativeElement.querySelector('[data-node-id="two"]') as Element;

    api.onPointerDown(pointer('pointerdown', svg, { target: nodeEl, clientX: 10, clientY: 10 }));
    api.onPointerUp(pointer('pointerup', svg, { clientX: 10, clientY: 10 }));

    expect(api.selectedId()).toBe('two');
  });

  it('ignores non-primary mouse buttons on pointer down', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    const capture = spyOn(svg, 'setPointerCapture');
    api.onPointerDown(pointer('pointerdown', svg, { button: 2 }));
    expect(capture).not.toHaveBeenCalled();
  });

  it('ignores pointer moves from a different pointerId', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    spyOn(svg, 'setPointerCapture');
    spyOn(svg, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 144,
    } as DOMRect);
    api.onPointerDown(pointer('pointerdown', svg, { pointerId: 1 }));
    // foreign pointer → early return, no panning
    api.onPointerMove(pointer('pointermove', svg, { pointerId: 99, clientX: 50, clientY: 50 }));
    expect(component['isPanning']()).toBeFalse();
  });

  it('drag beyond threshold on empty space pans the viewBox', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    spyOn(svg, 'setPointerCapture');
    spyOn(svg, 'releasePointerCapture');
    spyOn(svg, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 144,
    } as DOMRect);
    api.zoomIn(); // scale > 1 so panning has room to move the center
    const before = api.viewBoxAttr();

    api.onPointerDown(pointer('pointerdown', svg, { clientX: 100, clientY: 72 }));
    api.onPointerMove(pointer('pointermove', svg, { clientX: 140, clientY: 100 }));
    fixture.detectChanges();

    expect(component['isPanning']()).toBeTrue();
    expect(api.viewBoxAttr()).not.toBe(before);
    api.onPointerUp(pointer('pointerup', svg, { clientX: 140, clientY: 100 }));
    expect(component['isPanning']()).toBeFalse();
  });

  it('drag starting on a node grabs it and starts the spring loop', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    spyOn(svg, 'setPointerCapture');
    spyOn(svg, 'releasePointerCapture');
    spyOn(svg, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 144,
    } as DOMRect);
    const rafSpy = spyOn(window, 'requestAnimationFrame').and.returnValue(123);
    const nodeEl = fixture.nativeElement.querySelector('[data-node-id="one"]') as Element;

    api.onPointerDown(pointer('pointerdown', svg, { target: nodeEl, clientX: 50, clientY: 50 }));
    api.onPointerMove(pointer('pointermove', svg, { clientX: 90, clientY: 90 }));

    expect(api.draggingId).toBe('one');
    expect(api.selectedId()).toBe('one');
    expect(rafSpy).toHaveBeenCalled();

    api.onPointerUp(pointer('pointerup', svg, { clientX: 90, clientY: 90 }));
    expect(api.draggingId).toBeNull();
  });

  // ─── Boucle ressort (step) ───
  it('step pins the dragged node and reschedules a frame', () => {
    const rafSpy = spyOn(window, 'requestAnimationFrame').and.returnValue(7);
    api.draggingId = 'one';
    (component as unknown as { dragTarget: { x: number; y: number } }).dragTarget = {
      x: 60,
      y: 40,
    };
    api.step();
    const moved = api.displaced();
    expect(moved.get('one')).toEqual(
      jasmine.objectContaining({ x: 60, y: 40, vx: 0, vy: 0 })
    );
    expect(rafSpy).toHaveBeenCalled();
  });

  it('step settles to rest (clears displacements) when no drag and low energy', () => {
    api.draggingId = null;
    api.rafId = 99;
    api.step(); // all nodes at home, no force → energy 0 → rest
    expect(api.displaced().size).toBe(0);
    expect(api.rafId).toBeNull();
  });

  // ─── Clavier ───
  it('Enter/Space on a node selects it; other keys are ignored', () => {
    const enter = { key: 'Enter', preventDefault: jasmine.createSpy() } as unknown as KeyboardEvent;
    api.onNodeKeydown(enter, 'two');
    expect(enter.preventDefault).toHaveBeenCalled();
    expect(api.selectedId()).toBe('two');

    const tab = { key: 'Tab', preventDefault: jasmine.createSpy() } as unknown as KeyboardEvent;
    api.onNodeKeydown(tab, 'one');
    expect(tab.preventDefault).not.toHaveBeenCalled();
    expect(api.selectedId()).toBe('two'); // unchanged
  });

  it('Enter/Space on a legend row toggles the category', () => {
    const space = { key: ' ', preventDefault: jasmine.createSpy() } as unknown as KeyboardEvent;
    api.onLegendKeydown(space, 'a');
    expect(space.preventDefault).toHaveBeenCalled();
    expect(api.isVisible(ITEMS[0])).toBeFalse();
  });

  // ─── Output ───
  it('openSelectedDetail emits the current item', () => {
    const spy = jasmine.createSpy('opened');
    component.itemOpened.subscribe(spy);
    api.selectNode('two');
    api.openSelectedDetail();
    expect(spy).toHaveBeenCalledOnceWith(jasmine.objectContaining({ id: 'two' }));
  });

  it('openSelectedDetail does nothing when nothing is selected', () => {
    const spy = jasmine.createSpy('opened');
    component.itemOpened.subscribe(spy);
    api.onSearch('zzz-no-match');
    fixture.detectChanges();
    api.openSelectedDetail();
    expect(spy).not.toHaveBeenCalled();
  });

  it('panelAccent reflects the selected category, neutral when empty', () => {
    expect(api.panelAccent()).toBe('#ff934d'); // 'one' → category a
    api.onSearch('zzz-no-match');
    fixture.detectChanges();
    expect(api.panelAccent()).toBe('var(--cst-accent)');
  });

  // ─── Cleanup ───
  it('cancels a pending RAF on destroy', () => {
    const cancel = spyOn(window, 'cancelAnimationFrame');
    api.rafId = 42;
    component.ngOnDestroy();
    expect(cancel).toHaveBeenCalledWith(42);
  });
});
