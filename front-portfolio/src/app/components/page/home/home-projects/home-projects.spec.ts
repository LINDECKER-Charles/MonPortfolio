import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProjects } from './home-projects';

describe('HomeProjects', () => {
  let component: HomeProjects;
  let fixture: ComponentFixture<HomeProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [HomeProjects],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lays the lantern light as first child of the altar', () => {
    const section: HTMLElement = fixture.nativeElement.querySelector('section.home-projects');

    expect(section.firstElementChild?.classList).toContain('lantern-light');
    expect(section.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('embeds the reliquary row below the intro and actions', () => {
    const relics = fixture.nativeElement.querySelector('app-home-projects-relics');

    expect(relics).toBeTruthy();
    expect(relics.querySelectorAll('a.relic').length).toBe(4);
  });
});
