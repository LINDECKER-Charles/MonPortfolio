import { applyFilters, formatProjectPeriod } from './projects.utils';
import type { ProjectFiltersState, ProjectItem } from './projects.types';

function projectWith(period: ProjectItem['period']): ProjectItem {
  return {
    id: 'x',
    title: 'X',
    period,
    shortDescription: '',
    longDescription: '',
    category: 'personal',
    status: 'done',
    stack: [],
    tags: [],
    links: {},
    highlights: [],
  };
}

describe('applyFilters', () => {
  function project(overrides: Partial<ProjectItem>): ProjectItem {
    return {
      ...projectWith({ dateStart: new Date('2025-01-01'), isEnd: false }),
      ...overrides,
    };
  }

  const hunter = project({ id: 'hunter', category: 'personal', tags: ['Jeu'], stack: ['C#'] });
  const doll = project({
    id: 'doll',
    category: 'open_source',
    tags: ['Jeu', 'Outil'],
    stack: ['Angular'],
  });
  const beast = project({
    id: 'beast',
    category: 'client',
    tags: ['Web'],
    stack: ['Angular', 'C#'],
  });
  const all = [hunter, doll, beast];

  const filters = (overrides: Partial<ProjectFiltersState> = {}): ProjectFiltersState => ({
    category: 'all',
    tags: [],
    stack: [],
    ...overrides,
  });

  it('sans filtre actif, renvoie tous les projets', () => {
    expect(applyFilters(all, filters())).toEqual(all);
  });

  it('filtre par catégorie exacte', () => {
    expect(applyFilters(all, filters({ category: 'client' }))).toEqual([beast]);
  });

  it('filtre par tags en « au moins un »', () => {
    expect(applyFilters(all, filters({ tags: ['Jeu'] }))).toEqual([hunter, doll]);
    expect(applyFilters(all, filters({ tags: ['Outil', 'Web'] }))).toEqual([doll, beast]);
  });

  it('filtre par stack en « au moins un »', () => {
    expect(applyFilters(all, filters({ stack: ['Angular'] }))).toEqual([doll, beast]);
  });

  it('combine catégorie, tags et stack en ET', () => {
    expect(
      applyFilters(all, filters({ category: 'client', tags: ['Web'], stack: ['C#'] })),
    ).toEqual([beast]);
    expect(applyFilters(all, filters({ category: 'client', tags: ['Jeu'] }))).toEqual([]);
  });

  it('renvoie un tableau vide quand rien ne correspond', () => {
    expect(applyFilters(all, filters({ tags: ['Inconnu'] }))).toEqual([]);
  });

  it('ne mute pas le tableau source', () => {
    const snapshot = [...all];
    applyFilters(all, filters({ category: 'personal' }));
    expect(all).toEqual(snapshot);
  });
});

describe('formatProjectPeriod', () => {
  const TODAY = "aujourd'hui";

  it("renvoie « début - aujourd'hui » quand isEnd est false", () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2026-03-01'), isEnd: false }),
      'fr',
      TODAY,
    );
    expect(result).toContain(`- ${TODAY}`);
  });

  it("renvoie « début - aujourd'hui » quand isEnd est true mais dateEnd absent", () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2026-03-01'), isEnd: true }),
      'fr',
      TODAY,
    );
    expect(result).toContain(`- ${TODAY}`);
  });

  it('renvoie « début - fin » quand isEnd est true et dateEnd présent', () => {
    const result = formatProjectPeriod(
      projectWith({
        dateStart: new Date('2025-01-01'),
        dateEnd: new Date('2025-06-01'),
        isEnd: true,
      }),
      'fr',
      TODAY,
    );
    expect(result).not.toContain(TODAY);
    expect(result).toMatch(/.+ - .+/);
  });

  it('utilise un locale valide tel quel (fr)', () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'fr',
      TODAY,
    );
    // janv. en français
    expect(result.toLowerCase()).toContain('janv');
  });

  it('mappe zh vers zh-CN sans planter', () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'zh',
      TODAY,
    );
    expect(result).toContain(`- ${TODAY}`);
  });

  it('mappe ar vers ar-SA sans planter', () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'ar',
      TODAY,
    );
    expect(typeof result).toBe('string');
  });

  it('replie une langue inconnue sur en', () => {
    const unknown = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'xx',
      TODAY,
    );
    const en = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'en',
      TODAY,
    );
    expect(unknown).toBe(en);
  });
});
