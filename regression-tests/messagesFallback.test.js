const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');

// Make withCurrentUser a no-op HOC so Routes renders without Apollo/ApolloProvider
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));

// Mock redux-connected or app-level components that expect Providers
jest.mock('../src/views/status', () => () => null);
jest.mock('../src/components/toasts', () => () => null);
jest.mock('../src/components/gallery', () => () => null);
jest.mock('../src/components/modals/modalRoot', () => () => null);
jest.mock('../src/views/globalTitlebar', () => () => null);
jest.mock('../src/components/announcementBanner', () => () => null);
jest.mock('../src/components/head', () => () => null);
jest.mock('../src/reset.css.js', () => () => null);
jest.mock('../src/components/message/threadAttachment/style', () => ({
  GlobalThreadAttachmentStyles: () => null,
}));
jest.mock('../shared/theme', () => ({ theme: {} }));
jest.mock('../src/components/globals', () => () => null);
jest.mock('../src/views/threadSlider', () => () => null);
jest.mock('../src/components/icon', () => () => null);
jest.mock('../src/components/button', () => () => null);
jest.mock('../src/components/avatar', () => () => null);
jest.mock('../src/components/layout', () => () => null);
jest.mock('../src/views/navigation', () => () => null);
jest.mock('../src/components/illustrations', () => () => null);
jest.mock('../src/components/fullscreenView', () => () => null);
// Mock view helpers that pull styled-components theme
jest.mock('../src/views/viewHelpers', () => ({ LoadingView: () => null }));
jest.mock('../src/views/viewHelpers/errorView', () => () => null);
jest.mock('../src/views/viewHelpers/style', () => ({}));
// Mock pages and maintenance to avoid styled-components theme usage
jest.mock('../src/views/pages', () => () => null);
jest.mock('../src/components/maintenance', () => () => null);
// Mock NewUserOnboarding to avoid pulling formElements styled-components
jest.mock('../src/views/newUserOnboarding', () => () => null);

// DirectMessages mock that renders a recognizable marker
jest.mock('../src/views/directMessages', () => () => {
  const ReactLocal = require('react');
  return ReactLocal.createElement(
    'div',
    { 'data-testid': 'direct-messages' },
    'Direct Messages View'
  );
});

// Mock Login view to render recognizable provider text
jest.mock('../src/views/login', () => () => {
  const ReactLocal = require('react');
  return ReactLocal.createElement('div', null, [
    'Continue with GitHub',
    'Continue with Google',
    'Continue with Twitter',
    'Continue with Facebook',
  ]);
});

// Provide a trivial ErrorBoundary passthrough
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
}));
jest.mock('../src/components/viewError', () => () => null);

// Simplify AppViewWrapper to a div passthrough
jest.mock('../src/components/appViewWrapper', () => {
  const ReactLocal = require('react');
  return function AppViewWrapperMock(props) {
    return ReactLocal.createElement('div', props);
  };
});
// Mock QueryParamToastDispatcher to avoid needing Redux provider
jest.mock('../src/views/queryParamToastDispatcher', () => () => null);

// Helper to render at a route with controllable auth state
function renderAt(route, { authed = false } = {}) {
  // Force specific authenticated state in AuthViewHandler
  jest.doMock('../src/views/authViewHandler', () => ({ children }) =>
    children(authed)
  );

  // Import routes after setting auth mock
  const AppRoutes = require('../src/routes').default;

  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(Route, { component: AppRoutes })
    )
  );
}

test('MessagesFallback renders Login when unauthenticated on /messages', () => {
  renderAt('/messages', { authed: false });

  const providers = [
    /continue with github/i,
    /continue with google/i,
    /continue with twitter/i,
    /continue with facebook/i,
  ];

  const foundAny = providers.some(re => {
    try {
      return !!screen.getByText(re);
    } catch (_) {
      return false;
    }
  });

  expect(foundAny).toBe(true);
});

test('MessagesFallback renders DirectMessages when authenticated on /messages', () => {
  renderAt('/messages', { authed: true });
  expect(screen.getByTestId('direct-messages')).toBeTruthy();
});
