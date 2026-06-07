import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningResume } from './opening-resume';

describe('OpeningResume', () => {
  let component: OpeningResume;
  let fixture: ComponentFixture<OpeningResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [OpeningResume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningResume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides the resume until the opening finishes', () => {
    expect(component.showResume).toBeFalse();
    component.onOpeningFinished();
    expect(component.showResume).toBeTrue();
  });
});
