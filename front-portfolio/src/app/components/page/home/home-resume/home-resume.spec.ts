import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResume } from './home-resume';

describe('HomeResume', () => {
  let component: HomeResume;
  let fixture: ComponentFixture<HomeResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [HomeResume],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeResume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
