const React = require('react');
// Use React DOM to query rather than RTL to avoid legacy test-utils issues
const { screen } = require('@testing-library/dom');

// src/index.js defines App inline, but it isn't exported.
// For regression, we verify the top-level render path mounts RedirectHandler
// with maintenanceMode flag derived from REACT_APP_MAINTENANCE_MODE.

// Mock heavy externals to avoid network/stateful side effects in jsdom
jest.mock('react-dom', () => ({ render: jest.fn(), hydrate: jest.fn() }));
jest.mock('react-loadable', () => ({ preloadReady: () => Promise.resolve() }));
jest.mock('offline-plugin/runtime', () => ({
  install: jest.fn(),
  applyUpdate: jest.fn(),
}));
jest.mock('src/helpers/web-push-manager', () => ({ set: jest.fn() }));
jest.mock('src/helpers/history', () => ({
  history: { location: { search: '' }, replace: jest.fn() },
}));
jest.mock('shared/graphql', () => ({
  client: {},
  wsLink: { subscriptionClient: { on: jest.fn() } },
}));
jest.mock('src/store', () => ({ initStore: () => ({ dispatch: jest.fn() }) }));

// Light-weight mock for RedirectHandler that renders a marker element
jest.mock('src/components/redirectHandler', () => {
  const React = require('react');
  return function RedirectHandler(props) {
    return React.createElement('div', {
      'data-testid': 'redirect-handler',
      'data-maintenance': String(!!props.maintenanceMode),
    });
  };
});

// Ensure globals expected by src/index.js
beforeEach(() => {
  // Simulate SSR vs CSR by clearing __SERVER_STATE__
  delete window.__SERVER_STATE__;
});

test('App renders and passes maintenanceMode=false by default', async () => {
  process.env.REACT_APP_MAINTENANCE_MODE = '';
  // Require src/index.js after env/globals setup
  require('../src/index.js');
  // Render the App by manually creating the element tree matching src/index.js
  // Since index.js uses ReactDOM.render inside render(), we instead assert that
  // our RedirectHandler mock is mounted with expected prop when index.js runs.
  // The mock renders a test-id we can query.
  // Loadable.preloadReady() triggers render in index.js; it resolves immediately by our mock.
  // Give microtasks a tick
  await Promise.resolve();
  const marker = screen.getByTestId('redirect-handler');
  expect(marker).toBeInTheDocument();
  expect(marker.getAttribute('data-maintenance')).toBe('false');
});

test('App sets maintenanceMode=true when env enabled', async () => {
  process.env.REACT_APP_MAINTENANCE_MODE = 'enabled';
  // Re-require to get fresh module evaluation with new env
  jest.resetModules();
  require('../src/index.js');
  await Promise.resolve();
  const marker = screen.getByTestId('redirect-handler');
  expect(marker).toBeInTheDocument();
  expect(marker.getAttribute('data-maintenance')).toBe('true');
});
