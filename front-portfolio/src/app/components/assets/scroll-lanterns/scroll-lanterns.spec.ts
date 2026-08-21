import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ScrollLanterns } from './scroll-lanterns';
import { TranslationService } from '../../../services/translation.service';

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

/** IntersectionObserver factice capturable pour piloter les callbacks à la main. */
class FakeIO {
  static last: FakeIO | null = null;
  observed: Element[] = [];
  disconnected = false;
  constructor(public cb: IOCallback) {
    FakeIO.last = this;
  }
  observe(el: Element): void {
    this.observed.push(el);
  }
  disconnect(): void {
    this.disconnected = true;
  }
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  emit(entries: Partial<IntersectionObserverEntry>[]): void {
    this.cb(entries);
  }
}

interface Internals {
  activeIndex(): number;
  hasTargets(): boolean;
  scrollTo(e: MouseEvent, sel: string): void;
}

/** App zoneless → pas de fakeAsync ; on laisse filer microtask + setTimeout(0). */
const flushTimers = () => new Promise<void>((r) => setTimeout(r, 5));

describe('ScrollLanterns', () => {
  let fixture: ComponentFixture<ScrollLanterns>;
  let component: ScrollLanterns;
  let api: Internals;
  let events: Subject<NavigationEnd>;
  let originalIO: typeof IntersectionObserver;

  const sections: HTMLElement[] = [];

  function addSections(...ids: string[]): void {
    for (const id of ids) {
      const el = document.createElement('section');
      el.id = id;
      document.body.appendChild(el);
      sections.push(el);
    }
  }

  beforeEach(async () => {
    events = new Subject();
    FakeIO.last = null;
    originalIO = window.IntersectionObserver;
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIO;

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: { events } },
        { provide: TranslationService, useValue: { translate: (k: string) => k } },
      ],
      imports: [ScrollLanterns],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollLanterns);
    component = fixture.componentInstance;
    api = component as unknown as Internals;
  });

  afterEach(() => {
    (
      window as unknown as { IntersectionObserver: typeof IntersectionObserver }
    ).IntersectionObserver = originalIO;
    fixture.destroy();
    sections.splice(0).forEach((el) => el.remove());
  });

  it('stays hidden when no target sections are present', async () => {
    fixture.detectChanges(); // ngAfterViewInit
    await flushTimers(); // queueMicrotask
    expect(api.hasTargets()).toBeFalse();
    expect(FakeIO.last).toBeNull();
  });

  it('observes present sections and shows the lanterns', async () => {
    addSections('hero', 'projects', 'work');
    fixture.detectChanges();
    await flushTimers();
    expect(api.hasTargets()).toBeTrue();
    expect(FakeIO.last).not.toBeNull();
    expect(FakeIO.last!.observed.length).toBe(3);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.scroll-lanterns__lantern').length).toBe(3);
  });

  it('observes only the sections that exist', async () => {
    addSections('hero', 'work'); // no #projects
    fixture.detectChanges();
    await flushTimers();
    expect(FakeIO.last!.observed.length).toBe(2);
  });

  it('lights the topmost intersecting section', async () => {
    addSections('hero', 'projects', 'work');
    fixture.detectChanges();
    await flushTimers();

    // projects has the highest top among intersecting → it becomes active (idx 1)
    FakeIO.last!.emit([
      {
        target: sections[2],
        isIntersecting: true,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
      {
        target: sections[1],
        isIntersecting: true,
        boundingClientRect: { top: 80 } as DOMRectReadOnly,
      },
    ]);
    expect(api.activeIndex()).toBe(1);
  });

  it('ignores callbacks with no intersecting entries', async () => {
    addSections('hero', 'projects', 'work');
    fixture.detectChanges();
    await flushTimers();

    FakeIO.last!.emit([
      { target: sections[0], isIntersecting: false } as Partial<IntersectionObserverEntry>,
    ]);
    expect(api.activeIndex()).toBe(0);
  });

  it('re-observes on navigation end', async () => {
    addSections('hero');
    fixture.detectChanges();
    await flushTimers();
    const first = FakeIO.last!;

    events.next(new NavigationEnd(1, '/x', '/x'));
    await flushTimers(); // setTimeout(0) reattaches the observer

    expect(first.disconnected).toBeTrue();
    expect(FakeIO.last).not.toBe(first);
  });

  it('smooth-scrolls to the target on click', async () => {
    addSections('hero');
    fixture.detectChanges();
    await flushTimers();
    const scrollSpy = spyOn(sections[0], 'scrollIntoView');
    const prevent = jasmine.createSpy('preventDefault');

    api.scrollTo({ preventDefault: prevent } as unknown as MouseEvent, '#hero');
    expect(prevent).toHaveBeenCalled();
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('no-ops scrollTo when the target is missing', async () => {
    fixture.detectChanges();
    await flushTimers();
    const prevent = jasmine.createSpy('preventDefault');
    api.scrollTo({ preventDefault: prevent } as unknown as MouseEvent, '#nope');
    expect(prevent).toHaveBeenCalled(); // still prevents the native jump
  });

  it('disconnects the observer and unsubscribes on destroy', async () => {
    addSections('hero');
    fixture.detectChanges();
    await flushTimers();
    const io = FakeIO.last!;
    expect(events.observed).toBeTrue();

    fixture.destroy();
    expect(io.disconnected).toBeTrue();
    expect(events.observed).toBeFalse();
  });
});
