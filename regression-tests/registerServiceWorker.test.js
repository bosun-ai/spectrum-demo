const React = require('react');
// We don't render React here, but keep consistency with setup
const { waitFor } = require('@testing-library/react');

// Mock web-push-manager to avoid errors when PushManager exists
jest.mock('../src/helpers/web-push-manager', () => ({
  set: jest.fn(),
}));

// Load the module under test after setting env
describe('registerServiceWorker', () => {
  let originalNavigator;
  let originalAddEventListener;
  let originalPublicUrl;
  let registerServiceWorker;

  beforeEach(() => {
    // Ensure production url building doesn't throw
    originalPublicUrl = process.env.PUBLIC_URL;
    process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';
    // Track originals
    originalNavigator = global.navigator;
    originalAddEventListener = global.window.addEventListener;

    // Mock serviceWorker API
    const mockInstalling = { state: 'installing', onstatechange: null };
    const mockController = {}; // indicate existing controller
    let onUpdateFound;

    const mockRegistration = {
      installing: mockInstalling,
      onupdatefound: null,
      pushManager: {},
    };

    const serviceWorker = {
      controller: mockController,
      ready: Promise.resolve({ unregister: jest.fn() }),
      register: jest.fn(() => Promise.resolve(mockRegistration)),
    };

    // Attach to navigator
    global.navigator = {
      ...originalNavigator,
      serviceWorker,
    };

    // Mock window.addEventListener to immediately invoke load callbacks
    global.window.addEventListener = (event, cb) => {
      if (event === 'load') {
        // simulate load in next tick
        setTimeout(cb, 0);
      }
    };

    // Now import the module under test with fresh mocks
    jest.resetModules();
    registerServiceWorker = require('../src/registerServiceWorker.js');
  });

  afterEach(() => {
    // Restore env and globals
    process.env.PUBLIC_URL = originalPublicUrl;
    global.navigator = originalNavigator;
    global.window.addEventListener = originalAddEventListener;
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('resolves with newContent when update is installed with existing controller', async () => {
    const { register } = registerServiceWorker;

    const promise = register();

    // Wait until registration.onupdatefound is set
    await waitFor(() => {
      const regCall =
        global.navigator.serviceWorker.register.mock.calls.length > 0;
      expect(regCall).toBe(true);
    });

    const registration = await global.navigator.serviceWorker.register.mock
      .results[0].value;

    // Trigger updatefound
    registration.onupdatefound && registration.onupdatefound();

    // Simulate installing worker reaching installed state
    registration.installing.state = 'installed';
    registration.installing.onstatechange &&
      registration.installing.onstatechange();

    await expect(promise).resolves.toEqual({ newContent: true });
  });

  test('resolves with firstCache when installed without controller', async () => {
    // Make controller undefined to simulate first install
    global.navigator.serviceWorker.controller = undefined;

    const { register } = registerServiceWorker;
    const promise = register();

    await waitFor(() => {
      expect(global.navigator.serviceWorker.register).toHaveBeenCalled();
    });

    const registration = await global.navigator.serviceWorker.register.mock
      .results[0].value;
    registration.onupdatefound && registration.onupdatefound();
    registration.installing.state = 'installed';
    registration.installing.onstatechange &&
      registration.installing.onstatechange();

    await expect(promise).resolves.toEqual({ firstCache: true });
  });

  test('returns empty object when serviceWorker not supported', async () => {
    // Remove serviceWorker support
    global.navigator = { ...global.navigator };
    delete global.navigator.serviceWorker;

    jest.resetModules();
    const { register } = require('../src/registerServiceWorker.js');

    await expect(register()).resolves.toEqual({});
  });
});
