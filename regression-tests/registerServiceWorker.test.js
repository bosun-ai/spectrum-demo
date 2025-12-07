const React = require('react');

describe('registerServiceWorker fallback', () => {
  test('returns empty object when serviceWorker not supported', async () => {
    jest.resetModules();
    const originalNavigator = global.navigator;
    // Remove serviceWorker support
    global.navigator = { ...originalNavigator };
    delete global.navigator.serviceWorker;

    const { register } = require('../src/registerServiceWorker.js');
    await expect(register()).resolves.toEqual({});
    // Restore
    global.navigator = originalNavigator;
  });
});
