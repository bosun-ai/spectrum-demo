/**
 * Regression test for App in src/index.js
 * Ensures the entry renders without crashing and wires env-based props.
 */

const React = require('react');

// Create a root element for ReactDOM to mount into
beforeEach(() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
});

afterEach(() => {
  const root = document.querySelector('#root');
  if (root) root.remove();
  jest.resetModules();
});

test('App renders via ReactDOM.render without crashing', async () => {
  // Ensure server state is not present so render path is used
  delete window.__SERVER_STATE__;

  // Mock modules that have side effects or complex setups
  jest.mock('react-dom', () => ({
    render: jest.fn(),
    hydrate: jest.fn(),
  }));
  jest.mock('react-loadable', () => {
    const fn = () => ({ preload: jest.fn() });
    fn.preloadReady = () => Promise.resolve();
    return fn;
  });
  jest.mock('offline-plugin/runtime', () => ({
    install: jest.fn(),
    applyUpdate: jest.fn(),
  }));
  jest.mock('src/helpers/web-push-manager', () => ({ set: jest.fn() }));
  jest.mock('shared/graphql', () => ({
    client: {},
    wsLink: { subscriptionClient: { on: jest.fn() } },
  }));
  jest.mock('src/store', () => ({
    initStore: () => ({ dispatch: jest.fn() }),
  }));
  // Mock history to avoid real navigation
  jest.mock('src/helpers/history', () => ({
    history: { location: { search: '' }, replace: jest.fn() },
  }));

  // Mock reset.css raw-loader import to avoid jest resolver issues
  jest.mock('../src/reset.css.js', () => ({}), { virtual: true });
  // Require the entry after mocks are set
  require('../src/index.js');
  const ReactDOM = require('react-dom');

  // Wait a tick for preloadReady then render to resolve
  await Promise.resolve();

  expect(ReactDOM.render).toHaveBeenCalledTimes(1);
  const [element, container] = ReactDOM.render.mock.calls[0];
  expect(container).toBe(document.querySelector('#root'));
  // Basic sanity: element is a React element
  expect(React.isValidElement(element)).toBe(true);
});

test('App uses ReactDOM.hydrate when __SERVER_STATE__ is present', async () => {
  // Simulate SSR hydration path
  window.__SERVER_STATE__ = {};

  jest.mock('react-dom', () => ({
    render: jest.fn(),
    hydrate: jest.fn(),
  }));
  jest.mock('react-loadable', () => {
    const fn = () => ({ preload: jest.fn() });
    fn.preloadReady = () => Promise.resolve();
    return fn;
  });
  jest.mock('offline-plugin/runtime', () => ({
    install: jest.fn(),
    applyUpdate: jest.fn(),
  }));
  jest.mock('src/helpers/web-push-manager', () => ({ set: jest.fn() }));
  jest.mock('shared/graphql', () => ({
    client: {},
    wsLink: { subscriptionClient: { on: jest.fn() } },
  }));
  jest.mock('src/store', () => ({
    initStore: () => ({ dispatch: jest.fn() }),
  }));
  jest.mock('src/helpers/history', () => ({
    history: { location: { search: '' }, replace: jest.fn() },
  }));

  jest.mock('../src/reset.css.js', () => ({}), { virtual: true });
  require('../src/index.js');
  const ReactDOM = require('react-dom');

  await Promise.resolve();

  expect(ReactDOM.hydrate).toHaveBeenCalledTimes(1);
  expect(ReactDOM.render).not.toHaveBeenCalled();
});

test('maintenanceMode prop respects REACT_APP_MAINTENANCE_MODE env', async () => {
  delete window.__SERVER_STATE__;
  process.env.REACT_APP_MAINTENANCE_MODE = 'enabled';

  jest.mock('react-dom', () => ({
    render: jest.fn(),
    hydrate: jest.fn(),
  }));
  jest.mock('react-loadable', () => {
    const fn = () => ({ preload: jest.fn() });
    fn.preloadReady = () => Promise.resolve();
    return fn;
  });
  jest.mock('offline-plugin/runtime', () => ({
    install: jest.fn(),
    applyUpdate: jest.fn(),
  }));
  jest.mock('src/helpers/web-push-manager', () => ({ set: jest.fn() }));
  jest.mock('shared/graphql', () => ({
    client: {},
    wsLink: { subscriptionClient: { on: jest.fn() } },
  }));
  jest.mock('src/store', () => ({
    initStore: () => ({ dispatch: jest.fn() }),
  }));

  // Spy on RedirectHandler to assert prop value
  const RedirectHandler =
    require('../src/components/redirectHandler').default ||
    require('../src/components/redirectHandler');
  const redirectSpy = jest
    .spyOn(require('../src/components/redirectHandler'), 'default', 'get')
    .mockImplementation(() => {
      const React = require('react');
      return function MockRedirectHandler(props) {
        // Expose the prop for assertion by attaching to window
        window.__MAINTENANCE_MODE__ = props.maintenanceMode;
        return React.createElement('div');
      };
    });

  // Mock history
  jest.mock('src/helpers/history', () => ({
    history: { location: { search: '' }, replace: jest.fn() },
  }));

  jest.mock('../src/reset.css.js', () => ({}), { virtual: true });
  require('../src/index.js');
  const ReactDOM = require('react-dom');
  await Promise.resolve();

  expect(ReactDOM.render).toHaveBeenCalledTimes(1);
  expect(window.__MAINTENANCE_MODE__).toBe(true);
});
