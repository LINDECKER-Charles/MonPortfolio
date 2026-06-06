import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsFilter } from './projects-filter';
import { PROJECT_FILTERS, ProjectFiltersState } from '../projects.state';

describe('ProjectsFilter', () => {
  let component: ProjectsFilter;
  let fixture: ComponentFixture<ProjectsFilter>;

  const filtersState: ProjectFiltersState = { category: 'all', tags: [], stack: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ProjectsFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsFilter);
    fixture.componentRef.setInput('filters', PROJECT_FILTERS);
    fixture.componentRef.setInput('filtersState', filtersState);
    fixture.componentRef.setInput('availableTags', []);
    fixture.componentRef.setInput('availableStack', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
