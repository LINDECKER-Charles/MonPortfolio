import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type AudioKey = string;

interface RegisteredSound {
  src: string;
  volume: number;
  loop: boolean;
  preload: 'none' | 'metadata' | 'auto';
}

interface PlayingInstance {
  id: string;
  key: AudioKey;
  audio: HTMLAudioElement;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly STORAGE_VOLUME_KEY = 'audio.masterVolume';
  private readonly STORAGE_MUTED_KEY = 'audio.muted';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private registry = new Map<AudioKey, RegisteredSound>();
  private persistentPlayers = new Map<AudioKey, HTMLAudioElement>();
  private playingInstances = new Map<string, PlayingInstance>();

  private _playingCount = signal(0);
  private _muted = signal(false);
  private _masterVolume = signal(1);

  readonly playingCount = this._playingCount.asReadonly();
  readonly muted = this._muted.asReadonly();
  readonly masterVolume = this._masterVolume.asReadonly();
  readonly isAnythingPlaying = computed(() => this._playingCount() > 0);

  constructor() {
    this.restorePreferences();
  }

  register(key: AudioKey, config: RegisteredSound): void {
    this.registry.set(key, config);
  }

  registerMany(sounds: Record<AudioKey, RegisteredSound>): void {
    for (const [key, config] of Object.entries(sounds)) {
      this.register(key, config);
    }
  }

  play(key: AudioKey): HTMLAudioElement | null {
    if (!this.isBrowser) return null;

    const config = this.registry.get(key);
    if (!config) {
      console.warn(`[AudioService] Son non enregistré: ${key}`);
      return null;
    }

    let audio = this.persistentPlayers.get(key);

    if (!audio) {
      audio = this.createAudio(config);
      this.persistentPlayers.set(key, audio);
    }

    audio.currentTime = 0;
    audio.loop = config.loop;
    audio.volume = this.computeVolume(config.volume);
    audio.muted = this._muted();

    audio.play().catch(err => {
      console.warn(`[AudioService] Impossible de lire "${key}"`, err);
    });

    this.refreshPlayingCount();
    return audio;
  }

  playOnce(key: AudioKey): string | null {
    if (!this.isBrowser) return null;

    const config = this.registry.get(key);
    if (!config) {
      console.warn(`[AudioService] Son non enregistré: ${key}`);
      return null;
    }

    const audio = this.createAudio(config);
    const id = crypto.randomUUID();

    const cleanup = () => {
      audio.removeEventListener('ended', cleanup);
      this.playingInstances.delete(id);
      this.refreshPlayingCount();
    };

    audio.addEventListener('ended', cleanup);
    this.playingInstances.set(id, { id, key, audio });

    audio.play().catch(err => {
      console.warn(`[AudioService] Impossible de lire "${key}"`, err);
      cleanup();
    });

    this.refreshPlayingCount();
    return id;
  }

  pause(key: AudioKey): void {
    this.persistentPlayers.get(key)?.pause();
    this.refreshPlayingCount();
  }

  stop(key: AudioKey): void {
    const audio = this.persistentPlayers.get(key);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    this.refreshPlayingCount();
  }

  resume(key: AudioKey): void {
    if (!this.isBrowser) return;

    const audio = this.persistentPlayers.get(key);
    if (!audio) return;

    audio.play().catch(err => {
      console.warn(`[AudioService] Impossible de reprendre "${key}"`, err);
    });

    this.refreshPlayingCount();
  }

  stopInstance(instanceId: string): void {
    const instance = this.playingInstances.get(instanceId);
    if (!instance) return;

    instance.audio.pause();
    instance.audio.currentTime = 0;
    this.playingInstances.delete(instanceId);
    this.refreshPlayingCount();
  }

  stopAll(): void {
    for (const audio of this.persistentPlayers.values()) {
      audio.pause();
      audio.currentTime = 0;
    }

    for (const instance of this.playingInstances.values()) {
      instance.audio.pause();
      instance.audio.currentTime = 0;
    }

    this.playingInstances.clear();
    this.refreshPlayingCount();
  }

  muteAll(): void {
    this._muted.set(true);
    this.saveMutedPreference(true);

    for (const audio of this.persistentPlayers.values()) {
      audio.muted = true;
    }

    for (const instance of this.playingInstances.values()) {
      instance.audio.muted = true;
    }
  }

  unmuteAll(): void {
    this._muted.set(false);
    this.saveMutedPreference(false);

    for (const [key, audio] of this.persistentPlayers.entries()) {
      const config = this.registry.get(key);
      if (!config) continue;

      audio.muted = false;
      audio.volume = this.computeVolume(config.volume);
    }

    for (const instance of this.playingInstances.values()) {
      const config = this.registry.get(instance.key);
      if (!config) continue;

      instance.audio.muted = false;
      instance.audio.volume = this.computeVolume(config.volume);
    }
  }

  setMasterVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this._masterVolume.set(clamped);
    this.saveVolumePreference(clamped);

    for (const [key, audio] of this.persistentPlayers.entries()) {
      const config = this.registry.get(key);
      if (!config) continue;

      audio.volume = this.computeVolume(config.volume);
    }

    for (const instance of this.playingInstances.values()) {
      const config = this.registry.get(instance.key);
      if (!config) continue;

      instance.audio.volume = this.computeVolume(config.volume);
    }
  }

  private createAudio(config: RegisteredSound): HTMLAudioElement {
    const audio = new Audio(config.src);
    audio.preload = config.preload;
    audio.loop = config.loop;
    audio.volume = this.computeVolume(config.volume);
    audio.muted = this._muted();
    return audio;
  }

  private computeVolume(localVolume: number): number {
    return Math.max(0, Math.min(1, localVolume * this._masterVolume()));
  }

  private refreshPlayingCount(): void {
    let count = 0;

    for (const audio of this.persistentPlayers.values()) {
      if (!audio.paused && !audio.ended) count++;
    }

    for (const instance of this.playingInstances.values()) {
      if (!instance.audio.paused && !instance.audio.ended) count++;
    }

    this._playingCount.set(count);
  }

  private restorePreferences(): void {
    if (!this.isBrowser) return;

    const storedVolume = localStorage.getItem(this.STORAGE_VOLUME_KEY);
    if (storedVolume !== null) {
      const parsedVolume = Number(storedVolume);
      if (!Number.isNaN(parsedVolume)) {
        this._masterVolume.set(Math.max(0, Math.min(1, parsedVolume)));
      }
    }

    const storedMuted = localStorage.getItem(this.STORAGE_MUTED_KEY);
    if (storedMuted !== null) {
      this._muted.set(storedMuted === 'true');
    }
  }

  private saveVolumePreference(volume: number): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.STORAGE_VOLUME_KEY, String(volume));
  }

  private saveMutedPreference(muted: boolean): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.STORAGE_MUTED_KEY, String(muted));
  }
}
