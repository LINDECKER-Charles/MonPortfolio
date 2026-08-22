import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWork } from './home-work';

describe('HomeWork', () => {
  let component: HomeWork;
  let fixture: ComponentFixture<HomeWork>;
  let section: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [HomeWork],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeWork);
    component = fixture.componentInstance;
    await fixture.whenStable();

    section = fixture.nativeElement.querySelector('section.home-work');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lays the lantern light as first child of the altar', () => {
    expect(section.firstElementChild?.classList).toContain('lantern-light');
    expect(section.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('orders the DOM as intro, actions then chronicle (reading and focus order)', () => {
    const zones = Array.from(section.children)
      .filter((el) => !el.classList.contains('lantern-light'))
      .map((el) => Array.from(el.classList).find((c) => c.startsWith('home-work__')));

    expect(zones).toEqual(['home-work__intro', 'home-work__actions', 'home-work__chronicle']);
  });

  it('tabs through the two CTAs before reaching the chronicle links', () => {
    const links = Array.from(section.querySelectorAll<HTMLAnchorElement>('a[href]'));
    const actionLinks = links.filter((a) => a.closest('.home-work__actions'));
    const firstChronicleLink = links.findIndex((a) => a.closest('app-home-work-chronicle'));

    expect(actionLinks.length).toBe(2);
    expect(firstChronicleLink).toBe(actionLinks.length);
  });

  it('embeds the chronicle below the intro and actions', () => {
    const chronicle = section.querySelector('app-home-work-chronicle');

    expect(chronicle).toBeTruthy();
    expect(chronicle!.querySelectorAll('a.chronicle__node').length).toBe(4);
  });
});
