import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLightbox } from './image-lightbox';

describe('ImageLightbox', () => {
  let component: ImageLightbox;
  let fixture: ComponentFixture<ImageLightbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ImageLightbox],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageLightbox);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sources', [
      { srcset: 'a.webp', type: 'image/webp' },
    ]);
    fixture.componentRef.setInput('fallbackSrc', 'a.jpg');
    fixture.componentRef.setInput('alt', 'photo');
  });

  const api = () => component as unknown as {
    canNavigate: boolean;
    onEscape: () => void;
    onArrowLeft: () => void;
    onArrowRight: () => void;
  };

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create with required inputs', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('locks body scroll on init and restores the previous value on destroy', () => {
    document.body.style.overflow = 'scroll';
    fixture.detectChanges(); // ngOnInit
    expect(document.body.style.overflow).toBe('hidden');
    fixture.destroy();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('emits close on escape', () => {
    fixture.detectChanges();
    const spy = jasmine.createSpy('close');
    component.close.subscribe(spy);
    api().onEscape();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('canNavigate is false with a single image', () => {
    fixture.componentRef.setInput('total', 1);
    fixture.detectChanges();
    expect(api().canNavigate).toBeFalse();
  });

  it('canNavigate is true when total > 1', () => {
    fixture.componentRef.setInput('total', 3);
    fixture.detectChanges();
    expect(api().canNavigate).toBeTrue();
  });

  it('does not emit previous/next when navigation is disabled', () => {
    fixture.componentRef.setInput('total', 1);
    fixture.detectChanges();
    const prev = jasmine.createSpy('previous');
    const next = jasmine.createSpy('next');
    component.previous.subscribe(prev);
    component.next.subscribe(next);
    api().onArrowLeft();
    api().onArrowRight();
    expect(prev).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('emits previous and next on arrow keys when navigation is enabled', () => {
    fixture.componentRef.setInput('total', 5);
    fixture.detectChanges();
    const prev = jasmine.createSpy('previous');
    const next = jasmine.createSpy('next');
    component.previous.subscribe(prev);
    component.next.subscribe(next);
    api().onArrowLeft();
    api().onArrowRight();
    expect(prev).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
