import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWorkChronicle } from './home-work-chronicle';
import { TranslationService } from '../../../../../services/translation.service';
import { EXPERIENCES, ORGANISM_NAMES } from '../../../works/works.data';
import type { Experience, OrganismKey } from '../../../works/works.types';

const MILESTONE_COUNT = 4;

function api(component: HomeWorkChronicle): any {
  return component as any;
}

function text(root: Element, selector: string): string {
  return root.querySelector(selector)?.textContent?.trim() ?? '';
}

describe('HomeWorkChronicle', () => {
  let component: HomeWorkChronicle;
  let fixture: ComponentFixture<HomeWorkChronicle>;
  let list: HTMLOListElement;
  let items: HTMLLIElement[];

  /** Jalons attendus, dans l'ordre de rendu (ancien → récent). */
  const rendered: readonly Experience[] = EXPERIENCES.slice(0, MILESTONE_COUNT).reverse();

  /** Localise un jalon par le nom de son organisme, sans dépendre de sa position dans la frise. */
  function milestoneOf(organism: OrganismKey): { li: HTMLLIElement; exp: Experience } {
    const name = ORGANISM_NAMES[organism];
    const li = items.find((el) => text(el, '.chronicle__detail').startsWith(name));
    const exp = rendered.find((e) => e.organism === organism);

    expect(li).withContext(`milestone "${organism}" rendered`).toBeDefined();
    expect(exp)
      .withContext(`experience "${organism}" within the ${MILESTONE_COUNT} latest`)
      .toBeDefined();
    return { li: li!, exp: exp! };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: TranslationService, useValue: { translate: (key: string) => key } },
      ],
      imports: [HomeWorkChronicle],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeWorkChronicle);
    component = fixture.componentInstance;
    await fixture.whenStable();

    list = fixture.nativeElement.querySelector('ol.chronicle');
    items = Array.from(fixture.nativeElement.querySelectorAll('li.chronicle__milestone'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps explicit list semantics despite list-style: none', () => {
    expect(list.getAttribute('role')).toBe('list');
    expect(list.getAttribute('aria-label')).toBe('home-work.chronicle.aria');
  });

  it('renders the four latest milestones, oldest first', () => {
    expect(items.length).toBe(MILESTONE_COUNT);

    const years = items.map((li) => text(li, '.chronicle__year'));
    years.forEach((year, i) => expect(year.startsWith(rendered[i].start.slice(0, 4))).toBeTrue());
  });

  it('translates title and kind from the experience id and employment', () => {
    items.forEach((li, i) => {
      const exp = rendered[i];
      expect(text(li, '.chronicle__title')).toBe(`works.xp.${exp.id}.title`);
      expect(text(li, '.chronicle__kind')).toBe(`works.employment.${exp.employment}`);
    });
  });

  it('falls back to the monogram and the remote work mode when the organism has no logo', () => {
    const { li, exp } = milestoneOf('pvzf');

    expect(exp.location).toBe('remote');
    expect(li.querySelector('app-responsive-picture')).toBeNull();
    expect(text(li, '.chronicle__monogram')).toBe('PVZ');
    expect(text(li, '.chronicle__detail')).toContain('works.workMode.remote');
  });

  it('prints the literal address when the location is not a slug', () => {
    const { li, exp } = milestoneOf('missionLocale');

    expect(exp.location).toContain('Altkirch');
    expect(text(li, '.chronicle__detail')).toContain('Altkirch');
    expect(text(li, '.chronicle__detail')).not.toContain('works.workMode.');
  });

  it('renders the organism logo instead of a monogram when one exists', () => {
    const { li } = milestoneOf('devmates');

    expect(li.querySelector('.chronicle__seal app-responsive-picture')).not.toBeNull();
    expect(li.querySelector('.chronicle__monogram')).toBeNull();
  });

  it('marks the last milestone as current when its experience is still running', () => {
    const last = items[items.length - 1];
    const isRunning = EXPERIENCES[0].end === null;

    expect(last.classList.contains('is-current')).toBe(isRunning);
    expect(last.querySelector('.chronicle__now') !== null).toBe(isRunning);
  });

  it('rests on the current milestone with the rail fully lit', () => {
    expect(api(component).activeIndex()).toBe(3);
    expect(list.style.getPropertyValue('--chronicle-fill')).toBe('100%');
    expect(items[3].classList.contains('is-active')).toBeTrue();
  });

  it('follows the hovered milestone and lights the rail up to it', async () => {
    items[1].dispatchEvent(new MouseEvent('mouseenter'));
    await fixture.whenStable();

    expect(api(component).activeIndex()).toBe(1);
    expect(list.style.getPropertyValue('--chronicle-fill')).toBe('33.33%');
    expect(items[1].classList.contains('is-active')).toBeTrue();
    expect(items[3].classList.contains('is-active')).toBeFalse();
  });

  it('follows keyboard focus between milestones', async () => {
    const nodes = items.map((li) => li.querySelector<HTMLAnchorElement>('a.chronicle__node')!);

    nodes[0].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await fixture.whenStable();
    expect(api(component).activeIndex()).toBe(0);

    nodes[0].dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: nodes[2] }));
    nodes[2].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await fixture.whenStable();
    expect(api(component).activeIndex()).toBe(2);

    nodes[2].dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    await fixture.whenStable();
    expect(api(component).activeIndex()).toBe(3);
  });

  it('returns to the current milestone when the pointer leaves the chronicle', async () => {
    items[0].dispatchEvent(new MouseEvent('mouseenter'));
    await fixture.whenStable();
    expect(list.style.getPropertyValue('--chronicle-fill')).toBe('0%');

    list.dispatchEvent(new MouseEvent('mouseleave'));
    await fixture.whenStable();

    expect(api(component).activeIndex()).toBe(3);
    expect(list.style.getPropertyValue('--chronicle-fill')).toBe('100%');
  });

  it('every milestone links to the works page', () => {
    items.forEach((li) => {
      expect(li.querySelector('a.chronicle__node')!.getAttribute('href')).toBe('/works');
    });
  });
});
