export type OpeningState = 'sound-gate' | 'intro-ready' | 'intro-leaving' | 'finished';

/** Clé localStorage : une séquence d'ouverture a déjà été vue ou passée. */
export const OPENING_SEEN_KEY = 'opening.seen';

/** Query param : rejouer explicitement la séquence, même déjà vue (CTA de la home). */
export const OPENING_REPLAY_PARAM = 'replay';

/** Query param : passer la séquence (liens partagés, candidatures). */
export const OPENING_SKIP_PARAM = 'skip-opening';

export function canEnableSound(state: OpeningState): boolean {
  return state === 'sound-gate';
}

export function canStartIntro(state: OpeningState): boolean {
  return state === 'intro-ready';
}

export function canSkipOpening(state: OpeningState): boolean {
  return state !== 'finished';
}

export function moveToIntroReady(state: OpeningState): OpeningState {
  return canEnableSound(state) ? 'intro-ready' : state;
}

export function moveToIntroLeaving(state: OpeningState): OpeningState {
  return canStartIntro(state) ? 'intro-leaving' : state;
}

export function moveToFinished(): OpeningState {
  return 'finished';
}
