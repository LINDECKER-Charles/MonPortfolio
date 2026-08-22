import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsTimeline } from './projects-timeline';
import { PROJECTS_DATA } from '../projects.data';
import type { ProjectItem } from '../projects.types';

function api(component: ProjectsTimeline): any {
  return component as any;
}

describe('ProjectsTimeline', () => {
  let component: ProjectsTimeline;
  let fixture: ComponentFixture<ProjectsTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ProjectsTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsTimeline);
    fixture.componentRef.setInput('projects', PROJECTS_DATA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("trackByProjectId renvoie l'id du projet", () => {
    expect(api(component).trackByProjectId(0, PROJECTS_DATA[0])).toBe(PROJECTS_DATA[0].id);
  });

  it('formatPeriod renvoie une chaîne non vide', () => {
    expect(api(component).formatPeriod(PROJECTS_DATA[0])).toBeTruthy();
  });

  describe('previewImage', () => {
    it('renvoie la première image quand elle existe', () => {
      const withImages = PROJECTS_DATA.find((p) => (p.detail?.images?.length ?? 0) > 0)!;
      expect(api(component).previewImage(withImages)).toBe(withImages.detail!.images![0]);
    });

    it('renvoie null sans images', () => {
      const project: ProjectItem = { ...PROJECTS_DATA[0], detail: { images: [] } };
      expect(api(component).previewImage(project)).toBeNull();
    });

    it('renvoie null sans detail', () => {
      const project: ProjectItem = { ...PROJECTS_DATA[0], detail: undefined };
      expect(api(component).previewImage(project)).toBeNull();
    });
  });

  describe('previewCount', () => {
    it('compte les images', () => {
      const withImages = PROJECTS_DATA.find((p) => (p.detail?.images?.length ?? 0) > 0)!;
      expect(api(component).previewCount(withImages)).toBe(withImages.detail!.images!.length);
    });

    it('renvoie 0 sans detail', () => {
      const project: ProjectItem = { ...PROJECTS_DATA[0], detail: undefined };
      expect(api(component).previewCount(project)).toBe(0);
    });
  });

  it('projectSelected émet le projet', () => {
    const spy = spyOn(component.projectSelected, 'emit');
    component.projectSelected.emit(PROJECTS_DATA[0]);
    expect(spy).toHaveBeenCalledWith(PROJECTS_DATA[0]);
  });
});
