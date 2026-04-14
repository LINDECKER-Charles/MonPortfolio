import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsHeader } from './projects-header';

describe('ProjectsHeader', () => {
  let component: ProjectsHeader;
  let fixture: ComponentFixture<ProjectsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
