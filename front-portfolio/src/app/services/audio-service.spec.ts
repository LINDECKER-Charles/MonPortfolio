import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio-service';

const VOLUME_KEY = 'audio.masterVolume';
const MUTED_KEY = 'audio.muted';

/**
 * jsdom/Chrome headless do not implement media playback. We stub the prototype
 * methods so no real audio is produced and play() resolves/rejects on demand.
 */
function stubMediaElement(playImpl: () => Promise<void> = () => Promise.resolve()) {
  spyOn(HTMLMediaElement.prototype, 'play').and.callFake(function (this: HTMLMediaElement) {
    // headless Chrome never actually starts playback; emulate `paused` flipping to false
    Object.defineProperty(this, 'paused', { value: false, configurable: true });
    return playImpl();
  });
  spyOn(HTMLMediaElement.prototype, 'pause').and.callFake(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'paused', { value: true, configurable: true });
  });
}

function createService(): AudioService {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
  return TestBed.inject(AudioService);
}

const SOUND = {
  src: 'data:audio/wav;base64,AA',
  volume: 0.5,
  loop: false,
  preload: 'auto' as const,
};

describe('AudioService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created with defaults', () => {
    stubMediaElement();
    const service = createService();
    expect(service).toBeTruthy();
    expect(service.muted()).toBeFalse();
    expect(service.masterVolume()).toBe(1);
    expect(service.isAnythingPlaying()).toBeFalse();
  });

  describe('restorePreferences()', () => {
    it('restores a valid persisted master volume and muted flag', () => {
      localStorage.setItem(VOLUME_KEY, '0.3');
      localStorage.setItem(MUTED_KEY, 'true');
      stubMediaElement();
      const service = createService();

      expect(service.masterVolume()).toBeCloseTo(0.3);
      expect(service.muted()).toBeTrue();
    });

    it('clamps an out-of-range persisted volume', () => {
      localStorage.setItem(VOLUME_KEY, '5');
      stubMediaElement();
      const service = createService();

      expect(service.masterVolume()).toBe(1);
    });

    it('ignores a NaN persisted volume', () => {
      localStorage.setItem(VOLUME_KEY, 'not-a-number');
      stubMediaElement();
      const service = createService();

      expect(service.masterVolume()).toBe(1);
    });

    it('treats any non-"true" muted value as false', () => {
      localStorage.setItem(MUTED_KEY, 'false');
      stubMediaElement();
      const service = createService();

      expect(service.muted()).toBeFalse();
    });
  });

  describe('register / registerMany', () => {
    it('registerMany registers every entry', () => {
      stubMediaElement();
      const service = createService();
      service.registerMany({ a: SOUND, b: { ...SOUND, volume: 1 } });

      expect(service.play('a')).not.toBeNull();
      expect(service.play('b')).not.toBeNull();
    });
  });

  describe('play() (persistent)', () => {
    it('warns and returns null for an unregistered key', () => {
      stubMediaElement();
      const warn = spyOn(console, 'warn');
      const service = createService();

      expect(service.play('ghost')).toBeNull();
      expect(warn).toHaveBeenCalled();
    });

    it('creates a persistent player, applies config and counts it as playing', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', { ...SOUND, loop: true, volume: 0.8 });

      const audio = service.play('amb')!;
      expect(audio).toBeTruthy();
      expect(audio.loop).toBeTrue();
      expect(audio.volume).toBeCloseTo(0.8); // master = 1
      expect(service.playingCount()).toBe(1);
      expect(service.isAnythingPlaying()).toBeTrue();
    });

    it('reuses the same persistent player on a second play of the same key', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', SOUND);

      const first = service.play('amb');
      const second = service.play('amb');
      expect(first).toBe(second);
    });

    it('logs when play() rejects but still returns the element', async () => {
      stubMediaElement(() => Promise.reject(new Error('autoplay blocked')));
      const warn = spyOn(console, 'warn');
      const service = createService();
      service.register('amb', SOUND);

      const audio = service.play('amb');
      expect(audio).not.toBeNull();
      await Promise.resolve();
      await Promise.resolve();
      expect(warn).toHaveBeenCalled();
    });
  });

  describe('playOnce() (oneshot)', () => {
    it('warns and returns null for an unregistered key', () => {
      stubMediaElement();
      const warn = spyOn(console, 'warn');
      const service = createService();

      expect(service.playOnce('ghost')).toBeNull();
      expect(warn).toHaveBeenCalled();
    });

    it('returns an instance id and increments the playing count', () => {
      stubMediaElement();
      const service = createService();
      service.register('blip', SOUND);

      const id = service.playOnce('blip');
      expect(typeof id).toBe('string');
      expect(service.playingCount()).toBe(1);
    });

    it('cleans up the instance on the ended event', () => {
      stubMediaElement();
      const service = createService();
      service.register('blip', SOUND);

      const id = service.playOnce('blip')!;
      const instance = (service as any).playingInstances.get(id) as { audio: HTMLAudioElement };
      Object.defineProperty(instance.audio, 'paused', { value: true, configurable: true });
      instance.audio.dispatchEvent(new Event('ended'));

      expect((service as any).playingInstances.has(id)).toBeFalse();
      expect(service.playingCount()).toBe(0);
    });

    it('cleans up when play() rejects', async () => {
      stubMediaElement(() => Promise.reject(new Error('blocked')));
      spyOn(console, 'warn');
      const service = createService();
      service.register('blip', SOUND);

      const id = service.playOnce('blip')!;
      await Promise.resolve();
      await Promise.resolve();
      expect((service as any).playingInstances.has(id)).toBeFalse();
    });
  });

  describe('pause / stop / resume', () => {
    it('pause() pauses an existing persistent player', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', SOUND);
      const audio = service.play('amb')!;

      service.pause('amb');
      expect(audio.paused).toBeTrue();
      expect(service.playingCount()).toBe(0);
    });

    it('pause() on an unknown key is a no-op', () => {
      stubMediaElement();
      const service = createService();
      expect(() => service.pause('unknown')).not.toThrow();
    });

    it('stop() resets currentTime and pauses', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', SOUND);
      const audio = service.play('amb')!;
      audio.currentTime = 10;

      service.stop('amb');
      expect(audio.paused).toBeTrue();
      expect(audio.currentTime).toBe(0);
    });

    it('stop() on an unknown key is a no-op', () => {
      stubMediaElement();
      const service = createService();
      expect(() => service.stop('unknown')).not.toThrow();
    });

    it('resume() restarts an existing persistent player', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', SOUND);
      const audio = service.play('amb')!;
      const playSpy = audio.play as jasmine.Spy;
      playSpy.calls.reset();

      service.resume('amb');
      expect(playSpy).toHaveBeenCalled();
    });

    it('resume() on an unknown key is a no-op', () => {
      stubMediaElement();
      const service = createService();
      expect(() => service.resume('unknown')).not.toThrow();
    });

    it('resume() logs when play rejects', async () => {
      stubMediaElement(() => Promise.reject(new Error('blocked')));
      const warn = spyOn(console, 'warn');
      const service = createService();
      service.register('amb', SOUND);
      service.play('amb');

      service.resume('amb');
      await Promise.resolve();
      await Promise.resolve();
      expect(warn).toHaveBeenCalled();
    });
  });

  describe('stopInstance / stopAll', () => {
    it('stopInstance() stops and removes a oneshot instance', () => {
      stubMediaElement();
      const service = createService();
      service.register('blip', SOUND);
      const id = service.playOnce('blip')!;

      service.stopInstance(id);
      expect((service as any).playingInstances.has(id)).toBeFalse();
    });

    it('stopInstance() on an unknown id is a no-op', () => {
      stubMediaElement();
      const service = createService();
      expect(() => service.stopInstance('nope')).not.toThrow();
    });

    it('stopAll() stops persistent players and clears oneshot instances', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', SOUND);
      service.register('blip', SOUND);
      const amb = service.play('amb')!;
      service.playOnce('blip');

      service.stopAll();
      expect(amb.paused).toBeTrue();
      expect((service as any).playingInstances.size).toBe(0);
      expect(service.playingCount()).toBe(0);
    });
  });

  describe('mute / unmute', () => {
    it('muteAll() mutes existing players and persists the flag', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', SOUND);
      const audio = service.play('amb')!;

      service.muteAll();
      expect(service.muted()).toBeTrue();
      expect(audio.muted).toBeTrue();
      expect(localStorage.getItem(MUTED_KEY)).toBe('true');
    });

    it('unmuteAll() unmutes and restores computed volume', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', { ...SOUND, volume: 0.5 });
      const audio = service.play('amb')!;
      service.muteAll();

      service.unmuteAll();
      expect(service.muted()).toBeFalse();
      expect(audio.muted).toBeFalse();
      expect(audio.volume).toBeCloseTo(0.5);
      expect(localStorage.getItem(MUTED_KEY)).toBe('false');
    });

    it('mute/unmute also affect oneshot instances', () => {
      stubMediaElement();
      const service = createService();
      service.register('blip', { ...SOUND, volume: 0.4 });
      const id = service.playOnce('blip')!;
      const instance = (service as any).playingInstances.get(id) as { audio: HTMLAudioElement };

      service.muteAll();
      expect(instance.audio.muted).toBeTrue();

      service.unmuteAll();
      expect(instance.audio.muted).toBeFalse();
      expect(instance.audio.volume).toBeCloseTo(0.4);
    });

    it('unmuteAll() skips players whose config was removed from the registry', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', SOUND);
      service.play('amb');
      // simulate a dangling persistent player without a config
      (service as any).registry.delete('amb');

      expect(() => service.unmuteAll()).not.toThrow();
    });
  });

  describe('setMasterVolume()', () => {
    it('clamps, persists and recomputes per-player volume', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', { ...SOUND, volume: 0.5 });
      const audio = service.play('amb')!;

      service.setMasterVolume(0.5);
      expect(service.masterVolume()).toBe(0.5);
      expect(localStorage.getItem(VOLUME_KEY)).toBe('0.5');
      expect(audio.volume).toBeCloseTo(0.25); // 0.5 * 0.5

      service.setMasterVolume(2);
      expect(service.masterVolume()).toBe(1);

      service.setMasterVolume(-1);
      expect(service.masterVolume()).toBe(0);
    });

    it('recomputes volume on oneshot instances too', () => {
      stubMediaElement();
      const service = createService();
      service.register('blip', { ...SOUND, volume: 0.8 });
      const id = service.playOnce('blip')!;
      const instance = (service as any).playingInstances.get(id) as { audio: HTMLAudioElement };

      service.setMasterVolume(0.5);
      expect(instance.audio.volume).toBeCloseTo(0.4);
    });

    it('skips players whose config was removed from the registry', () => {
      stubMediaElement();
      const service = createService();
      service.register('amb', SOUND);
      service.play('amb');
      (service as any).registry.delete('amb');

      expect(() => service.setMasterVolume(0.5)).not.toThrow();
    });
  });
});
