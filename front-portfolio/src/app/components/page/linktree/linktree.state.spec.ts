import { LINKTREE_SECTIONS } from './linktree.state';

describe('LINKTREE_SECTIONS', () => {
  const allLinks = LINKTREE_SECTIONS.flatMap((s) => s.links);

  it('defines four roman-numbered sections', () => {
    expect(LINKTREE_SECTIONS.map((s) => s.numeral)).toEqual(['I', 'II', 'III', 'IV']);
  });

  it('uses unique section ids', () => {
    const ids = LINKTREE_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses globally unique link ids', () => {
    const ids = allLinks.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exposes only known icon kinds', () => {
    const kinds = new Set(allLinks.map((l) => l.icon.kind));
    kinds.forEach((kind) => expect(['picture', 'svg', 'emoji']).toContain(kind));
  });

  it('provides sources + fallback for every picture icon', () => {
    allLinks
      .filter((l) => l.icon.kind === 'picture')
      .forEach((l) => {
        expect(l.icon.sources?.length).toBeGreaterThan(0);
        expect(l.icon.fallback).toBeTruthy();
      });
  });

  it('provides an svg key for every svg icon', () => {
    allLinks
      .filter((l) => l.icon.kind === 'svg')
      .forEach((l) => expect(l.icon.svg).toBeTruthy());
  });

  it('marks the CV link as a local download and not external', () => {
    const cv = allLinks.find((l) => l.id === 'cv');
    expect(cv).toBeDefined();
    expect(cv!.download).toBeTrue();
    expect(cv!.external).toBeFalse();
    expect(cv!.href.startsWith('/')).toBeTrue();
  });

  it('keeps the email link as a non-external mailto', () => {
    const email = allLinks.find((l) => l.id === 'email');
    expect(email!.external).toBeFalse();
    expect(email!.href.startsWith('mailto:')).toBeTrue();
  });

  it('gives external links absolute https hrefs', () => {
    allLinks
      .filter((l) => l.external)
      .forEach((l) => expect(l.href.startsWith('https://')).toBeTrue());
  });
});
