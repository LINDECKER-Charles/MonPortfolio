import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Opening } from './opening';

describe('Opening', () => {
  let component: Opening;
  let fixture: ComponentFixture<Opening>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Opening]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Opening);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
