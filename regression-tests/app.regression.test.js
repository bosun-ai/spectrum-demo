// Regression test for App in src/index.js
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock heavy dependencies to avoid side effects during render
jest.mock('react-dom', () => ({
  render: jest.fn(),
  hydrate: jest.fn(),
}));
jest.mock('react-loadable', () => ({
  preloadReady: () => Promise.resolve(),
}));
jest.mock('offline-plugin/runtime', () => ({
  install: jest.fn(),
  applyUpdate: jest.fn(),
}));
jest.mock('src/helpers/web-push-manager', () => ({ set: jest.fn() }));

// Mock graphql client and wsLink to avoid network activity
jest.mock('shared/graphql', () => ({
  client: {},
  wsLink: { subscriptionClient: { on: jest.fn() } },
}));

// Mock history with minimal interface used by the component
jest.mock('src/helpers/history', () => ({
  history: { location: { search: '' }, replace: jest.fn() },
}));

// Mock store initializer to return a minimal store
jest.mock('src/store', () => ({
  initStore: () => ({ dispatch: jest.fn() }),
}));

// Mock RedirectHandler to inspect props passed
jest.mock('src/components/redirectHandler', () => {
  const React = require('react');
  return function RedirectHandler(props) {
    return React.createElement('div', {
      'data-testid': 'redirect-handler',
      ...props,
    });
  };
});

describe('App regression', () => {
  beforeEach(() => {
    // Ensure clean env for each test
    delete process.env.REACT_APP_MAINTENANCE_MODE;
    // Clear server state flags
    delete global.window.__SERVER_STATE__;
    // jsdom root element for render target
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.innerHTML = '';
    document.body.appendChild(root);
    // Remove serviceWorker presence to avoid side-effect path
    delete navigator.serviceWorker;
    delete window.PushManager;
  });

  it('renders App and passes maintenanceMode correctly when disabled', async () => {
    // Ensure maintenance mode is not enabled
    process.env.REACT_APP_MAINTENANCE_MODE = 'disabled';
    const { App } = require('../src/index.js');
    render(React.createElement(App));
    const handler = screen.getByTestId('redirect-handler');
    expect(handler).toBeTruthy();
    // maintenanceMode should be false when not 'enabled'
    expect(handler.getAttribute('maintenanceMode')).toBe('false');
  });

  it('sets maintenanceMode true when REACT_APP_MAINTENANCE_MODE=enabled', async () => {
    process.env.REACT_APP_MAINTENANCE_MODE = 'enabled';
    const { App } = require('../src/index.js');
    render(React.createElement(App));
    const handler = screen.getByTestId('redirect-handler');
    expect(handler).toBeTruthy();
    expect(handler.getAttribute('maintenanceMode')).toBe('true');
  });
});
