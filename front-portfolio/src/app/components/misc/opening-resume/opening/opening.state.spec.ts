import {
  canEnableSound,
  canSkipOpening,
  canStartIntro,
  moveToFinished,
  moveToIntroLeaving,
  moveToIntroReady,
  OpeningState,
} from './opening.state';

describe('opening.state', () => {
  const all: OpeningState[] = ['sound-gate', 'intro-ready', 'intro-leaving', 'finished'];

  it('canEnableSound only at sound-gate', () => {
    expect(all.filter(canEnableSound)).toEqual(['sound-gate']);
  });

  it('canStartIntro only at intro-ready', () => {
    expect(all.filter(canStartIntro)).toEqual(['intro-ready']);
  });

  it('canSkipOpening everywhere except finished', () => {
    expect(all.filter(canSkipOpening)).toEqual(['sound-gate', 'intro-ready', 'intro-leaving']);
  });

  it('moveToIntroReady transitions from sound-gate, no-op otherwise', () => {
    expect(moveToIntroReady('sound-gate')).toBe('intro-ready');
    expect(moveToIntroReady('intro-ready')).toBe('intro-ready');
    expect(moveToIntroReady('finished')).toBe('finished');
  });

  it('moveToIntroLeaving transitions from intro-ready, no-op otherwise', () => {
    expect(moveToIntroLeaving('intro-ready')).toBe('intro-leaving');
    expect(moveToIntroLeaving('sound-gate')).toBe('sound-gate');
    expect(moveToIntroLeaving('finished')).toBe('finished');
  });

  it('moveToFinished always returns finished', () => {
    expect(moveToFinished()).toBe('finished');
  });
});
