import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsTimeline } from './projects-timeline';

describe('ProjectsTimeline', () => {
  let component: ProjectsTimeline;
  let fixture: ComponentFixture<ProjectsTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
