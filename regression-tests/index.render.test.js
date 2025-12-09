// Regression test for src/index.js render
const React = require('react');

// Mock modules that index.js relies on but are not needed for render assertion
jest.mock('offline-plugin/runtime', () => ({
  install: jest.fn(() => {}),
  applyUpdate: jest.fn(() => {}),
}));

// Mock apollo client export used by src/index.js
jest.mock('../shared/graphql', () => {
  return {
    client: {},
    wsLink: {
      subscriptionClient: {
        on: jest.fn(),
      },
    },
  };
});

// Mock history to have predictable location/search
jest.mock('../src/helpers/history', () => {
  const location = { pathname: '/', search: '' };
  return {
    history: {
      location,
      replace: jest.fn(path => {
        // update location for any redirects
        const [pathname, search] = path.split('?');
        location.pathname = pathname;
        location.search = search ? `?${search}` : '';
      }),
      listen: jest.fn(),
      push: jest.fn(),
    },
  };
});

// Mock web push manager setter to avoid accessing service worker
jest.mock('../src/helpers/web-push-manager', () => ({ set: jest.fn() }));

// Mock RedirectHandler's child routes to a simple component for easier assertion
jest.mock('../src/hot-routes', () => () =>
  React.createElement('div', { 'data-testid': 'routes' }, 'Routes')
);

describe('src/index.js render', () => {
  let rootEl;
  let originalSW;
  let originalPushManager;

  beforeEach(() => {
    // Ensure a root element exists for ReactDOM to mount into
    rootEl = document.createElement('div');
    rootEl.setAttribute('id', 'root');
    document.body.appendChild(rootEl);

    // Ensure service worker and PushManager presence branches are predictable
    originalSW = navigator.serviceWorker;
    originalPushManager = window.PushManager;
    // Minimal stub to satisfy feature detection without triggering ready callbacks
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: Promise.resolve({ pushManager: {} }) },
      configurable: true,
    });
    Object.defineProperty(window, 'PushManager', {
      value: function() {},
      configurable: true,
    });

    // Clear server state by default to use ReactDOM.render path
    delete window.__SERVER_STATE__;
  });

  afterEach(() => {
    // Cleanup DOM
    if (rootEl && rootEl.parentNode) rootEl.parentNode.removeChild(rootEl);
    // Restore globals
    Object.defineProperty(navigator, 'serviceWorker', {
      value: originalSW,
      configurable: true,
    });
    Object.defineProperty(window, 'PushManager', {
      value: originalPushManager,
      configurable: true,
    });
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('renders application root and attaches event listeners', async () => {
    // Spy on ReactDOM.render and hydrate to observe usage
    const renderSpy = jest
      .spyOn(require('react-dom'), 'render')
      .mockImplementation(() => {});
    const hydrateSpy = jest
      .spyOn(require('react-dom'), 'hydrate')
      .mockImplementation(() => {});

    // Import after mocks so index executes with mocks in place
    await import('../src/index.js');

    // Either render or hydrate should have been called once with the App and #root
    expect(renderSpy.mock.calls.length + hydrateSpy.mock.calls.length).toBe(1);
    const call = renderSpy.mock.calls[0] || hydrateSpy.mock.calls[0];
    expect(call[1]).toBe(rootEl);

    // Assert that our simple routes placeholder is present in the tree
    // Since we stubbed ReactDOM to no-op, we can at least ensure the element exists pre-render
    // Trigger a real render now to verify DOM output without side effects
    renderSpy.mockRestore();
    const { render } = require('@testing-library/react');
    const App = call[0];
    const { getByTestId } = render(App);
    expect(getByTestId('routes')).toBeInTheDocument();

    // Verify websocket event listeners got registered
    const { wsLink } = require('../shared/graphql');
    expect(wsLink.subscriptionClient.on).toHaveBeenCalledTimes(3);
    expect(wsLink.subscriptionClient.on).toHaveBeenCalledWith(
      'disconnected',
      expect.any(Function)
    );
    expect(wsLink.subscriptionClient.on).toHaveBeenCalledWith(
      'connected',
      expect.any(Function)
    );
    expect(wsLink.subscriptionClient.on).toHaveBeenCalledWith(
      'reconnected',
      expect.any(Function)
    );
  });

  test('hydrates when __SERVER_STATE__ is present', async () => {
    window.__SERVER_STATE__ = {};
    const renderSpy = jest
      .spyOn(require('react-dom'), 'render')
      .mockImplementation(() => {});
    const hydrateSpy = jest
      .spyOn(require('react-dom'), 'hydrate')
      .mockImplementation(() => {});

    await import('../src/index.js');

    expect(hydrateSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).not.toHaveBeenCalled();
  });
});
