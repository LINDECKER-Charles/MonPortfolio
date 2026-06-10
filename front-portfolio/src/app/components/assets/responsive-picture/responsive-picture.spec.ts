import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsivePicture } from './responsive-picture';

describe('ResponsivePicture', () => {
  let component: ResponsivePicture;
  let fixture: ComponentFixture<ResponsivePicture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ResponsivePicture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsivePicture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
