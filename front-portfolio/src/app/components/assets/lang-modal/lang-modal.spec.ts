import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangModal } from './lang-modal';
import { TranslationService } from '../../../services/translation.service';

describe('LangModal', () => {
  let component: LangModal;
  let fixture: ComponentFixture<LangModal>;
  let ts: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [LangModal],
    }).compileComponents();

    fixture = TestBed.createComponent(LangModal);
    component = fixture.componentInstance;
    ts = TestBed.inject(TranslationService);
    fixture.detectChanges();
  });

  const api = () =>
    component as unknown as {
      isClosing: boolean;
      onEscape: () => void;
      requestClose: () => void;
      select: (code: string) => void;
    };

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('locks then restores body scroll across the lifecycle', () => {
    expect(document.body.style.overflow).toBe('hidden');
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });

  // App zoneless : pas de fakeAsync/tick — on pilote les timers via jasmine.clock().
  describe('close sequence (timers)', () => {
    beforeEach(() => jasmine.clock().install());
    afterEach(() => jasmine.clock().uninstall());

    it('requestClose marks closing and emits close after the animation delay', () => {
      const spy = jasmine.createSpy('close');
      component.closed.subscribe(spy);

      api().requestClose();
      expect(api().isClosing).toBeTrue();
      expect(spy).not.toHaveBeenCalled();

      jasmine.clock().tick(200);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('requestClose is idempotent while already closing', () => {
      const spy = jasmine.createSpy('close');
      component.closed.subscribe(spy);

      api().requestClose();
      api().requestClose(); // ignored
      jasmine.clock().tick(200);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('escape triggers the close sequence', () => {
      const spy = jasmine.createSpy('close');
      component.closed.subscribe(spy);
      api().onEscape();
      jasmine.clock().tick(200);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('select delegates to TranslationService.setLang then closes', () => {
      const setLang = spyOn(ts, 'setLang');
      const spy = jasmine.createSpy('close');
      component.closed.subscribe(spy);

      api().select('en');
      expect(setLang).toHaveBeenCalledWith('en');
      expect(api().isClosing).toBeTrue();
      jasmine.clock().tick(200);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('exposes the available languages list', () => {
    expect((component as unknown as { languages: unknown[] }).languages.length).toBeGreaterThan(10);
  });
});
