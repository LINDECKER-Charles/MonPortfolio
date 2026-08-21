import { Component, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { MetaService } from './services/meta-service';

interface AppAccess {
  showFooter: () => boolean;
  langModalOpen: { (): boolean; set(value: boolean): void };
}

@Component({ selector: 'app-stub', template: 'stub' })
class StubComponent {}

describe('App', () => {
  let metaSpy: jasmine.SpyObj<MetaService>;

  beforeEach(async () => {
    metaSpy = jasmine.createSpyObj<MetaService>('MetaService', ['applyRouteMeta']);

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

  const access = (component: App): AppAccess => component as unknown as AppAccess;

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults showFooter to true before any navigation', () => {
    const fixture = TestBed.createComponent(App);
    expect(access(fixture.componentInstance).showFooter()).toBeTrue();
  });

  it('keeps footer visible on a route with showFooter:true', async () => {
    const appFixture = TestBed.createComponent(App);
    appFixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    appFixture.detectChanges();
    expect(access(appFixture.componentInstance).showFooter()).toBeTrue();
  });

  it('hides footer on a route with showFooter:false', async () => {
    const appFixture = TestBed.createComponent(App);
    appFixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/hidden');
    appFixture.detectChanges();
    expect(access(appFixture.componentInstance).showFooter()).toBeFalse();
  });

  it('falls back to footer visible when route data omits showFooter', async () => {
    const appFixture = TestBed.createComponent(App);
    appFixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/no-flag');
    appFixture.detectChanges();
    expect(access(appFixture.componentInstance).showFooter()).toBeTrue();
  });

  it('applies the deepest route data through MetaService on navigation (flux partagé)', async () => {
    const appFixture = TestBed.createComponent(App);
    appFixture.detectChanges(); // déclenche ngOnInit (abonnement métas sur le flux partagé)
    await TestBed.inject(Router).navigateByUrl('/hidden');
    appFixture.detectChanges();
    expect(metaSpy.applyRouteMeta).toHaveBeenCalledWith(
      jasmine.objectContaining({ description: 'hidden', canonical: 'c' }),
    );
  });

  describe('language modal (état local au shell)', () => {
    it('is closed by default', () => {
      const appFixture = TestBed.createComponent(App);
      appFixture.detectChanges();
      expect(access(appFixture.componentInstance).langModalOpen()).toBeFalse();
      expect((appFixture.nativeElement as HTMLElement).querySelector('app-lang-modal')).toBeNull();
    });

    it('opens when the nav barre requests it', () => {
      const appFixture = TestBed.createComponent(App);
      appFixture.detectChanges();

      const langButton = (appFixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
        '.nav-barre__icon-btn--lang',
      );
      expect(langButton).not.toBeNull();
      langButton!.click();
      appFixture.detectChanges();

      expect(access(appFixture.componentInstance).langModalOpen()).toBeTrue();
      expect(
        (appFixture.nativeElement as HTMLElement).querySelector('app-lang-modal'),
      ).not.toBeNull();
    });

    it('closes on the modal closed output', () => {
      const appFixture = TestBed.createComponent(App);
      access(appFixture.componentInstance).langModalOpen.set(true);
      appFixture.detectChanges();

      appFixture.debugElement.query(By.css('app-lang-modal')).triggerEventHandler('closed');
      appFixture.detectChanges();

      expect(access(appFixture.componentInstance).langModalOpen()).toBeFalse();
      expect((appFixture.nativeElement as HTMLElement).querySelector('app-lang-modal')).toBeNull();
    });
  });
});
