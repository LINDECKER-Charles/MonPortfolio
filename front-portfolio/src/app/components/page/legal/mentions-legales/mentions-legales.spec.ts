import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MentionsLegales } from './mentions-legales';
import { LEGAL_PATHS, LEGAL_UPDATED } from '../legal.constants';

describe('MentionsLegales', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionsLegales],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('creates and renders without throwing', () => {
    const fixture = TestBed.createComponent(MentionsLegales);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('exposes the shared update date and renders the seal', () => {
    const fixture = TestBed.createComponent(MentionsLegales);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(LEGAL_UPDATED);
  });

  it('declares a full table of contents (8 sections)', () => {
    const fixture = TestBed.createComponent(MentionsLegales);
    const toc = (fixture.componentInstance as unknown as { toc: unknown[] }).toc;
    expect(toc.length).toBe(8);
  });

  it('cross-links point to the sibling legal pages', () => {
    const fixture = TestBed.createComponent(MentionsLegales);
    const crossLinks = (
      fixture.componentInstance as unknown as { crossLinks: Array<{ path: string }> }
    ).crossLinks;
    const paths = crossLinks.map((c) => c.path);
    expect(paths).toContain(LEGAL_PATHS.privacy);
    expect(paths).toContain(LEGAL_PATHS.cookies);
  });
});
