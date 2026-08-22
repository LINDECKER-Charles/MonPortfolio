import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PolitiqueConfidentialite } from './politique-confidentialite';
import { LEGAL_PATHS, LEGAL_UPDATED } from '../legal.constants';

describe('PolitiqueConfidentialite', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolitiqueConfidentialite],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('creates and renders without throwing', () => {
    const fixture = TestBed.createComponent(PolitiqueConfidentialite);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the shared update seal', () => {
    const fixture = TestBed.createComponent(PolitiqueConfidentialite);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(LEGAL_UPDATED);
  });

  it('declares a full table of contents (8 sections)', () => {
    const fixture = TestBed.createComponent(PolitiqueConfidentialite);
    const toc = (fixture.componentInstance as unknown as { toc: unknown[] }).toc;
    expect(toc.length).toBe(8);
  });

  it('cross-links point to mentions and cookies', () => {
    const fixture = TestBed.createComponent(PolitiqueConfidentialite);
    const paths = (
      fixture.componentInstance as unknown as { crossLinks: { path: string }[] }
    ).crossLinks.map((c) => c.path);
    expect(paths).toContain(LEGAL_PATHS.mentions);
    expect(paths).toContain(LEGAL_PATHS.cookies);
  });
});
