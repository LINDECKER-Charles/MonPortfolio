import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsFilter } from './projects-filter';

describe('ProjectsFilter', () => {
  let component: ProjectsFilter;
  let fixture: ComponentFixture<ProjectsFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
