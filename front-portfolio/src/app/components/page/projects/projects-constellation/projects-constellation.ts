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
import { TranslationService } from '../../../../services/translation.service';
import { ProjectCategory, ProjectItem } from '../projects.state';
import { formatProjectPeriod } from '../projects.utils';
import {
  buildClusters,
  buildEdges,
  buildNodes,
  CATEGORY_GLYPH,
  CATEGORY_ORDER,
  connectedIds,
  ConstellationEdge,
  ConstellationNode,
  STARS,
  UNIVERSE,
  VIEWBOX,
} from './constellation.layout';

interface PositionedEdge {
  edge: ConstellationEdge;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Position dynamique d'une sphère pendant l'effet ressort. */
interface Sim {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Au scale mini, le viewBox couvre tout l'univers d'étoiles (vue galaxie). */
const MIN_SCALE = VIEWBOX.w / UNIVERSE.w;
const MAX_SCALE = 4.5;
/** En dessous de ce scale, on bascule en « vue galaxie » (labels masqués). */
const GALAXY_SCALE = 0.8;
const DRAG_THRESHOLD_PX = 3;

/* Constantes du système de ressorts (par frame ~60 fps). */
const K_ANCHOR = 0.018; // rappel vers la position d'origine
const K_EDGE = 0.05; // tension des liens (propagation)
const DAMP = 0.86; // amortissement
const REST_ENERGY = 1e-4; // seuil d'arrêt de la boucle

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

@Component({
  selector: 'app-projects-constellation',
  imports: [],
  templateUrl: './projects-constellation.html',
  styleUrl: './projects-constellation.css',
})
export class ProjectsConstellation implements OnDestroy {
  protected readonly ts = inject(TranslationService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly projects = input.required<ProjectItem[]>();
  readonly projectOpened = output<ProjectItem>();

  protected readonly viewBox = VIEWBOX;
  protected readonly categoryOrder = CATEGORY_ORDER;
  protected readonly glyph = CATEGORY_GLYPH;
  protected readonly stars = STARS;

  /** Positions « maison » (déterministes, SSR-safe). */
  protected readonly nodes = computed(() => buildNodes(this.projects()));
  protected readonly edges = computed(() => buildEdges(this.projects()));
  protected readonly clusters = computed(() => buildClusters(this.projects()));

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

  protected readonly counts = computed<Record<string, number>>(() => {
    const tally: Record<string, number> = {};
    for (const project of this.projects()) {
      tally[project.category] = (tally[project.category] ?? 0) + 1;
    }
    return tally;
  });

  /** Sélection utilisateur ; null = on retombe sur le projet par défaut visible. */
  private readonly userSelectedId = signal<string | null>(null);
  private readonly activeCategories = signal<Set<ProjectCategory>>(new Set(CATEGORY_ORDER));
  protected readonly query = signal('');

  /** Projet effectivement affiché dans le panneau (sélection ou repli visible). */
  protected readonly selectedProject = computed<ProjectItem | null>(() => {
    const list = this.projects();
    const id = this.userSelectedId();

    if (id) {
      const picked = list.find((project) => project.id === id);
      if (picked && this.isVisible(picked)) return picked;
    }

    return list.find((project) => this.isVisible(project)) ?? null;
  });

  protected readonly selectedId = computed(() => this.selectedProject()?.id ?? null);

  private readonly connected = computed(() => connectedIds(this.selectedId(), this.edges()));

  protected readonly relatedProjects = computed<ProjectItem[]>(() => {
    const ids = this.connected();
    if (!ids.size) return [];
    const byId = new Map(this.projects().map((project) => [project.id, project]));
    return [...ids].map((id) => byId.get(id)).filter((project): project is ProjectItem => !!project);
  });

  protected readonly metaLabel = computed(() => {
    const projectsWord = this.ts.translate('projects.constellation.projects');
    const linksWord = this.ts.translate('projects.constellation.links');
    return `${this.projects().length} ${projectsWord} · ${this.edges().length} ${linksWord}`;
  });

  protected isCategoryActive(category: ProjectCategory): boolean {
    return this.activeCategories().has(category);
  }

  protected isVisible(project: ProjectItem): boolean {
    if (!this.activeCategories().has(project.category)) return false;

    const query = this.query().trim().toLowerCase();
    if (!query) return true;

    return (
      project.title.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.stack.some((item) => item.toLowerCase().includes(query)) ||
      project.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  protected isSelected(node: ConstellationNode): boolean {
    return node.id === this.selectedId();
  }

  protected isDimmed(node: ConstellationNode): boolean {
    if (!this.isVisible(node.project)) return true;

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
    return `var(--cat-${node.project.category})`;
  }

  protected categoryColor(category: ProjectCategory): string {
    return `var(--cat-${category})`;
  }

  protected selectNode(id: string): void {
    this.userSelectedId.set(id);
  }

  protected toggleCategory(category: ProjectCategory): void {
    const next = new Set(this.activeCategories());
    if (next.has(category)) next.delete(category);
    else next.add(category);
    // Au moins une constellation reste visible.
    this.activeCategories.set(next.size ? next : new Set(CATEGORY_ORDER));
  }

  protected onSearch(value: string): void {
    this.query.set(value);
  }

  // ─── Navigation pan / zoom (manipulation du viewBox SVG) ───
  protected readonly scale = signal(1);
  private readonly center = signal({ x: VIEWBOX.w / 2, y: VIEWBOX.h / 2 });
  protected readonly isPanning = signal(false);

  protected readonly viewBoxAttr = computed(() => {
    const w = VIEWBOX.w / this.scale();
    const h = VIEWBOX.h / this.scale();
    const { x, y } = this.center();
    return `${(x - w / 2).toFixed(3)} ${(y - h / 2).toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}`;
  });

  protected readonly canReset = computed(
    () => this.scale() !== 1 || this.center().x !== VIEWBOX.w / 2 || this.center().y !== VIEWBOX.h / 2
  );

  /** Vue galaxie : très dézoomé, on n'affiche plus que les boules lumineuses. */
  protected readonly galaxyMode = computed(() => this.scale() < GALAXY_SCALE);

  /** Accent de la carte latérale : couleur de la constellation sélectionnée. */
  protected readonly panelAccent = computed(() => {
    const project = this.selectedProject();
    return project ? `var(--cat-${project.category})` : 'var(--color-blood)';
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

  /**
   * Borne le centre pour que la fenêtre visible reste dans l'univers d'étoiles.
   * Gère le cas scale < 1 (fenêtre plus large que le contenu) en recentrant.
   */
  private setCenter(x: number, y: number): void {
    const halfW = VIEWBOX.w / this.scale() / 2;
    const halfH = VIEWBOX.h / this.scale() / 2;
    const cx = VIEWBOX.w / 2;
    const cy = VIEWBOX.h / 2;
    const minX = cx - UNIVERSE.w / 2 + halfW;
    const maxX = cx + UNIVERSE.w / 2 - halfW;
    const minY = cy - UNIVERSE.h / 2 + halfH;
    const maxY = cy + UNIVERSE.h / 2 - halfH;
    this.center.set({
      x: minX <= maxX ? clampNumber(x, minX, maxX) : cx,
      y: minY <= maxY ? clampNumber(y, minY, maxY) : cy,
    });
  }

  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const svg = event.currentTarget as SVGSVGElement;
    this.svgRect = svg.getBoundingClientRect();
    this.pointerId = event.pointerId;
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.movedDuringDrag = false;

    const target = event.target as Element | null;
    this.candidateNodeId = target?.closest?.('[data-node-id]')?.getAttribute('data-node-id') ?? null;

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
    const rect = this.svgRect!;
    const w = VIEWBOX.w / this.scale();
    const h = VIEWBOX.h / this.scale();
    const { x, y } = this.center();
    const ratioX = (clientX - rect.left) / rect.width;
    const ratioY = (clientY - rect.top) / rect.height;
    return { x: x - w / 2 + ratioX * w, y: y - h / 2 + ratioY * h };
  }

  private ensureLoop(): void {
    if (this.isBrowser && this.rafId === null) {
      this.rafId = requestAnimationFrame(this.stepBound);
    }
  }

  /**
   * Une itération du système masse-ressort : chaque sphère est rappelée vers sa
   * position d'origine (ancre) et reliée à ses voisines (arêtes). La sphère
   * tirée est épinglée sur le pointeur et entraîne les autres de proche en proche.
   */
  private step(): void {
    const homes = this.nodes();
    const homeById = new Map(homes.map((n) => [n.id, n]));
    const moved = this.displaced();

    // Positions courantes (maison si non déplacée), sphère tirée épinglée.
    const cur = new Map<string, Sim>();
    for (const n of homes) {
      const p = moved.get(n.id);
      cur.set(n.id, p ? { ...p } : { x: n.x, y: n.y, vx: 0, vy: 0 });
    }
    if (this.draggingId) {
      const c = cur.get(this.draggingId);
      if (c) {
        c.x = this.dragTarget.x;
        c.y = this.dragTarget.y;
        c.vx = 0;
        c.vy = 0;
      }
    }

    // Forces : ancrage + tension des liens.
    const force = new Map<string, { x: number; y: number }>();
    for (const id of cur.keys()) force.set(id, { x: 0, y: 0 });

    for (const [id, p] of cur) {
      const home = homeById.get(id)!;
      const f = force.get(id)!;
      f.x += (home.x - p.x) * K_ANCHOR;
      f.y += (home.y - p.y) * K_ANCHOR;
    }

    for (const edge of this.edges()) {
      const a = cur.get(edge.a);
      const b = cur.get(edge.b);
      const ha = homeById.get(edge.a);
      const hb = homeById.get(edge.b);
      if (!a || !b || !ha || !hb) continue;
      const rest = Math.hypot(ha.x - hb.x, ha.y - hb.y);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1e-4;
      const k = ((dist - rest) / dist) * K_EDGE;
      force.get(edge.a)!.x += dx * k;
      force.get(edge.a)!.y += dy * k;
      force.get(edge.b)!.x -= dx * k;
      force.get(edge.b)!.y -= dy * k;
    }

    // Intégration (Euler amorti) ; la sphère tirée reste épinglée.
    let energy = 0;
    const next = new Map<string, Sim>();
    for (const [id, p] of cur) {
      if (id === this.draggingId) {
        next.set(id, { x: p.x, y: p.y, vx: 0, vy: 0 });
        continue;
      }
      const f = force.get(id)!;
      const vx = (p.vx + f.x) * DAMP;
      const vy = (p.vy + f.y) * DAMP;
      energy += vx * vx + vy * vy;
      next.set(id, { x: p.x + vx, y: p.y + vy, vx, vy });
    }

    if (this.draggingId !== null || energy > REST_ENERGY) {
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
    const w = VIEWBOX.w / this.scale();
    const h = VIEWBOX.h / this.scale();
    const { x, y } = this.center();
    const ratioX = (clientX - rect.left) / rect.width;
    const ratioY = (clientY - rect.top) / rect.height;
    const pointerX = x - w / 2 + ratioX * w;
    const pointerY = y - h / 2 + ratioY * h;

    const next = clampNumber(target, MIN_SCALE, MAX_SCALE);
    this.scale.set(next);

    const newW = VIEWBOX.w / next;
    const newH = VIEWBOX.h / next;
    this.setCenter(pointerX - (ratioX - 0.5) * newW, pointerY - (ratioY - 0.5) * newH);
  }


  protected openSelectedDetail(): void {
    const project = this.selectedProject();
    if (project) this.projectOpened.emit(project);
  }

  protected formatPeriod(project: ProjectItem): string {
    return formatProjectPeriod(project, this.ts.lang(), this.ts.translate('projects.today'));
  }

  protected onNodeKeydown(event: KeyboardEvent, id: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.selectNode(id);
  }

  protected onLegendKeydown(event: KeyboardEvent, category: ProjectCategory): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.toggleCategory(category);
  }
}
