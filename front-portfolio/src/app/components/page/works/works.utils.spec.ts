import { formatDuration, formatMonthYear, formatPeriod } from './works.utils';

describe('formatMonthYear', () => {
  it('formate fr par défaut', () => {
    expect(formatMonthYear('2025-12', 'fr')).toBe('déc. 2025');
  });

  it('formate en', () => {
    expect(formatMonthYear('2025-12', 'en')).toBe('Dec 2025');
  });

  it('formate les autres locales supportées via Intl (plus de fallback fr)', () => {
    expect(formatMonthYear('2025-01', 'de')).toBe('Jan. 2025');
  });

  it('renvoie la chaîne brute si format invalide', () => {
    expect(formatMonthYear('2025/12', 'fr')).toBe('2025/12');
    expect(formatMonthYear('invalid', 'fr')).toBe('invalid');
  });

  it('renvoie la chaîne brute si mois hors bornes', () => {
    expect(formatMonthYear('2025-13', 'fr')).toBe('2025-13');
    expect(formatMonthYear('2025-00', 'fr')).toBe('2025-00');
  });
});

describe('formatPeriod', () => {
  it('utilise le label « aujourd\'hui » quand end est null', () => {
    expect(formatPeriod('2025-04', null, 'fr', 'aujourd’hui')).toBe('avr. 2025 — aujourd’hui');
  });

  it('formate une période bornée', () => {
    expect(formatPeriod('2025-04', '2025-10', 'fr', 'aujourd’hui')).toBe('avr. 2025 — oct. 2025');
  });

  it('respecte la langue en', () => {
    expect(formatPeriod('2025-04', '2025-10', 'en', 'present')).toBe('Apr 2025 — Oct 2025');
  });
});

describe('formatDuration', () => {
  it('renvoie vide si start invalide', () => {
    expect(formatDuration('bad', '2025-10', 'fr')).toBe('');
  });

  it('renvoie vide si end invalide (non null)', () => {
    expect(formatDuration('2025-04', 'bad', 'fr')).toBe('');
  });

  it('renvoie vide si la durée totale est <= 0', () => {
    // end strictement avant start ⇒ totalMonths négatif
    expect(formatDuration('2025-10', '2025-01', 'fr')).toBe('');
  });

  it('formate uniquement les mois (fr, singulier mois)', () => {
    expect(formatDuration('2025-04', '2025-04', 'fr')).toBe('1 mois');
  });

  it('formate plusieurs mois (fr)', () => {
    expect(formatDuration('2025-01', '2025-05', 'fr')).toBe('5 mois');
  });

  it('formate années + mois avec pluriel (fr)', () => {
    expect(formatDuration('2023-01', '2025-03', 'fr')).toBe('2 ans 3 mois');
  });

  it('formate une seule année au singulier (fr)', () => {
    // 12 mois exacts ⇒ 1 an, 0 mois
    expect(formatDuration('2024-01', '2024-12', 'fr')).toBe('1 an');
  });

  it('formate en anglais (yr/yrs/mo)', () => {
    expect(formatDuration('2023-01', '2025-03', 'en')).toBe('2 yrs 3 mo');
    expect(formatDuration('2024-01', '2024-12', 'en')).toBe('1 yr');
    expect(formatDuration('2025-01', '2025-05', 'en')).toBe('5 mo');
  });

  it('calcule la durée jusqu\'au mois courant quand end est null', () => {
    const now = new Date();
    const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    // start == mois courant ⇒ 1 mois inclus
    expect(formatDuration(start, null, 'fr')).toBe('1 mois');
  });
});
