import { RegisteredSound } from '../services/audio-service';

/**
 * Catalogue déclaratif des sons du site (assets `public/song/`). Chemins
 * absolus : résolus depuis n'importe quelle route, contrairement à `./song/`.
 *
 * `as const satisfies` fige les clés : `SoundKey` est vérifiée à la
 * compilation (strictTemplates) partout où un son est joué — une faute de
 * frappe devient une erreur de build au lieu d'un `console.warn` runtime.
 * Enregistré au bootstrap via `provideAppInitializer` (cf. app.config.ts).
 */
export const SOUND_CATALOG = {
  bgMusic: { src: '/song/hunters_dream.mp3', loop: true, volume: 0.7, preload: 'auto' },
  pouperVoice: { src: '/song/pouper_welcome.mp3', loop: false, volume: 0.9, preload: 'auto' },
  getItem: { src: '/song/get_item.mp3', loop: false, volume: 0.4, preload: 'auto' },
  bloodVial: { src: '/song/blood_vial.mp3', loop: false, volume: 0.15, preload: 'auto' },
  getEcho: { src: '/song/get_echo.mp3', loop: false, volume: 0.15, preload: 'auto' },
  getbackEcho: { src: '/song/getback_echo.mp3', loop: false, volume: 0.15, preload: 'auto' },
  messagerLaught: { src: '/song/messager_laught.mp3', loop: false, volume: 0.15, preload: 'auto' },
  smallBell: { src: '/song/small_bell.mp3', loop: false, volume: 0.15, preload: 'auto' },
  newLocation: { src: '/song/new_location.mp3', loop: false, volume: 0.3, preload: 'auto' },
} as const satisfies Record<string, RegisteredSound>;

/** Clé d'un son du catalogue — contrat des call-sites (directive incluse). */
export type SoundKey = keyof typeof SOUND_CATALOG;
