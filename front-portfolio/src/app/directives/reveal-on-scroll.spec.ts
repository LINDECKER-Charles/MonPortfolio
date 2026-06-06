import { ElementRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RevealOnScrollDirective } from './reveal-on-scroll';

describe('RevealOnScrollDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), 
        RevealOnScrollDirective,
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
      ],
    });
  });

  it('should create an instance', () => {
    expect(TestBed.inject(RevealOnScrollDirective)).toBeTruthy();
  });
});
