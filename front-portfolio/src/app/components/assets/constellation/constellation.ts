import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ConstellationCategory,
  ConstellationItem,
  ConstellationLabels,
  DEFAULT_CONSTELLATION_LABELS,
} from './constellation.model';
import {
  buildClusters,
  buildEdges,
  buildNodes,
  connectedIds,
  ConstellationEdge,
  ConstellationNode,
  STARS,
  VIEWBOX,
} from './constellation.layout';
import {
  clampCenter,
  clampNumber,
  clientToViewBox as toViewBox,
  GALAXY_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  viewBoxAttr as toViewBoxAttr,
  zoomTowardTarget,
} from './constellation.viewport';
import { Sim, simStep } from './constellation.physics';

interface PositionedEdge {
  edge: ConstellationEdge;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const DRAG_THRESHOLD_PX = 3;

/**
 * Carte interactive « constellation » : items placés en clusters de catégorie,
 * reliés par tags partagés, avec pan/zoom, vue galaxie, recherche, légende
 * filtrante, effet ressort au drag et panneau de détail intégré.
 *
 * Autonome : aucune dépendance hors de ce dossier (+ Angular core). i18n via
 * l'input `labels`, données via les inputs `items` / `categories`.
 */
@Component({
  selector: 'app-constellation',
  imports: [],
  templateUrl: './constellation.html',
  styleUrl: './constellation.css',
})
export class Constellation implements OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly items = input.required<ConstellationItem[]>();
  readonly categories = input.required<ConstellationCategory[]>();
  readonly labels = input<ConstellationLabels>(DEFAULT_CONSTELLATION_LABELS);
  readonly itemOpened = output<ConstellationItem>();

  protected readonly viewBox = VIEWBOX;
  protected readonly stars = STARS;

  protected readonly categoryById = computed(
    () => new Map(this.categories().map((category) => [category.id, category])),
  );

  /** Positions « maison » (déterministes, SSR-safe). */
  protected readonly nodes = computed(() => buildNodes(this.items(), this.categories()));
  protected readonly edges = computed(() => buildEdges(this.items()));
  protected readonly clusters = computed(() => buildClusters(this.items(), this.categories()));

  /** Déplacements en cours (drag + ressort) ; vide ⇒ tout est à sa place. */
  private readonly displaced = signal<Map<string, Sim>>(new Map());

  /** Nœuds rendus = maison, surchargés par les déplacements actifs. */
  protected readonly renderNodes = computed<ConstellationNode[]>(() => {
    const moved = this.displaced();
    if (!moved.size) return this.nodes();
    return this.nodes().map((node) => {
      const p = moved.get(node.id);
      return p ? { ...node, x: p.x, y: p.y } : node;
    });
  });

  /** Arêtes résolues en coordonnées (évite les lookups répétés au rendu). */
  protected readonly positionedEdges = computed(() => {
    const byId = new Map(this.renderNodes().map((node) => [node.id, node]));
    return this.edges()
      .map((edge) => {
        const a = byId.get(edge.a);
        const b = byId.get(edge.b);
        return a && b ? { edge, x1: a.x, y1: a.y, x2: b.x, y2: b.y } : null;
      })
      .filter((line): line is PositionedEdge => line !== null);
  });

  protected readonly counts = computed<Map<string, number>>(() => {
    const tally = new Map<string, number>();
    for (const item of this.items()) {
      tally.set(item.category, (tally.get(item.category) ?? 0) + 1);
    }
    return tally;
  });

  /** Sélection utilisateur ; null = on retombe sur le premier item visible. */
  private readonly userSelectedId = signal<string | null>(null);
  /** null ⇒ toutes les catégories actives (évite l'init avant l'input). */
  private readonly activeCategories = signal<Set<string> | null>(null);
  protected readonly query = signal('');

  /** Item effectivement affiché dans le panneau (sélection ou repli visible). */
  protected readonly selectedItem = computed<ConstellationItem | null>(() => {
    const list = this.items();
    const id = this.userSelectedId();

    if (id) {
      const picked = list.find((item) => item.id === id);
      if (picked && this.isVisible(picked)) return picked;
    }

    return list.find((item) => this.isVisible(item)) ?? null;
  });

  protected readonly selectedId = computed(() => this.selectedItem()?.id ?? null);

  private readonly connected = computed(() => connectedIds(this.selectedId(), this.edges()));

