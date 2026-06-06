import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProjects } from './home-projects';

describe('HomeProjects', () => {
  let component: HomeProjects;
  let fixture: ComponentFixture<HomeProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [HomeProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
