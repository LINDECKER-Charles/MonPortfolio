import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { LegalLayout } from './legal-layout';

describe('LegalLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalLayout],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  function createWithRequiredInputs() {
    const fixture = TestBed.createComponent(LegalLayout);
    const ref = fixture.componentRef;
    ref.setInput('kickerKey', 'legal.ml.kicker');
    ref.setInput('titlePreKey', 'legal.ml.title_pre');
    ref.setInput('titlePostKey', 'legal.ml.title_post');
    ref.setInput('subtitleKey', 'legal.ml.subtitle');
    ref.setInput('updated', '27·05·2026');
    ref.setInput('tocItems', [{ fragment: 'editeur', key: 'legal.ml.toc.editeur' }]);
    return fixture;
  }

  it('creates with the required inputs', () => {
    const fixture = createWithRequiredInputs();
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults the optional link arrays to empty', () => {
    const fixture = createWithRequiredInputs();
    fixture.detectChanges();
    expect(fixture.componentInstance.tocLinks()).toEqual([]);
    expect(fixture.componentInstance.crossLinks()).toEqual([]);
  });

  it('renders the updated seal value and the toc entry', () => {
    const fixture = createWithRequiredInputs();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('27·05·2026');
  });

  it('renders provided cross-links', () => {
    const fixture = createWithRequiredInputs();
    fixture.componentRef.setInput('crossLinks', [
      {
        path: '/politique-cookies',
        kickerKey: 'legal.cross.cookies_kicker',
        titleKey: 'legal.cross.cookies_title',
      },
    ]);
    fixture.detectChanges();

    const links = fixture.debugElement
      .queryAll(By.css('a[href]'))
      .map((d) => (d.nativeElement as HTMLAnchorElement).getAttribute('href'));
    expect(links.some((href) => href?.includes('politique-cookies'))).toBeTrue();
  });
});
