import { SOUND_CATALOG } from './sound-catalog';

describe('SOUND_CATALOG', () => {
  const entries = Object.entries(SOUND_CATALOG);

  it('expose les 9 sons du site', () => {
    expect(Object.keys(SOUND_CATALOG)).toEqual([
      'bgMusic',
      'pouperVoice',
      'getItem',
      'bloodVial',
      'getEcho',
      'getbackEcho',
      'messagerLaught',
      'smallBell',
      'newLocation',
    ]);
  });

  it('ne référence que des mp3 absolus sous /song/ (résolus depuis toute route)', () => {
    for (const [key, sound] of entries) {
      expect(sound.src)
        .withContext(key)
        .toMatch(/^\/song\/[a-z0-9_]+\.mp3$/);
    }
  });

  it('seule la musique de fond boucle', () => {
    expect(SOUND_CATALOG.bgMusic.loop).toBeTrue();
    for (const [key, sound] of entries.filter(([k]) => k !== 'bgMusic')) {
      expect(sound.loop).withContext(key).toBeFalse();
    }
  });
});
