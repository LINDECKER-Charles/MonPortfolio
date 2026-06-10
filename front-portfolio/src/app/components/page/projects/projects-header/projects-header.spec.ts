import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsHeader } from './projects-header';

describe('ProjectsHeader', () => {
  let component: ProjectsHeader;
  let fixture: ComponentFixture<ProjectsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [ProjectsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
