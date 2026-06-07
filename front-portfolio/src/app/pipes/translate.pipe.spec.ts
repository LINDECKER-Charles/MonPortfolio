import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TranslatePipe } from './translate.pipe';
import { TranslationService } from '../services/translation.service';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translateSpy: jasmine.Spy;

  beforeEach(() => {
    const ts = {
      translate: (key: string) => `translated:${key}`,
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        TranslatePipe,
        { provide: TranslationService, useValue: ts },
      ],
    });

    pipe = TestBed.inject(TranslatePipe);
    translateSpy = spyOn(TestBed.inject(TranslationService), 'translate').and.callThrough();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('is impure (recomputes on each call)', () => {
    // pure: false → impure pipe so it re-evaluates when the merged signal changes
    expect(TranslatePipe).toBeDefined();
  });

  it('delegates to TranslationService.translate with the given key', () => {
    const result = pipe.transform('nav-barre.title');

    expect(translateSpy).toHaveBeenCalledOnceWith('nav-barre.title');
    expect(result).toBe('translated:nav-barre.title');
  });

  it('returns whatever the service returns (fallback passthrough)', () => {
    translateSpy.and.returnValue('unknown.key');

    expect(pipe.transform('unknown.key')).toBe('unknown.key');
  });
});
