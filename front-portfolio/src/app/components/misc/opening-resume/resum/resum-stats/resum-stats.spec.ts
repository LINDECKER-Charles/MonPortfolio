import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { ResumStats } from './resum-stats';
import { RESUM_IMAGES } from '../../../../../img-sources/resum.sources';

describe('ResumStats', () => {
  let component: ResumStats;
  let fixture: ComponentFixture<ResumStats>;
  let toSpy: jasmine.Spy;

  beforeEach(async () => {
    spyOn(gsap, 'context').and.returnValue({ revert: () => {} } as any);
    spyOn(gsap, 'set');
    toSpy = spyOn(gsap, 'to').and.returnValue({ kill: () => {} } as any);
    spyOn(gsap, 'killTweensOf');

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ResumStats],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumStats);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', RESUM_IMAGES);
    fixture.detectChanges();
    toSpy.calls.reset();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('row hover is inert while entry animation is running', () => {
    (component as any).isEntryAnimationComplete = false;
    component.onRowHoverEnter({ currentTarget: document.createElement('div') } as unknown as Event);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('null currentTarget is ignored', () => {
    (component as any).isEntryAnimationComplete = true;
    component.onRowHoverLeave({ currentTarget: null } as unknown as Event);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('row hover in/out tweens the row when active', () => {
    (component as any).isEntryAnimationComplete = true;
    const row = document.createElement('div');
    component.onRowHoverEnter({ currentTarget: row } as unknown as Event);
    expect(toSpy.calls.first().args[0]).toBe(row);
    toSpy.calls.reset();
    component.onRowHoverLeave({ currentTarget: row } as unknown as Event);
    expect(toSpy.calls.first().args[0]).toBe(row);
  });
});
