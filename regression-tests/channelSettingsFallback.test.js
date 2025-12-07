const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');

// Import the app Routes which defines ChannelSettingsFallback
// Mock withCurrentUser HOC to avoid ApolloProvider requirement
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));

// Mock redux-connected components that require Provider
jest.mock('../src/views/status', () => () => null);
jest.mock('../src/components/toasts', () => () => null);
jest.mock('../src/components/gallery', () => () => null);
jest.mock('../src/components/modals/modalRoot', () => () => null);
jest.mock('../src/views/globalTitlebar', () => () => null);
jest.mock('../src/components/announcementBanner', () => () => null);
jest.mock('../src/components/head', () => () => null);
jest.mock('../src/components/appViewWrapper', () => {
  const ReactLocal = require('react');
  return function AppViewWrapperMock(props) {
    return ReactLocal.createElement('div', props);
  };
});
jest.mock('../src/views/authViewHandler', () => {
  // Always unauthenticated to trigger fallback
  return ({ children }) => children(false);
});

// Import after mocks so HOCs are neutralized
const AppRoutes = require('../src/routes').default;

// Helper to render with a given initial route
function renderAt(route) {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(Route, { component: AppRoutes })
    )
  );
}

test('ChannelSettingsFallback renders Login for unauthenticated users', () => {
  // Use a plausible community/channel settings route
  renderAt('/reactiflux/general/settings');

  // The signedOutFallback for ChannelSettingsFallback renders <Login /> without redirectPath
  // The Login component renders buttons with provider names; assert a stable bit of UI text.
  // We look for common provider button labels defined in src/components/loginButtonSet
  const providers = [
    /continue with github/i,
    /continue with google/i,
    /continue with twitter/i,
    /continue with facebook/i,
  ];

  const foundAny = providers.some(re => {
    try {
      return screen.getByText(re);
    } catch (_) {
      return false;
    }
  });

  expect(foundAny).toBe(true);
});
