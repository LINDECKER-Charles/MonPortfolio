import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsModal } from './projects-modal';
import { PROJECTS_DATA } from '../projects.state';

describe('ProjectsModal', () => {
  let component: ProjectsModal;
  let fixture: ComponentFixture<ProjectsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ProjectsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsModal);
    fixture.componentRef.setInput('project', PROJECTS_DATA[0]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
