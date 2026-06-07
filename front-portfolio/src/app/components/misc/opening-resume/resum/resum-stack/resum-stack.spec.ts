import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { ResumStack } from './resum-stack';
import { RESUM_IMAGES } from '../../../../../img-sources/resum.sources';

describe('ResumStack', () => {
  let component: ResumStack;
  let fixture: ComponentFixture<ResumStack>;
  let toSpy: jasmine.Spy;

  beforeEach(async () => {
    spyOn(gsap, 'context').and.returnValue({ revert: () => {} } as any);
    spyOn(gsap, 'set');
    toSpy = spyOn(gsap, 'to').and.returnValue({ kill: () => {} } as any);
    spyOn(gsap, 'killTweensOf');

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ResumStack],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumStack);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', RESUM_IMAGES);
    fixture.detectChanges();
    toSpy.calls.reset();
  });

  it('renders the six stack rows', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.row').length).toBe(6);
  });

  it('row hover is inert while entry animation is running', () => {
    (component as any).isEntryAnimationComplete = false;
    component.onRowHoverEnter({ currentTarget: document.createElement('div') } as unknown as Event);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('null currentTarget is ignored', () => {
    (component as any).isEntryAnimationComplete = true;
    component.onRowHoverEnter({ currentTarget: null } as unknown as Event);
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
