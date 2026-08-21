import { NavigationError } from '@angular/router';

import { isStaleChunkError, recoverFromStaleChunk } from './navigation-recovery';

const CHROMIUM_MESSAGE = 'Failed to fetch dynamically imported module: https://x/chunk-OLD.js';
const FIREFOX_MESSAGE = 'error loading dynamically imported module: https://x/chunk-OLD.js';
const SAFARI_MESSAGE = 'Importing a module script failed.';

function navigationError(url: string, error: unknown): NavigationError {
  return new NavigationError(1, url, error);
}

describe('isStaleChunkError', () => {
  it('matches the dynamic-import failure messages of the three engines', () => {
    for (const message of [CHROMIUM_MESSAGE, FIREFOX_MESSAGE, SAFARI_MESSAGE]) {
      expect(isStaleChunkError(new TypeError(message))).withContext(message).toBeTrue();
    }
  });

  it('rejects non-TypeError values and unrelated TypeErrors', () => {
    expect(isStaleChunkError(new Error(CHROMIUM_MESSAGE))).toBeFalse();
    expect(isStaleChunkError(new TypeError('x is not a function'))).toBeFalse();
    expect(isStaleChunkError(undefined)).toBeFalse();
    expect(isStaleChunkError('boom')).toBeFalse();
  });
});

describe('recoverFromStaleChunk', () => {
  let navigate: jasmine.Spy<(url: string) => void>;

  beforeEach(() => {
    navigate = jasmine.createSpy('navigate');
    sessionStorage.removeItem('ng-chunk-reload');
  });

  afterEach(() => sessionStorage.removeItem('ng-chunk-reload'));

  it('reloads towards the target url on a stale-chunk error', () => {
    recoverFromStaleChunk(navigationError('/projects', new TypeError(CHROMIUM_MESSAGE)), navigate);
    expect(navigate).toHaveBeenCalledOnceWith('/projects');
  });

  it('ignores navigation errors that are not stale-chunk errors', () => {
    recoverFromStaleChunk(navigationError('/projects', new Error('guard rejected')), navigate);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('does not loop: a second failure on the same url within the window is swallowed', () => {
    const event = navigationError('/projects', new TypeError(CHROMIUM_MESSAGE));
    recoverFromStaleChunk(event, navigate);
    recoverFromStaleChunk(event, navigate);
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('still reloads for a different url within the window', () => {
    recoverFromStaleChunk(navigationError('/projects', new TypeError(CHROMIUM_MESSAGE)), navigate);
    recoverFromStaleChunk(navigationError('/works', new TypeError(FIREFOX_MESSAGE)), navigate);
    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate.calls.mostRecent().args[0]).toBe('/works');
  });

  it('reloads again once the loop window has expired', () => {
    sessionStorage.setItem('ng-chunk-reload', `/projects|${Date.now() - 31_000}`);
    recoverFromStaleChunk(navigationError('/projects', new TypeError(SAFARI_MESSAGE)), navigate);
    expect(navigate).toHaveBeenCalledOnceWith('/projects');
  });
});
