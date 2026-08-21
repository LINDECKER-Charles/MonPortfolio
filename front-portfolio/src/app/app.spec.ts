import { Component, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MetaService } from './services/meta-service';

interface FooterAccess {
  showFooter: () => boolean;
}

@Component({ selector: 'app-stub', template: 'stub' })
class StubComponent {}

describe('App', () => {
  let metaSpy: jasmine.SpyObj<MetaService>;

  beforeEach(async () => {
    metaSpy = jasmine.createSpyObj<MetaService>('MetaService', [
      'updateDescription',
      'updateCanonical',
      'updateRobots',
      'updateOgTitle',
      'updateOgDescription',
      'updateOgImage',
      'updateOgUrl',
      'updateOgType',
      'updateTwitterTitle',
      'updateTwitterDescription',
      'updateTwitterCard',
      'updateTwitterImage',
      'updateStructuredData',
    ]);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: '', component: StubComponent, data: { showFooter: true, description: 'home' } },
          {
            path: 'hidden',
            component: StubComponent,
            data: { showFooter: false, description: 'hidden', canonical: 'c' },
          },
          { path: 'no-flag', component: StubComponent, data: { description: 'no-flag' } },
        ]),
        { provide: MetaService, useValue: metaSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults showFooter to true before any navigation', () => {
    const fixture = TestBed.createComponent(App);
    const showFooter = (fixture.componentInstance as unknown as FooterAccess).showFooter;
    expect(showFooter()).toBeTrue();
  });

  it('keeps footer visible on a route with showFooter:true', async () => {
    const appFixture = TestBed.createComponent(App);
    appFixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    appFixture.detectChanges();
    const showFooter = (appFixture.componentInstance as unknown as FooterAccess).showFooter;
    expect(showFooter()).toBeTrue();
  });

  it('hides footer on a route with showFooter:false', async () => {
    const appFixture = TestBed.createComponent(App);
    appFixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/hidden');
    appFixture.detectChanges();
    const showFooter = (appFixture.componentInstance as unknown as FooterAccess).showFooter;
    expect(showFooter()).toBeFalse();
  });

  it('falls back to footer visible when route data omits showFooter', async () => {
    const appFixture = TestBed.createComponent(App);
    appFixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/no-flag');
    appFixture.detectChanges();
    const showFooter = (appFixture.componentInstance as unknown as FooterAccess).showFooter;
    expect(showFooter()).toBeTrue();
  });

  it('pushes route meta data through MetaService on navigation (ngOnInit pipeline)', async () => {
    const appFixture = TestBed.createComponent(App);
    appFixture.componentInstance.ngOnInit();
    appFixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/hidden');
    appFixture.detectChanges();
    expect(metaSpy.updateDescription).toHaveBeenCalledWith('hidden');
    expect(metaSpy.updateCanonical).toHaveBeenCalledWith('c');
    expect(metaSpy.updateStructuredData).toHaveBeenCalled();
  });
});