  protected readonly relatedItems = computed<ConstellationItem[]>(() => {
    const ids = this.connected();
    if (!ids.size) return [];
    const byId = new Map(this.items().map((item) => [item.id, item]));
    return [...ids].map((id) => byId.get(id)).filter((item): item is ConstellationItem => !!item);
  });

  protected readonly metaLabel = computed(() =>
    this.labels()
      .meta.replace('{count}', String(this.items().length))
      .replace('{links}', String(this.edges().length)),
  );

  protected categoryLabel(id: string): string {
    return this.categoryById().get(id)?.label ?? id;
  }

  protected categoryGlyph(id: string): string {
    return this.categoryById().get(id)?.glyph ?? '';
  }

  protected categoryColor(id: string): string {
    return this.categoryById().get(id)?.color ?? 'var(--cst-accent)';
  }

  protected isCategoryActive(id: string): boolean {
    const active = this.activeCategories();
    return active ? active.has(id) : true;
  }

  protected isVisible(item: ConstellationItem): boolean {
    if (!this.isCategoryActive(item.category)) return false;

    const query = this.query().trim().toLowerCase();
    if (!query) return true;

    const haystack = [
      item.title,
      this.categoryLabel(item.category),
      ...item.tags,
      ...(item.chips ?? []),
    ];
    return haystack.some((value) => value.toLowerCase().includes(query));
  }

  protected isSelected(node: ConstellationNode): boolean {
    return node.id === this.selectedId();
  }

  protected isDimmed(node: ConstellationNode): boolean {
    if (!this.isVisible(node.item)) return true;

    const selectedId = this.selectedId();
    if (!selectedId) return false;

    return node.id !== selectedId && !this.connected().has(node.id);
  }

  protected isEdgeHighlighted(edge: ConstellationEdge): boolean {
    const selectedId = this.selectedId();
    return !!selectedId && (edge.a === selectedId || edge.b === selectedId);
  }

  protected isEdgeDimmed(edge: ConstellationEdge): boolean {
    return !!this.selectedId() && !this.isEdgeHighlighted(edge);
  }

  protected nodeColor(node: ConstellationNode): string {
    return this.categoryColor(node.item.category);
  }

  protected selectNode(id: string): void {
    this.userSelectedId.set(id);
  }

  protected toggleCategory(id: string): void {
    const current = this.activeCategories() ?? new Set(this.categories().map((c) => c.id));
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    // Au moins une constellation reste visible (null ⇒ toutes).
    this.activeCategories.set(next.size ? next : null);
  }

  protected onSearch(value: string): void {
    this.query.set(value);
  }

  // ─── Navigation pan / zoom (manipulation du viewBox SVG) ───
  protected readonly scale = signal(1);
  private readonly center = signal({ x: VIEWBOX.w / 2, y: VIEWBOX.h / 2 });
  protected readonly isPanning = signal(false);

  protected readonly viewBoxAttr = computed(() => toViewBoxAttr(this.scale(), this.center()));

  protected readonly canReset = computed(
    () =>
      this.scale() !== 1 || this.center().x !== VIEWBOX.w / 2 || this.center().y !== VIEWBOX.h / 2,
  );

  /** Vue galaxie : très dézoomé, on n'affiche plus que les boules lumineuses. */
  protected readonly galaxyMode = computed(() => this.scale() < GALAXY_SCALE);

  /** Accent du panneau : couleur de la constellation sélectionnée. */
  protected readonly panelAccent = computed(() => {
    const item = this.selectedItem();
    return item ? this.categoryColor(item.category) : 'var(--cst-accent)';
  });

  private pointerId: number | null = null;
  private lastPointer: { x: number; y: number } | null = null;
  private svgRect: DOMRect | null = null;
  /** Nœud sous le pointeur au down ; sélectionné au up si on n'a pas pané. */
  private candidateNodeId: string | null = null;
  /** Vrai si le pointeur a bougé au-delà du seuil → pan/drag, pas sélection. */
  private movedDuringDrag = false;

  /** Sphère en cours de déplacement (grab) ; null ⇒ pan ou rien. */
  private draggingId: string | null = null;
  /** Cible (coordonnées viewBox) sur laquelle la sphère tirée est épinglée. */
  private dragTarget: { x: number; y: number } = { x: 0, y: 0 };
  private rafId: number | null = null;
  private readonly stepBound = (): void => this.step();

  /** Borne le centre via la géométrie pure (cf. {@link clampCenter}). */
  private setCenter(x: number, y: number): void {
    this.center.set(clampCenter(x, y, this.scale()));
  }

  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const svg = event.currentTarget as SVGSVGElement;
    this.svgRect = svg.getBoundingClientRect();
    this.pointerId = event.pointerId;
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.movedDuringDrag = false;

