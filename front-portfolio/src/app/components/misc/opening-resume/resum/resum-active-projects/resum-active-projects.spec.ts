import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { ResumActiveProjects } from './resum-active-projects';
import { RESUM_IMAGES } from '../../../../../img-sources/resum.sources';

describe('ResumActiveProjects', () => {
  let component: ResumActiveProjects;
  let fixture: ComponentFixture<ResumActiveProjects>;
  let toSpy: jasmine.Spy;

  beforeEach(async () => {
    spyOn(gsap, 'context').and.returnValue({ revert: () => {} } as any);
    spyOn(gsap, 'set');
    toSpy = spyOn(gsap, 'to').and.returnValue({ kill: () => {} } as any);
    spyOn(gsap, 'killTweensOf');

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ResumActiveProjects],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumActiveProjects);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', RESUM_IMAGES);
    fixture.detectChanges();
    toSpy.calls.reset();
  });

  it('renders the four project items', () => {
    expect(fixture.nativeElement.querySelectorAll('.project-item').length).toBe(4);
  });

  it('handlers inert while entry animation is running', () => {
    (component as any).isEntryAnimationComplete = false;
    const evt = { currentTarget: document.createElement('a') } as unknown as Event;
    component.onProjectHoverEnter(evt);
    component.onProjectPress(evt);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('null currentTarget is ignored', () => {
    (component as any).isEntryAnimationComplete = true;
    component.onProjectHoverLeave({ currentTarget: null } as unknown as Event);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('each active handler issues a tween on the link', () => {
    (component as any).isEntryAnimationComplete = true;
    const link = document.createElement('a');
    const evt = { currentTarget: link } as unknown as Event;
    for (const fn of [
      () => component.onProjectHoverEnter(evt),
      () => component.onProjectHoverLeave(evt),
      () => component.onProjectPress(evt),
      () => component.onProjectRelease(evt),
    ]) {
      toSpy.calls.reset();
      fn();
      expect(toSpy.calls.first().args[0]).toBe(link);
    }
  });
});
