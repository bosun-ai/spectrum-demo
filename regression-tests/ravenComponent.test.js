// Regression test for shared/raven/index.js
// Validates mocking in development and real config in production-like env

const path = require('path');

// Helper to require the module fresh with controlled env
const loadRaven = (envOverrides = {}, forceReset = true) => {
  const targetPath = path.resolve(process.cwd(), 'shared/raven/index.js');
  if (forceReset) {
    // purge from require cache to re-evaluate env branch
    Object.keys(require.cache).forEach(k => {
      if (k.includes(path.join('shared', 'raven', 'index.js'))) {
        delete require.cache[k];
      }
    });
  }
  const originalEnv = { ...process.env };
  Object.assign(process.env, envOverrides);
  // require fresh
  const mod = require(targetPath);
  // restore env to avoid leaks
  process.env = originalEnv;
  return mod && mod.default ? mod.default : mod;
};

describe('shared/raven', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('mocks Raven API in non-production env', () => {
    const raven = loadRaven({
      NODE_ENV: 'test',
      FORCE_DEV: '',
      SENTRY_DSN_SERVER: '',
    });
    expect(raven).toBeDefined();
    // Should have mock methods
    expect(typeof raven.captureException).toBe('function');
    expect(typeof raven.setUserContext).toBe('function');
    // config().install should be a function (noop)
    const cfg = raven.config('dummy');
    expect(typeof cfg.install).toBe('function');
    // requestHandler should return a middleware that calls next
    const mw = raven.requestHandler();
    const next = jest.fn();
    mw({}, {}, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('uses real raven in production when SENTRY_DSN_SERVER is set', () => {
    // Stub raven module so production branch is selected without real DSN parsing
    jest.resetModules();
    const fakeRaven = {
      config: jest.fn(() => ({ install: jest.fn() })),
      requestHandler: jest.fn(() => (req, res, next) => next()),
      captureException: jest.fn(),
    };
    jest.doMock('raven', () => fakeRaven);
    const raven = loadRaven({
      NODE_ENV: 'production',
      SENTRY_DSN_SERVER: 'http://dummy-dsn',
      SENTRY_NAME: 'regression-test',
    });
    expect(raven).toBeDefined();
    expect(fakeRaven.config).toHaveBeenCalled();
    expect(typeof raven.requestHandler).toBe('function');
    expect(typeof raven.captureException).toBe('function');
  });
});