    const target = event.target as Element | null;
    this.candidateNodeId =
      target?.closest?.('[data-node-id]')?.getAttribute('data-node-id') ?? null;

    svg.setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId || !this.lastPointer || !this.svgRect) return;

    const dxPx = event.clientX - this.lastPointer.x;
    const dyPx = event.clientY - this.lastPointer.y;

    if (!this.movedDuringDrag && Math.hypot(dxPx, dyPx) > DRAG_THRESHOLD_PX) {
      this.movedDuringDrag = true;
      // Pointeur posé sur une sphère ⇒ on la saisit (drag) ; sinon on pane.
      if (this.candidateNodeId) {
        this.draggingId = this.candidateNodeId;
        this.selectNode(this.candidateNodeId);
      }
      this.isPanning.set(true);
    }
    if (!this.movedDuringDrag) return;

    if (this.draggingId) {
      this.dragTarget = this.clientToViewBox(event.clientX, event.clientY);
      this.ensureLoop();
    } else {
      const w = VIEWBOX.w / this.scale();
      const h = VIEWBOX.h / this.scale();
      const { x, y } = this.center();
      this.setCenter(x - (dxPx / this.svgRect.width) * w, y - (dyPx / this.svgRect.height) * h);
    }
    this.lastPointer = { x: event.clientX, y: event.clientY };
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) return;
    const svg = event.currentTarget as SVGSVGElement;
    try {
      svg.releasePointerCapture(event.pointerId);
    } catch {
      /* pointer déjà relâché */
    }
    if (!this.movedDuringDrag && this.candidateNodeId) {
      this.selectNode(this.candidateNodeId);
    }
    if (this.draggingId) {
      // Relâché : les ressorts ramènent tout en place (rebond élastique).
      this.draggingId = null;
      this.ensureLoop();
    }

    this.pointerId = null;
    this.lastPointer = null;
    this.svgRect = null;
    this.candidateNodeId = null;
    this.isPanning.set(false);
  }

  /** Convertit des coordonnées écran en coordonnées du viewBox courant. */
  private clientToViewBox(clientX: number, clientY: number): { x: number; y: number } {
    return toViewBox(clientX, clientY, this.svgRect!, this.scale(), this.center());
  }

  private ensureLoop(): void {
    if (this.isBrowser && this.rafId === null) {
      this.rafId = requestAnimationFrame(this.stepBound);
    }
  }

  /**
   * Applique une itération de la simulation (cf. {@link simStep}) au signal
   * `displaced`, et replanifie une frame tant que le système n'est pas au repos.
   */
  private step(): void {
    const { next, settled } = simStep(
      this.nodes(),
      this.edges(),
      this.displaced(),
      this.draggingId,
      this.dragTarget,
    );
    if (!settled) {
      this.displaced.set(next);
      this.rafId = requestAnimationFrame(this.stepBound);
    } else {
      // Système au repos : on revient exactement aux positions d'origine.
      this.displaced.set(new Map());
      this.rafId = null;
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const factor = event.deltaY < 0 ? 1.18 : 1 / 1.18;
    this.zoomToward(this.scale() * factor, event.clientX, event.clientY, rect);
  }

  protected zoomIn(): void {
    this.zoomCentered(this.scale() * 1.4);
  }

  protected zoomOut(): void {
    this.zoomCentered(this.scale() / 1.4);
  }

  protected resetView(): void {
    this.scale.set(1);
    this.center.set({ x: VIEWBOX.w / 2, y: VIEWBOX.h / 2 });
  }

  private zoomCentered(target: number): void {
    this.scale.set(clampNumber(target, MIN_SCALE, MAX_SCALE));
    const { x, y } = this.center();
    this.setCenter(x, y);
  }

  /** Zoom en gardant fixe le point sous le curseur. */
  private zoomToward(target: number, clientX: number, clientY: number, rect: DOMRect): void {
    const next = zoomTowardTarget(target, clientX, clientY, rect, this.scale(), this.center());
    this.scale.set(next.scale);
    this.center.set(next.center);
  }

  protected openSelectedDetail(): void {
    const item = this.selectedItem();
    if (item) this.itemOpened.emit(item);
  }

  protected onNodeKeydown(event: KeyboardEvent, id: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.selectNode(id);
  }

  protected onLegendKeydown(event: KeyboardEvent, id: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.toggleCategory(id);
  }
}
