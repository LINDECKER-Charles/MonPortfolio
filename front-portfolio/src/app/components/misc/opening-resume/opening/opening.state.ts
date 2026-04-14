export type OpeningState = 'sound-gate' | 'intro-ready' | 'intro-leaving' | 'finished';

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
