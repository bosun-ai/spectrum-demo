const mockReact = require('react');

// Mock ReactDOM to intercept render/hydrate calls
jest.mock('react-dom', () => ({
  render: jest.fn(),
  hydrate: jest.fn(),
}));

// Mock react-loadable to make preloadReady resolve immediately
jest.mock('react-loadable', () => ({
  preloadReady: () => Promise.resolve(),
}));

// Mock offline-plugin/runtime to avoid side effects
jest.mock('offline-plugin/runtime', () => ({
  install: jest.fn(),
  applyUpdate: jest.fn(),
}));

// Mock shared/graphql to provide minimal client and wsLink
jest.mock('shared/graphql', () => {
  const mockOn = jest.fn();
  return {
    client: {},
    wsLink: {
      subscriptionClient: { on: mockOn },
    },
  };
});

// Mock withCurrentUser HOC to pass through component without Apollo
jest.mock('src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => props =>
    mockReact.createElement(Comp, {
      ...props,
      currentUser: null,
      isLoadingCurrentUser: false,
    }),
}));

// Minimal mock for styled-components ThemeProvider used via routes
jest.mock('styled-components', () => ({
  ThemeProvider: ({ children }) =>
    mockReact.createElement('div', null, children),
  createGlobalStyle: () => () => null,
}));

// Mock components used inside routes to simple elements to avoid heavy rendering
jest.mock('src/components/error', () => ({
  ErrorBoundary: ({ children }) =>
    mockReact.createElement('div', null, children),
}));
jest.mock('src/components/appViewWrapper', () => ({
  __esModule: true,
  default: ({ children }) => mockReact.createElement('div', null, children),
}));
jest.mock('src/components/maintenance', () => ({
  __esModule: true,
  default: () =>
    mockReact.createElement(
      'div',
      { 'data-testid': 'maintenance' },
      'Maintenance'
    ),
}));
jest.mock('src/components/head', () => ({
  __esModule: true,
  default: () => mockReact.createElement('div', null, 'Head'),
}));
jest.mock('src/components/gallery', () => ({
  __esModule: true,
  default: () => mockReact.createElement('div', null, 'Gallery'),
}));
jest.mock('src/components/toasts', () => ({
  __esModule: true,
  default: () => mockReact.createElement('div', null, 'Toasts'),
}));
jest.mock('src/views/status', () => ({
  __esModule: true,
  default: () => mockReact.createElement('div', null, 'Status'),
}));
jest.mock('src/views/navigation', () => ({
  __esModule: true,
  default: () => mockReact.createElement('div', null, 'Navigation'),
}));
jest.mock('src/views/globalTitlebar', () => ({
  __esModule: true,
  default: () => mockReact.createElement('div', null, 'GlobalTitlebar'),
}));
jest.mock('src/views/queryParamToastDispatcher', () => ({
  __esModule: true,
  default: () =>
    mockReact.createElement('div', null, 'QueryParamToastDispatcher'),
}));
jest.mock('src/components/announcementBanner', () => ({
  __esModule: true,
  default: () => mockReact.createElement('div', null, 'AnnouncementBanner'),
}));
jest.mock('src/views/thread', () => ({
  __esModule: true,
  ThreadView: () => mockReact.createElement('div', null, 'ThreadView'),
}));

// Ensure a #root element exists before requiring the module under test
beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  delete window.__SERVER_STATE__;
});

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

test('App renders into #root via ReactDOM.render', async () => {
  const ReactDOM = require('react-dom');
  // Require the entry; this should trigger preloadReady -> render
  require('../src/index.js');

  // Wait a tick for promises to resolve
  await Promise.resolve();

  expect(ReactDOM.render).toHaveBeenCalled();
  const [element, container] = ReactDOM.render.mock.calls[0];
  expect(container).toBe(document.querySelector('#root'));
  // Ensure we rendered a React element
  expect(mockReact.isValidElement(element)).toBe(true);
});

test('App respects maintenanceMode passed to RedirectHandler/Routes', async () => {
  const ReactDOM = require('react-dom');

  // Simulate maintenance mode via env
  process.env.REACT_APP_MAINTENANCE_MODE = 'enabled';
  require('../src/index.js');

  await Promise.resolve();

  // Grab the rendered tree and assert our Maintenance mock appears
  const [element] = ReactDOM.render.mock.calls[0];
  // Render the element into jsdom using RTL to inspect content
  const { render, screen } = require('@testing-library/react');
  render(element);
  expect(screen.getByTestId('maintenance')).toBeInTheDocument();
});
