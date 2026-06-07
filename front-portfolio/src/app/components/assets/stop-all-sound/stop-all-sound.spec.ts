import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { StopAllSound } from './stop-all-sound';
import { AudioService } from '../../../services/audio-service';

describe('StopAllSound', () => {
  let component: StopAllSound;
  let fixture: ComponentFixture<StopAllSound>;
  let audio: AudioService;

  beforeEach(async () => {
    // avoid running the real intro tween in jsdom/headless
    spyOn(gsap, 'fromTo').and.returnValue({} as gsap.core.Tween);

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [StopAllSound],
    }).compileComponents();

    fixture = TestBed.createComponent(StopAllSound);
    component = fixture.componentInstance;
    audio = TestBed.inject(AudioService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('runs the intro animation on view init', () => {
    expect(gsap.fromTo).toHaveBeenCalled();
  });

  it('volumePercent rounds the master volume', () => {
    audio.setMasterVolume(0.734);
    expect(component.volumePercent).toBe(73);
  });

  it('toggleSound mutes when unmuted and unmutes when muted', () => {
    const muteSpy = spyOn(audio, 'muteAll').and.callThrough();
    const unmuteSpy = spyOn(audio, 'unmuteAll').and.callThrough();

    component.toggleSound();
    expect(muteSpy).toHaveBeenCalledTimes(1);
    expect(audio.muted()).toBeTrue();

    component.toggleSound();
    expect(unmuteSpy).toHaveBeenCalledTimes(1);
    expect(audio.muted()).toBeFalse();
  });

  it('toggleCollapsed flips the collapsed flag', () => {
    expect(component.collapsed).toBeFalse();
    component.toggleCollapsed();
    expect(component.collapsed).toBeTrue();
    component.toggleCollapsed();
    expect(component.collapsed).toBeFalse();
  });

  it('onVolumeInput maps a 0-100 input to a 0-1 master volume', () => {
    const setSpy = spyOn(audio, 'setMasterVolume').and.callThrough();
    const input = document.createElement('input');
    input.value = '25';
    component.onVolumeInput({ target: input } as unknown as Event);
    expect(setSpy).toHaveBeenCalledWith(0.25);
  });

  it('onVolumeInput ignores a non-numeric value', () => {
    const setSpy = spyOn(audio, 'setMasterVolume');
    const input = document.createElement('input');
    input.value = 'xx';
    component.onVolumeInput({ target: input } as unknown as Event);
    expect(setSpy).not.toHaveBeenCalled();
  });
});
