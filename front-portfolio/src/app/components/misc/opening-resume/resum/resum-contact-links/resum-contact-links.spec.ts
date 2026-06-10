import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { ResumContactLinks } from './resum-contact-links';
import { RESUM_IMAGES } from '../../../../../img-sources/resum.sources';

describe('ResumContactLinks', () => {
  let component: ResumContactLinks;
  let fixture: ComponentFixture<ResumContactLinks>;
  let toSpy: jasmine.Spy;

  beforeEach(async () => {
    spyOn(gsap, 'context').and.returnValue({ revert: () => {} } as any);
    spyOn(gsap, 'set');
    toSpy = spyOn(gsap, 'to').and.returnValue({ kill: () => {} } as any);
    spyOn(gsap, 'killTweensOf');

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ResumContactLinks],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumContactLinks);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', RESUM_IMAGES);
    fixture.detectChanges();
    toSpy.calls.reset();
  });

  it('renders github / linkedin / mail / cv rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('.contact-row');
    expect(rows.length).toBe(4);
    expect(fixture.nativeElement.querySelector('.contact-row--cv')).toBeTruthy();
  });

  it('all handlers are inert while entry animation is running', () => {
    (component as any).isEntryAnimationComplete = false;
    const evt = { currentTarget: document.createElement('a') } as unknown as Event;
    component.onHoverEnter(evt);
    component.onHoverLeave(evt);
    component.onPress(evt);
    component.onRelease(evt);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('null currentTarget is ignored', () => {
    (component as any).isEntryAnimationComplete = true;
    component.onHoverEnter({ currentTarget: null } as unknown as Event);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('each active handler issues a tween on the row', () => {
    (component as any).isEntryAnimationComplete = true;
    const row = document.createElement('a');
    const evt = { currentTarget: row } as unknown as Event;
    for (const fn of [
      () => component.onHoverEnter(evt),
      () => component.onHoverLeave(evt),
      () => component.onPress(evt),
      () => component.onRelease(evt),
    ]) {
      toSpy.calls.reset();
      fn();
      expect(toSpy.calls.first().args[0]).toBe(row);
    }
  });
});
