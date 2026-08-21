import { lockBodyScroll } from './scroll-lock';

describe('lockBodyScroll', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('pose overflow: hidden sur le body', () => {
    lockBodyScroll(document);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restaure la valeur précédente au déverrouillage', () => {
    document.body.style.overflow = 'scroll';
    const unlock = lockBodyScroll(document);
    expect(document.body.style.overflow).toBe('hidden');
    unlock();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('gère les verrous imbriqués en ordre LIFO', () => {
    const unlockOuter = lockBodyScroll(document); // modal
    const unlockInner = lockBodyScroll(document); // lightbox au-dessus
    unlockInner();
    expect(document.body.style.overflow).toBe('hidden'); // le modal reste verrouillé
    unlockOuter();
    expect(document.body.style.overflow).toBe('');
  });
});
