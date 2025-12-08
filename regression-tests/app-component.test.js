// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');

// src/index.js defines App and renders to #root. We import it and
// render <App /> into the jsdom container to verify basic rendering.
describe('App component (src/index.js)', () => {
  let App;
  let originalEnv;

  beforeAll(() => {
    // Ensure a root element exists for ReactDOM to query
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);

    // Isolate environment for maintenance flag
    originalEnv = process.env.REACT_APP_MAINTENANCE_MODE;
    process.env.REACT_APP_MAINTENANCE_MODE = 'disabled';

    // Prevent actual websocket client listeners from running causing side effects
    // by mocking shared/graphql export used in src/index.js
    jest.mock('../shared/graphql', () => {
      const ReactApollo = require('react-apollo');
      return {
        client: {},
        // minimal wsLink mock exposing subscriptionClient with on()
        wsLink: { subscriptionClient: { on: jest.fn() } },
      };
    });

    // Mock history used by Router
    jest.mock('../src/helpers/history', () => {
      const createHistory = () => ({
        location: { search: '' },
        replace: jest.fn(),
        listen: jest.fn(),
      });
      return { history: createHistory() };
    });

    // Mock store initializer to provide a minimal Redux store
    jest.mock('../src/store', () => {
      return {
        initStore: () => ({
          dispatch: jest.fn(),
          getState: () => ({}),
          subscribe: jest.fn(),
          replaceReducer: jest.fn(),
        }),
      };
    });

    // Mock redirect handler to render a simple marker text
    jest.mock('../src/components/redirectHandler', () => {
      const React = require('react');
      return function RedirectHandler() {
        return React.createElement(
          'div',
          { 'data-testid': 'redirect-handler' },
          'RedirectHandler'
        );
      };
    });

    // Finally import the module under test after mocks
    ({ App } = require('../src/index.js'));
  });

  afterAll(() => {
    process.env.REACT_APP_MAINTENANCE_MODE = originalEnv;
    // Reset module registry to avoid leaking mocks
    jest.resetModules();
  });

  test('renders providers and RedirectHandler', () => {
    render(React.createElement(App));
    // Assert our mocked RedirectHandler is in the tree
    const marker = screen.getByTestId('redirect-handler');
    expect(marker).toBeInTheDocument();
  });
});
