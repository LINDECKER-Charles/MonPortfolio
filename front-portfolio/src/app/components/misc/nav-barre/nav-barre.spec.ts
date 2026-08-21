import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarre } from './nav-barre';
import { AudioService } from '../../../services/audio-service';

describe('NavBarre', () => {
  let component: NavBarre;
  let fixture: ComponentFixture<NavBarre>;
  let audio: AudioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [NavBarre],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarre);
    component = fixture.componentInstance;
    audio = TestBed.inject(AudioService);
    fixture.detectChanges();
  });

  // typed access to protected members for testing
  const api = () =>
    component as unknown as {
      soundPopoverOpen: () => boolean;
      volumePercent: () => number;
      navItems: () => { key: string; label: string }[];
      currentLang: () => { code: string };
      toggleSoundPopover: () => void;
      toggleMute: () => void;
      onVolumeInput: (e: Event) => void;
      onDocumentClick: (e: MouseEvent) => void;
      onEscape: () => void;
    };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the three nav items with translated labels', () => {
    const items = api().navItems();
    expect(items.map((i) => i.key)).toEqual(['home', 'projects', 'work']);
    // translate() falls back to the raw key when no namespace loaded
    expect(items[0].label).toBe('nav-barre.home');
  });

  it('reflects master volume as a rounded percentage', () => {
    audio.setMasterVolume(0.426);
    expect(api().volumePercent()).toBe(43);
  });

  it('toggles the sound popover open then closed', () => {
    expect(api().soundPopoverOpen()).toBeFalse();
    api().toggleSoundPopover();
    expect(api().soundPopoverOpen()).toBeTrue();
    api().toggleSoundPopover();
    expect(api().soundPopoverOpen()).toBeFalse();
  });

  it('toggleMute mutes when not muted and unmutes when muted', () => {
    const muteSpy = spyOn(audio, 'muteAll').and.callThrough();
    const unmuteSpy = spyOn(audio, 'unmuteAll').and.callThrough();

    api().toggleMute();
    expect(muteSpy).toHaveBeenCalledTimes(1);
    expect(audio.muted()).toBeTrue();

    api().toggleMute();
    expect(unmuteSpy).toHaveBeenCalledTimes(1);
    expect(audio.muted()).toBeFalse();
  });

  it('onVolumeInput sets master volume from the input value', () => {
    const setSpy = spyOn(audio, 'setMasterVolume').and.callThrough();
    const input = document.createElement('input');
    input.value = '60';
    api().onVolumeInput({ target: input } as unknown as Event);
    expect(setSpy).toHaveBeenCalledWith(0.6);
  });

  it('onVolumeInput ignores a NaN value', () => {
    const setSpy = spyOn(audio, 'setMasterVolume');
    const input = document.createElement('input');
    input.value = 'abc';
    api().onVolumeInput({ target: input } as unknown as Event);
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('document click outside closes an open popover', () => {
    api().toggleSoundPopover();
    expect(api().soundPopoverOpen()).toBeTrue();
    const outside = document.createElement('div');
    document.body.appendChild(outside);
    api().onDocumentClick({ target: outside } as unknown as MouseEvent);
    expect(api().soundPopoverOpen()).toBeFalse();
    outside.remove();
  });

  it('document click inside the host keeps the popover open', () => {
    api().toggleSoundPopover();
    const inside = fixture.nativeElement as HTMLElement;
    api().onDocumentClick({ target: inside } as unknown as MouseEvent);
    expect(api().soundPopoverOpen()).toBeTrue();
  });

  it('document click is a no-op when popover already closed', () => {
    expect(api().soundPopoverOpen()).toBeFalse();
    const outside = document.createElement('div');
    api().onDocumentClick({ target: outside } as unknown as MouseEvent);
    expect(api().soundPopoverOpen()).toBeFalse();
  });

  it('escape closes an open popover and is a no-op otherwise', () => {
    api().onEscape();
    expect(api().soundPopoverOpen()).toBeFalse();
    api().toggleSoundPopover();
    api().onEscape();
    expect(api().soundPopoverOpen()).toBeFalse();
  });

  it('currentLang falls back to the first available language for unknown codes', () => {
    expect(api().currentLang().code).toBe('fr');
  });

  it('emits langModalRequested when the lang button is clicked', () => {
    const emitted = jasmine.createSpy('langModalRequested');
    component.langModalRequested.subscribe(emitted);

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '.nav-barre__icon-btn--lang',
    );
    expect(button).not.toBeNull();
    button!.click();

    expect(emitted).toHaveBeenCalledTimes(1);
  });
});
