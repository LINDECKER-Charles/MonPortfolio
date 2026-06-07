import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { ResumRuneIcons } from './resum-rune-icons';
import { RESUM_IMAGES } from '../../../../../img-sources/resum.sources';

describe('ResumRuneIcons', () => {
  let component: ResumRuneIcons;
  let fixture: ComponentFixture<ResumRuneIcons>;
  let toSpy: jasmine.Spy;

  beforeEach(async () => {
    spyOn(gsap, 'context').and.returnValue({ revert: () => {} } as any);
    spyOn(gsap, 'set');
    toSpy = spyOn(gsap, 'to').and.returnValue({ kill: () => {} } as any);
    spyOn(gsap, 'killTweensOf');

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ResumRuneIcons],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumRuneIcons);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', RESUM_IMAGES);
    fixture.detectChanges();
    toSpy.calls.reset();
  });

  it('renders the four rune buttons', () => {
    expect(fixture.nativeElement.querySelectorAll('.rune').length).toBe(4);
  });

  it('handlers inert while entry animation is running', () => {
    (component as any).isEntryAnimationComplete = false;
    const evt = { currentTarget: document.createElement('button') } as unknown as Event;
    component.onHoverEnter(evt);
    component.onPress(evt);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('null currentTarget is ignored', () => {
    (component as any).isEntryAnimationComplete = true;
    component.onHoverEnter({ currentTarget: null } as unknown as Event);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('each active handler issues a tween on the rune', () => {
    (component as any).isEntryAnimationComplete = true;
    const rune = document.createElement('button');
    const evt = { currentTarget: rune } as unknown as Event;
    for (const fn of [
      () => component.onHoverEnter(evt),
      () => component.onHoverLeave(evt),
      () => component.onPress(evt),
      () => component.onRelease(evt),
    ]) {
      toSpy.calls.reset();
      fn();
      expect(toSpy.calls.first().args[0]).toBe(rune);
    }
  });
});
