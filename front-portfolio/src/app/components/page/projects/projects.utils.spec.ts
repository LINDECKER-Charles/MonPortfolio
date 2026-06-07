import { formatProjectPeriod } from './projects.utils';
import { ProjectItem } from './projects.state';

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

describe('formatProjectPeriod', () => {
  const TODAY = "aujourd'hui";

  it("renvoie « début - aujourd'hui » quand isEnd est false", () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2026-03-01'), isEnd: false }),
      'fr',
      TODAY
    );
    expect(result).toContain(`- ${TODAY}`);
  });

  it("renvoie « début - aujourd'hui » quand isEnd est true mais dateEnd absent", () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2026-03-01'), isEnd: true }),
      'fr',
      TODAY
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
      TODAY
    );
    expect(result).not.toContain(TODAY);
    expect(result).toMatch(/.+ - .+/);
  });

  it('utilise un locale valide tel quel (fr)', () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'fr',
      TODAY
    );
    // janv. en français
    expect(result.toLowerCase()).toContain('janv');
  });

  it('mappe zh vers zh-CN sans planter', () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'zh',
      TODAY
    );
    expect(result).toContain(`- ${TODAY}`);
  });

  it('mappe ar vers ar-SA sans planter', () => {
    const result = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'ar',
      TODAY
    );
    expect(typeof result).toBe('string');
  });

  it('replie une langue inconnue sur en', () => {
    const unknown = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'xx',
      TODAY
    );
    const en = formatProjectPeriod(
      projectWith({ dateStart: new Date('2025-01-15'), isEnd: false }),
      'en',
      TODAY
    );
    expect(unknown).toBe(en);
  });
});
