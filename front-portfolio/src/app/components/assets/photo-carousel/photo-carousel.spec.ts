import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCarousel, PhotoCarouselSlide } from './photo-carousel';

function slide(alt: string): PhotoCarouselSlide {
  return { sources: [{ src: `${alt}.webp`, type: 'image/webp' }], fallbackSrc: `${alt}.jpg`, alt };
}

describe('PhotoCarousel', () => {
  let component: PhotoCarousel;
  let fixture: ComponentFixture<PhotoCarousel>;

  async function setup(
    slides: PhotoCarouselSlide[],
    opts: Partial<{ autoplay: boolean; interval: number }> = {},
  ) {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [PhotoCarousel],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCarousel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('slides', slides);
    if (opts.autoplay !== undefined) fixture.componentRef.setInput('autoplay', opts.autoplay);
    if (opts.interval !== undefined) fixture.componentRef.setInput('interval', opts.interval);
  }

  const api = () =>
    component as unknown as {
      currentIndex: () => number;
      running: () => boolean;
      isActive: (i: number) => boolean;
      isPaused: () => boolean;
      goTo: (i: number) => void;
      next: () => void;
      previous: () => void;
      togglePause: () => void;
      onMouseEnter: () => void;
      onMouseLeave: () => void;
      onKeydown: (e: KeyboardEvent) => void;
      goToSlideLabel: (i: number) => string;
    };

  afterEach(() => {
    // Each test that installs the jasmine clock uninstalls it itself; keep DOM clean.
    if (fixture) fixture.destroy();
  });

  it('should create with the required slides input', async () => {
    await setup([slide('a'), slide('b')], { autoplay: false });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('goTo wraps negative and overflow indices (modulo arithmetic)', async () => {
    await setup([slide('a'), slide('b'), slide('c')], { autoplay: false });
    fixture.detectChanges();
    api().goTo(-1);
    expect(api().currentIndex()).toBe(2);
    api().goTo(4);
    expect(api().currentIndex()).toBe(1);
  });

  it('goTo is a no-op when there are no slides', async () => {
    await setup([], { autoplay: false });
    fixture.detectChanges();
    api().goTo(2);
    expect(api().currentIndex()).toBe(0);
  });

  it('next and previous move and wrap around', async () => {
    await setup([slide('a'), slide('b')], { autoplay: false });
    fixture.detectChanges();
    api().next();
    expect(api().currentIndex()).toBe(1);
    api().next();
    expect(api().currentIndex()).toBe(0);
    api().previous();
    expect(api().currentIndex()).toBe(1);
  });

  it('isActive reflects the current slide', async () => {
    await setup([slide('a'), slide('b')], { autoplay: false });
    fixture.detectChanges();
    expect(api().isActive(0)).toBeTrue();
    api().next();
    expect(api().isActive(1)).toBeTrue();
    expect(api().isActive(0)).toBeFalse();
  });

  it('goToSlideLabel injects the 1-based index into the template', async () => {
    await setup([slide('a'), slide('b')], { autoplay: false });
    fixture.detectChanges();
    // translate() returns the raw key (no namespace loaded); no {index} placeholder present
    expect(api().goToSlideLabel(0)).toBe('photo-carousel.go_to');
  });

  it('autoplay advances the slide after the interval', async () => {
    jasmine.clock().install();
    try {
      await setup([slide('a'), slide('b'), slide('c')], { autoplay: true, interval: 1000 });
      fixture.detectChanges(); // ngOnInit -> start()
      expect(api().running()).toBeTrue();
      jasmine.clock().tick(1000);
      expect(api().currentIndex()).toBe(1);
      jasmine.clock().tick(1000);
      expect(api().currentIndex()).toBe(2);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('does not start autoplay with a single slide', async () => {
    jasmine.clock().install();
    try {
      await setup([slide('a')], { autoplay: true, interval: 1000 });
      fixture.detectChanges();
      expect(api().running()).toBeFalse();
      jasmine.clock().tick(2000);
      expect(api().currentIndex()).toBe(0);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('does not start when autoplay is disabled', async () => {
    jasmine.clock().install();
    try {
      await setup([slide('a'), slide('b')], { autoplay: false, interval: 1000 });
      fixture.detectChanges();
      expect(api().running()).toBeFalse();
      jasmine.clock().tick(2000);
      expect(api().currentIndex()).toBe(0);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('togglePause stops then restarts autoplay', async () => {
    jasmine.clock().install();
    try {
      await setup([slide('a'), slide('b')], { autoplay: true, interval: 1000 });
      fixture.detectChanges();
      expect(api().isPaused()).toBeFalse();

      api().togglePause();
      expect(api().isPaused()).toBeTrue();
      expect(api().running()).toBeFalse();

      api().togglePause();
      expect(api().isPaused()).toBeFalse();
      expect(api().running()).toBeTrue();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('mouse enter pauses the timer, mouse leave resumes it when not user-paused', async () => {
    jasmine.clock().install();
    try {
      await setup([slide('a'), slide('b')], { autoplay: true, interval: 1000 });
      fixture.detectChanges();

      api().onMouseEnter();
      expect(api().running()).toBeFalse();

      api().onMouseLeave();
      expect(api().running()).toBeTrue();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('mouse leave does not resume while user-paused', async () => {
    jasmine.clock().install();
    try {
      await setup([slide('a'), slide('b')], { autoplay: true, interval: 1000 });
      fixture.detectChanges();
      api().togglePause(); // user pause -> stopped
      api().onMouseLeave();
      expect(api().running()).toBeFalse();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('keyboard arrows navigate and prevent default', async () => {
    await setup([slide('a'), slide('b'), slide('c')], { autoplay: false });
    fixture.detectChanges();

    const right = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    const prevent = spyOn(right, 'preventDefault');
    api().onKeydown(right);
    expect(api().currentIndex()).toBe(1);
    expect(prevent).toHaveBeenCalled();

    const left = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    api().onKeydown(left);
    expect(api().currentIndex()).toBe(0);
  });

  it('ignores non-arrow keys', async () => {
    await setup([slide('a'), slide('b')], { autoplay: false });
    fixture.detectChanges();
    api().onKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(api().currentIndex()).toBe(0);
  });
});
