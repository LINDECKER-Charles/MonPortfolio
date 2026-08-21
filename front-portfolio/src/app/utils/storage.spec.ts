import { safeGet, safeSet } from './storage';

describe('storage utils', () => {
  const KEY = 'storage-spec.key';

  afterEach(() => {
    localStorage.removeItem(KEY);
  });

  it('safeSet then safeGet round-trips a value', () => {
    safeSet(KEY, 'echo');
    expect(safeGet(KEY)).toBe('echo');
  });

  it('safeGet returns null for a missing key', () => {
    expect(safeGet(KEY)).toBeNull();
  });

  it('safeGet returns null when localStorage.getItem throws (stockage refuse)', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('SecurityError');
    expect(safeGet(KEY)).toBeNull();
  });

  it('safeSet swallows a throwing localStorage.setItem', () => {
    spyOn(Storage.prototype, 'setItem').and.throwError('SecurityError');
    expect(() => safeSet(KEY, 'echo')).not.toThrow();
  });
});
