import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { ResumHeader } from './resum-header';
import { RESUM_IMAGES } from '../../../../../img-sources/resum.sources';

describe('ResumHeader', () => {
  let component: ResumHeader;
  let fixture: ComponentFixture<ResumHeader>;
  let toSpy: jasmine.Spy;

  beforeEach(async () => {
    // Neutralise l'animation d'entrée GSAP (context) pour des tests déterministes,
    // et observe les délégations via gsap.to (les anims sont des modules ESM non-spyables).
    spyOn(gsap, 'context').and.returnValue({ revert: () => {} } as any);
    spyOn(gsap, 'set');
    toSpy = spyOn(gsap, 'to').and.returnValue({ kill: () => {} } as any);
    spyOn(gsap, 'killTweensOf');

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ResumHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', RESUM_IMAGES);
    fixture.detectChanges();
    toSpy.calls.reset();
  });

  it('creates and renders the github title link', () => {
    expect(component).toBeTruthy();
    const link = fixture.nativeElement.querySelector('.title-link') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toContain('github.com/LINDECKER-Charles');
  });

  describe('guards', () => {
    it('early-returns when entry animation not complete', () => {
      (component as any).isEntryAnimationComplete = false;
      const evt = { currentTarget: document.createElement('div') } as unknown as Event;
      component.onRowHoverEnter(evt);
      component.onTitleHoverEnter(evt);
      component.onTitlePress(evt);
      expect(toSpy).not.toHaveBeenCalled();
    });

    it('early-returns when currentTarget is null', () => {
      (component as any).isEntryAnimationComplete = true;
      const evt = { currentTarget: null } as unknown as Event;
      component.onRowHoverEnter(evt);
      component.onTitleHoverEnter(evt);
      expect(toSpy).not.toHaveBeenCalled();
    });
  });

  describe('active handlers delegate to gsap animations', () => {
    beforeEach(() => ((component as any).isEntryAnimationComplete = true));

    it('row hover in/out triggers row tweens', () => {
      const row = document.createElement('div');
      component.onRowHoverEnter({ currentTarget: row } as unknown as Event);
      expect(toSpy).toHaveBeenCalled();
      expect(toSpy.calls.first().args[0]).toBe(row);
      toSpy.calls.reset();
      component.onRowHoverLeave({ currentTarget: row } as unknown as Event);
      expect(toSpy.calls.first().args[0]).toBe(row);
    });

    it('title hover/press/release each issue a tween on the link', () => {
      const link = document.createElement('a');
      const evt = { currentTarget: link } as unknown as Event;
      for (const fn of [
        () => component.onTitleHoverEnter(evt),
        () => component.onTitleHoverLeave(evt),
        () => component.onTitlePress(evt),
        () => component.onTitleRelease(evt),
      ]) {
        toSpy.calls.reset();
        fn();
        expect(toSpy).toHaveBeenCalledTimes(1);
        expect(toSpy.calls.first().args[0]).toBe(link);
      }
    });
  });
});
