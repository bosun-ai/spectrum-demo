/**
 * Regression tests for src/registerServiceWorker.js
 * - verifies resolves with {newContent:true} when controller exists
 * - verifies resolves with {firstCache:true} when no controller
 * - verifies webPushManager.set called when PushManager is available
 */

const path = require('path');

describe('registerServiceWorker', () => {
  const ORIGINAL_ENV = process.env.NODE_ENV;
  let webPushManagerSetMock;

  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    process.env.PUBLIC_URL = '';

    // Mock web-push-manager default export with set spy
    webPushManagerSetMock = jest.fn();
    jest.doMock(
      path.posix.join('src', 'helpers', 'web-push-manager.js'),
      () => ({
        __esModule: true,
        default: { set: webPushManagerSetMock },
      })
    );

    // Ensure jsdom has needed globals
    Object.defineProperty(window, 'PushManager', {
      configurable: true,
      writable: true,
      value: function PushManager() {},
    });

    // Reset listeners between tests
    // jsdom Window supports addEventListener and dispatchEvent
  });

  afterEach(() => {
    process.env.NODE_ENV = ORIGINAL_ENV;
    jest.dontMock(path.posix.join('src', 'helpers', 'web-push-manager.js'));
  });

  test('resolves with newContent when controller exists and calls webPushManager.set', async () => {
    // Arrange navigator.serviceWorker with register that returns a registration
    const installing = { state: 'installing', onstatechange: null };
    const registration = {
      installing,
      pushManager: { subscribe: jest.fn() },
      onupdatefound: null,
    };

    const registerMock = jest.fn(() => Promise.resolve(registration));
    const readyPromise = Promise.resolve({ unregister: jest.fn() });

    Object.defineProperty(global, 'navigator', {
      configurable: true,
      value: {
        serviceWorker: {
          register: registerMock,
          ready: readyPromise,
          // Simulate existing controller to indicate update
          get controller() {
            return {};
          },
        },
      },
    });

    const { default: register } = require('src/registerServiceWorker.js');

    const promise = register();

    // Act: trigger window load to start registration
    window.dispatchEvent(new Event('load'));

    // Simulate update found, then state change to installed
    expect(typeof registration.onupdatefound).toBe('function');
    registration.onupdatefound();
    // when onupdatefound fires, register sets installing.onstatechange
    installing.state = 'installed';
    installing.onstatechange && installing.onstatechange();

    const result = await promise;

    // Assert
    expect(result).toEqual({ newContent: true });
    expect(webPushManagerSetMock).toHaveBeenCalledTimes(1);
    expect(webPushManagerSetMock).toHaveBeenCalledWith(
      registration.pushManager
    );
    expect(registerMock).toHaveBeenCalledWith('/service-worker.js');
  });

  test('resolves with firstCache when no controller present', async () => {
    const installing = { state: 'installing', onstatechange: null };
    const registration = {
      installing,
      pushManager: { subscribe: jest.fn() },
      onupdatefound: null,
    };
    const registerMock = jest.fn(() => Promise.resolve(registration));

    Object.defineProperty(global, 'navigator', {
      configurable: true,
      value: {
        serviceWorker: {
          register: registerMock,
          ready: Promise.resolve({ unregister: jest.fn() }),
          controller: undefined, // no controller means first precache
        },
      },
    });

    const { default: register } = require('src/registerServiceWorker.js');

    const promise = register();
    window.dispatchEvent(new Event('load'));

    registration.onupdatefound();
    installing.state = 'installed';
    installing.onstatechange && installing.onstatechange();

    const result = await promise;
    expect(result).toEqual({ firstCache: true });
  });

  test('returns resolved empty object when serviceWorker not supported', async () => {
    Object.defineProperty(global, 'navigator', {
      configurable: true,
      value: {},
    });

    const { default: register } = require('src/registerServiceWorker.js');
    await expect(register()).resolves.toEqual({});
  });
});
