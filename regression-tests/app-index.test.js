// Regression test for App component in src/index.js
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock modules used by App to keep rendering lightweight in tests
jest.mock('react-dom', () => ({
  render: jest.fn(),
  hydrate: jest.fn(),
}));

// Mock shared/graphql wsLink to avoid accessing real websocket client
jest.mock('shared/graphql', () => {
  const original = jest.requireActual('../shared/graphql');
  return {
    ...original,
    wsLink: {
      subscriptionClient: {
        on: jest.fn(),
      },
    },
    client: original.client,
  };
});

// Mock web push manager to avoid touching browser APIs
jest.mock('../src/helpers/web-push-manager', () => ({
  set: jest.fn(),
}));

// Mock Routes to expose maintenanceMode prop assertion via test id
jest.mock('../src/hot-routes', () => props =>
  React.createElement('div', {
    'data-testid': 'routes',
    'data-maintenance': String(!!props.maintenanceMode),
  })
);

// Import App from src/index.js (named export)
const { App } = require('../src/index.js');

describe('App (src/index.js)', () => {
  beforeEach(() => {
    // Ensure a root node exists for rendering
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  });

  afterEach(() => {
    const root = document.querySelector('#root');
    if (root) root.remove();
  });

  it('renders RedirectHandler via Routes and respects maintenance mode disabled', () => {
    process.env.REACT_APP_MAINTENANCE_MODE = undefined;
    render(React.createElement(App));
    const routes = screen.getByTestId('routes');
    expect(routes).toBeInTheDocument();
    // maintenance mode should be false when env var not enabled
    expect(routes.getAttribute('data-maintenance')).toBe('false');
  });

  it('passes maintenanceMode=true when REACT_APP_MAINTENANCE_MODE="enabled"', () => {
    process.env.REACT_APP_MAINTENANCE_MODE = 'enabled';
    render(React.createElement(App));
    const routes = screen.getByTestId('routes');
    expect(routes).toBeInTheDocument();
    expect(routes.getAttribute('data-maintenance')).toBe('true');
  });
});
