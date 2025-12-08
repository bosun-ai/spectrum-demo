/* eslint-env jest */

// Regression test for the App component in src/index.js
// Uses React.createElement to avoid JSX and aligns with Testing Library v8

const React = require('react');
const { render, cleanup } = require('@testing-library/react');

// Import the minimal component tree: RedirectHandler inside Router
const { Router } = require('react-router');
const createHistory = require('history').createMemoryHistory;
const RedirectHandler = require('../src/components/redirectHandler').default;

describe('App component', () => {
  let originalPushManager;
  let originalServiceWorker;
  let originalProcessEnv;

  beforeEach(() => {
    // Prevent service worker / push manager interactions in jsdom
    originalPushManager = window.PushManager;
    originalServiceWorker = navigator.serviceWorker;
    window.PushManager = undefined;
    navigator.serviceWorker = undefined;

    // Stabilize env for maintenance mode logic
    originalProcessEnv = process.env.REACT_APP_MAINTENANCE_MODE;
    delete process.env.REACT_APP_MAINTENANCE_MODE;
  });

  afterEach(() => {
    cleanup();
    window.PushManager = originalPushManager;
    navigator.serviceWorker = originalServiceWorker;
    if (originalProcessEnv === undefined) {
      delete process.env.REACT_APP_MAINTENANCE_MODE;
    } else {
      process.env.REACT_APP_MAINTENANCE_MODE = originalProcessEnv;
    }
  });

  it('renders without crashing in a minimal Router', () => {
    const history = createHistory();
    const element = React.createElement(
      Router,
      { history },
      React.createElement(RedirectHandler, { maintenanceMode: false })
    );
    const { container } = render(element);
    expect(container).toBeInTheDocument();
  });

  it('respects maintenance mode flag', () => {
    process.env.REACT_APP_MAINTENANCE_MODE = 'enabled';
    const history = createHistory();
    const element = React.createElement(
      Router,
      { history },
      React.createElement(RedirectHandler, { maintenanceMode: true })
    );
    const { container } = render(element);
    // Maintenance mode renders Maintenance component; assert text present
    expect(container.textContent).toMatch(/Maintenance/i);
  });
});
