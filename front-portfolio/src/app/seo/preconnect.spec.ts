import { appendPreconnect } from './preconnect';

describe('appendPreconnect', () => {
  let doc: Document;

  beforeEach(() => {
    doc = document.implementation.createHTMLDocument('preconnect');
  });

  const links = () => Array.from(doc.head.querySelectorAll('link[rel="preconnect"]'));

  it('ajoute un preconnect vers une origine distante', () => {
    appendPreconnect(doc, 'https://images.example.com');

    expect(links().map((l) => l.getAttribute('href'))).toEqual(['https://images.example.com']);
  });

  it('ne duplique pas un preconnect déjà présent (hydratation après prérendu)', () => {
    appendPreconnect(doc, 'https://images.example.com');
    appendPreconnect(doc, 'https://images.example.com');

    expect(links().length).toBe(1);
  });

  it("n'ajoute rien quand les images sont servies par l'origine du site (/img)", () => {
    appendPreconnect(doc, '/img');

    expect(links().length).toBe(0);
  });
});
