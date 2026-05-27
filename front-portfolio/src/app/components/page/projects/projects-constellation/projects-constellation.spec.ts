import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsConstellation } from './projects-constellation';

describe('ProjectsConstellation', () => {
  let component: ProjectsConstellation;
  let fixture: ComponentFixture<ProjectsConstellation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsConstellation],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsConstellation);
    fixture.componentRef.setInput('projects', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
