const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');

// Make withCurrentUser a no-op HOC so Routes renders without ApolloProvider
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

// Provide a trivial ThemeProvider to avoid styled-components theme requirements
// Also mock error boundary and viewError to avoid styled-components usage deep in tree
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

// Force unauthenticated state so signedOutFallback renders <Login />
jest.mock('../src/views/authViewHandler', () => ({ children }) =>
  children(false)
);

// Import app routes after mocks so fallbacks use our mocked environment
const AppRoutes = require('../src/routes').default;

function renderAt(route) {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(Route, { component: AppRoutes })
    )
  );
}

test('CommunitySettingsFallback renders Login for unauthenticated users', () => {
  // Route that hits CommunitySettingsFallback
  renderAt('/reactiflux/settings');

  // The Login view renders provider buttons; assert at least one appears
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
