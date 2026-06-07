import { Component, EventEmitter, Output, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { OpeningHome } from './opening-home';

/** Stub léger : même sélecteur que le vrai Opening, expose l'output `finished`. */
@Component({ selector: 'app-opening', template: '' })
class OpeningStub {
  @Output() finished = new EventEmitter<void>();
}

describe('OpeningHome', () => {
  let component: OpeningHome;
  let fixture: ComponentFixture<OpeningHome>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [OpeningHome],
    })
      // Remplace le vrai Opening (GSAP/audio/cinematique) par un stub.
      .overrideComponent(OpeningHome, { set: { imports: [OpeningStub] } })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(OpeningHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates and embeds the opening sequence', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-opening')).toBeTruthy();
  });

  it('navigates home when goHome is invoked', () => {
    const nav = spyOn(router, 'navigateByUrl').and.resolveTo(true);
    (component as any).goHome();
    expect(nav).toHaveBeenCalledWith('/');
  });

  it('the child finished output drives navigation', () => {
    const nav = spyOn(router, 'navigateByUrl').and.resolveTo(true);
    const stub = fixture.debugElement.children[0].componentInstance as OpeningStub;
    stub.finished.emit();
    expect(nav).toHaveBeenCalledWith('/');
  });
});
