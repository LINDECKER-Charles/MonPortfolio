import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResumeHeader } from './home-resume-header';

describe('HomeResumeHeader', () => {
  let component: HomeResumeHeader;
  let fixture: ComponentFixture<HomeResumeHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [HomeResumeHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeResumeHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
