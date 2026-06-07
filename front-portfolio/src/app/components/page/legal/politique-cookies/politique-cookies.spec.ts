import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PolitiqueCookies } from './politique-cookies';
import { LEGAL_PATHS, LEGAL_UPDATED } from '../legal.constants';

describe('PolitiqueCookies', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolitiqueCookies],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('creates and renders without throwing', () => {
    const fixture = TestBed.createComponent(PolitiqueCookies);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the shared update seal', () => {
    const fixture = TestBed.createComponent(PolitiqueCookies);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(LEGAL_UPDATED);
  });

  it('declares its 4-section table of contents', () => {
    const fixture = TestBed.createComponent(PolitiqueCookies);
    const toc = (fixture.componentInstance as unknown as { toc: unknown[] }).toc;
    expect(toc.length).toBe(4);
  });

  it('cross-links point to mentions and privacy', () => {
    const fixture = TestBed.createComponent(PolitiqueCookies);
    const paths = (
      fixture.componentInstance as unknown as { crossLinks: Array<{ path: string }> }
    ).crossLinks.map((c) => c.path);
    expect(paths).toContain(LEGAL_PATHS.mentions);
    expect(paths).toContain(LEGAL_PATHS.privacy);
  });
});
