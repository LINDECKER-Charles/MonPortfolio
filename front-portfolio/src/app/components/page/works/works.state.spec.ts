import {
  CERTIFICATIONS,
  EDUCATIONS,
  EXPERIENCES,
  buildTimeline,
  computeStats,
  timelineCounts,
} from './works.state';

describe('buildTimeline', () => {
  it('insère un marqueur d\'année en tête puis les nœuds (ordre récent)', () => {
    const rows = buildTimeline('recent', 'all');
    expect(rows[0].type).toBe('year');
    const nodeCount = rows.filter((r) => r.type === 'node').length;
    expect(nodeCount).toBe(EXPERIENCES.length + EDUCATIONS.length);
  });

  it('trie en ordre décroissant pour « recent »', () => {
    const years = buildTimeline('recent', 'all')
      .filter((r): r is { type: 'year'; year: string } => r.type === 'year')
      .map((r) => r.year);
    const sorted = [...years].sort((a, b) => b.localeCompare(a));
    expect(years).toEqual(sorted);
  });

  it('trie en ordre croissant pour « old »', () => {
    const years = buildTimeline('old', 'all')
      .filter((r): r is { type: 'year'; year: string } => r.type === 'year')
      .map((r) => r.year);
    const sorted = [...years].sort((a, b) => a.localeCompare(b));
    expect(years).toEqual(sorted);
  });

  it('scope « volunteer » ne garde que les expériences bénévoles', () => {
    const rows = buildTimeline('recent', 'volunteer');
    const nodes = rows.filter((r) => r.type === 'node');
    expect(nodes.length).toBe(EXPERIENCES.filter((e) => e.volunteer).length);
    for (const row of nodes) {
      if (row.type === 'node' && row.node.kind === 'experience') {
        expect(row.node.exp.volunteer).toBeTrue();
      } else {
        fail('attendu uniquement des expériences');
      }
    }
  });

  it('scope « pro » garde les expériences non bénévoles + les formations', () => {
    const rows = buildTimeline('recent', 'pro');
    const nodes = rows.filter((r) => r.type === 'node');
    const expectedExp = EXPERIENCES.filter((e) => !e.volunteer).length;
    expect(nodes.length).toBe(expectedExp + EDUCATIONS.length);
    const hasEducation = nodes.some(
      (r) => r.type === 'node' && r.node.kind === 'education'
    );
    expect(hasEducation).toBeTrue();
  });

  it('scope « volunteer » exclut les formations', () => {
    const rows = buildTimeline('recent', 'volunteer');
    const hasEducation = rows.some(
      (r) => r.type === 'node' && r.node.kind === 'education'
    );
    expect(hasEducation).toBeFalse();
  });

  it('utilise « all » par défaut quand le scope est omis', () => {
    const rows = buildTimeline('recent');
    const nodeCount = rows.filter((r) => r.type === 'node').length;
    expect(nodeCount).toBe(EXPERIENCES.length + EDUCATIONS.length);
  });
});

describe('timelineCounts', () => {
  it('compte chaque périmètre cohéremment avec buildTimeline', () => {
    const counts = timelineCounts();
    expect(counts.all).toBe(EXPERIENCES.length + EDUCATIONS.length);
    expect(counts.volunteer).toBe(EXPERIENCES.filter((e) => e.volunteer).length);
    expect(counts.pro).toBe(EXPERIENCES.filter((e) => !e.volunteer).length + EDUCATIONS.length);
    expect(counts.all).toBe(counts.pro + counts.volunteer);
  });
});

describe('computeStats', () => {
  it('agrège expériences, organismes uniques, formations et certifications', () => {
    const stats = computeStats();
    const byKey = Object.fromEntries(stats.map((s) => [s.key, s.value]));

    expect(byKey['experiences']).toBe(EXPERIENCES.length);
    expect(byKey['formations']).toBe(EDUCATIONS.length);
    expect(byKey['certifications']).toBe(CERTIFICATIONS.length);

    const uniqueOrganisms = new Set([
      ...EXPERIENCES.map((e) => e.organism),
      ...EDUCATIONS.map((e) => e.organism),
    ]);
    expect(byKey['organisms']).toBe(uniqueOrganisms.size);
  });
});
