import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SoundKey } from '../audio/sound-catalog';
import { AudioService } from '../services/audio-service';
import { PlaySoundOnClickDirective } from './play-sound-on-click.directive';

@Component({
  imports: [PlaySoundOnClickDirective],
  template: `
    <button
      [appPlaySoundOnClick]="soundKey"
      [appPlaySoundMode]="mode"
      [appPlaySoundTrigger]="trigger"
      [appPlaySoundDisabled]="disabled"
      type="button"
    >
      Trigger
    </button>
  `,
})
class TestHostComponent {
  soundKey: SoundKey = 'getItem';
  mode: 'once' | 'persistent' = 'once';
  trigger: 'click' | 'hover' = 'click';
  disabled = false;
}

describe('PlaySoundOnClickDirective', () => {
  let audioService: jasmine.SpyObj<AudioService>;

  beforeEach(async () => {
    audioService = jasmine.createSpyObj<AudioService>('AudioService', ['play', 'playOnce']);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AudioService, useValue: audioService },
      ],
    }).compileComponents();
  });

  it('plays the sound once by default', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');

    expect(audioService.playOnce).toHaveBeenCalledWith('getItem');
    expect(audioService.play).not.toHaveBeenCalled();
  });

  it('plays the persistent sound when requested', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.mode = 'persistent';
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');

    expect(audioService.play).toHaveBeenCalledWith('getItem');
    expect(audioService.playOnce).not.toHaveBeenCalled();
  });

  it('plays on hover when requested', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.trigger = 'hover';
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).triggerEventHandler('mouseenter');

    expect(audioService.playOnce).toHaveBeenCalledWith('getItem');
    expect(audioService.play).not.toHaveBeenCalled();
  });

  it('does not play on click when trigger is hover', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.trigger = 'hover';
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');

    expect(audioService.play).not.toHaveBeenCalled();
    expect(audioService.playOnce).not.toHaveBeenCalled();
  });

  it('does nothing when disabled', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');

    expect(audioService.play).not.toHaveBeenCalled();
    expect(audioService.playOnce).not.toHaveBeenCalled();
  });

  it('does nothing when the sound key is empty', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    // Cast volontaire : le contrat SoundKey interdit la clé vide, on teste la garde runtime.
    fixture.componentInstance.soundKey = '' as SoundKey;
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');

    expect(audioService.play).not.toHaveBeenCalled();
    expect(audioService.playOnce).not.toHaveBeenCalled();
  });

  it('does not play on mouseenter when trigger is click', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).triggerEventHandler('mouseenter');

    expect(audioService.play).not.toHaveBeenCalled();
    expect(audioService.playOnce).not.toHaveBeenCalled();
  });

  it('plays the persistent sound on hover when both are set', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.trigger = 'hover';
    fixture.componentInstance.mode = 'persistent';
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).triggerEventHandler('mouseenter');

    expect(audioService.play).toHaveBeenCalledWith('getItem');
    expect(audioService.playOnce).not.toHaveBeenCalled();
  });
});
