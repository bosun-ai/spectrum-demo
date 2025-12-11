// Regression test for shared/middlewares/raven.js
// Ensures it exports a connect-style middleware from Raven.requestHandler

const path = require('path');

// Helper: load the middleware fresh to avoid module cache interference
const loadMiddleware = (envOverrides = {}, forceReset = true) => {
  const targetPath = path.resolve(process.cwd(), 'shared/middlewares/raven.js');
  if (forceReset) {
    Object.keys(require.cache).forEach(k => {
      if (k.includes(path.join('shared', 'middlewares', 'raven.js'))) {
        delete require.cache[k];
      }
    });
    // also clear shared/raven to allow env-dependent branch selection
    Object.keys(require.cache).forEach(k => {
      if (k.includes(path.join('shared', 'raven', 'index.js'))) {
        delete require.cache[k];
      }
    });
  }
  const originalEnv = { ...process.env };
  Object.assign(process.env, envOverrides);
  const mod = require(targetPath);
  process.env = originalEnv;
  return mod && mod.default ? mod.default : mod;
};

describe('shared/middlewares/raven', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('exports a middleware that calls next', () => {
    const mw = loadMiddleware({ NODE_ENV: 'test', FORCE_DEV: '' });
    expect(typeof mw).toBe('function');
    const next = jest.fn();
    // Express-style signature: (req, res, next)
    mw({}, {}, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('production-like env still yields a function', () => {
    // Mock raven lib to avoid real setup and ensure requestHandler returns a function
    jest.resetModules();
    const fakeRaven = {
      config: jest.fn(() => ({ install: jest.fn() })),
      requestHandler: jest.fn(() => (req, res, next) => next()),
    };
    jest.doMock('raven', () => fakeRaven);
    const mw = loadMiddleware({
      NODE_ENV: 'production',
      SENTRY_DSN_SERVER: 'http://dummy',
      SENTRY_NAME: 'regression-test',
    });
    expect(typeof mw).toBe('function');
    const next = jest.fn();
    mw({}, {}, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(fakeRaven.requestHandler).toHaveBeenCalled();
  });
});
