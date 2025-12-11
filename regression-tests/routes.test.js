const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Mock withCurrentUser to pass props through
jest.mock('src/components/withCurrentUser', () => {
  const mockReact = require('react');
  return {
    withCurrentUser: Comp => props =>
      mockReact.createElement(Comp, {
        ...props,
        currentUser: props.currentUser || null,
        isLoadingCurrentUser: props.isLoadingCurrentUser || false,
      }),
  };
});

// Robust mock for styled-components to satisfy styled.span.withConfig chains
jest.mock('styled-components', () => {
  const mockReact = require('react');
  const tag = () => () => null;
  const makeStyledTag = () => {
    const comp = () => null;
    comp.withConfig = () => comp;
    return comp;
  };
  const styledProxy = new Proxy(() => makeStyledTag(), {
    get: () => makeStyledTag(), // styled.div, styled.span, etc.
    apply: () => makeStyledTag(), // styled(Component)
  });
  return {
    ThemeProvider: ({ children }) =>
      mockReact.createElement('div', null, children),
    createGlobalStyle: tag,
    css: tag,
    keyframes: tag,
    default: styledProxy,
  };
});

// Mock out non-essential heavy components used inside routes
jest.mock('src/components/error', () => {
  const mockReact = require('react');
  return {
    ErrorBoundary: ({ children }) =>
      mockReact.createElement('div', null, children),
  };
});
jest.mock('src/components/appViewWrapper', () => ({
  __esModule: true,
  default: ({ children }) =>
    require('react').createElement('div', null, children),
}));
jest.mock('src/components/head', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', null, 'Head'),
}));
jest.mock('src/components/gallery', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', null, 'Gallery'),
}));
jest.mock('src/components/toasts', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', null, 'Toasts'),
}));
jest.mock('src/views/status', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', null, 'Status'),
}));
jest.mock('src/views/navigation', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', null, 'Navigation'),
}));
jest.mock('src/views/globalTitlebar', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', null, 'GlobalTitlebar'),
}));
jest.mock('src/views/queryParamToastDispatcher', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement('div', null, 'QueryParamToastDispatcher'),
}));
jest.mock('src/components/announcementBanner', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement('div', null, 'AnnouncementBanner'),
}));

// Mock lazy loaded views to simple components
jest.mock('src/views/explore', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'explore' },
      'Explore'
    ),
}));
jest.mock('src/views/user', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement('div', { 'data-testid': 'user' }, 'User'),
}));
jest.mock('src/views/community', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'community' },
      'Community'
    ),
}));
jest.mock('src/views/channel', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'channel' },
      'Channel'
    ),
}));
jest.mock('src/views/userSettings', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'user-settings' },
      'UserSettings'
    ),
}));
jest.mock('src/views/communitySettings', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'community-settings' },
      'CommunitySettings'
    ),
}));
jest.mock('src/views/channelSettings', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'channel-settings' },
      'ChannelSettings'
    ),
}));
jest.mock('src/views/pages', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement('div', { 'data-testid': 'pages' }, 'Pages'),
}));
jest.mock('src/components/maintenance', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'maintenance' },
      'Maintenance'
    ),
}));
jest.mock('src/views/login', () => ({
  __esModule: true,
  default: ({ redirectPath }) =>
    require('react').createElement(
      'div',
      { 'data-testid': 'login' },
      `Login to ${redirectPath || ''}`
    ),
}));
jest.mock('src/views/thread', () => ({
  __esModule: true,
  ThreadView: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'thread-view' },
      'ThreadView'
    ),
}));
jest.mock('src/views/newUserOnboarding', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'onboarding' },
      'Onboarding'
    ),
}));
jest.mock('src/views/thread/redirect-old-route', () => ({
  __esModule: true,
  default: () =>
    require('react').createElement(
      'div',
      { 'data-testid': 'redirect-old-thread' },
      'RedirectOldThread'
    ),
}));

// Routes component under test
const Routes = require('../src/routes.js').default;

describe('Routes component', () => {
  test('maintenanceMode renders Maintenance component', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/'] },
        React.createElement(Routes, { maintenanceMode: true })
      )
    );
    expect(screen.getByTestId('maintenance')).toBeInTheDocument();
  });

  test('root "/" redirects to "/explore" and renders Explore', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/'] },
        React.createElement(Routes, {})
      )
    );
    expect(screen.getByTestId('explore')).toBeInTheDocument();
  });

  test('home redirects to explore', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/home'] },
        React.createElement(Routes, {})
      )
    );
    expect(screen.getByTestId('explore')).toBeInTheDocument();
  });

  test('me redirects to login when no user and not loading', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/me'] },
        React.createElement(Routes, {
          currentUser: null,
          isLoadingCurrentUser: false,
        })
      )
    );
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  test('me redirects to user profile when user has username', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/me'] },
        React.createElement(Routes, {
          currentUser: { username: 'alice' },
          isLoadingCurrentUser: false,
        })
      )
    );
    expect(screen.getByTestId('user')).toBeInTheDocument();
  });

  test('me shows onboarding when user exists without username', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/me'] },
        React.createElement(Routes, {
          currentUser: {},
          isLoadingCurrentUser: false,
        })
      )
    );
    expect(screen.getByTestId('onboarding')).toBeInTheDocument();
  });
});
