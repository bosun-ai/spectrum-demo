const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the composed export (with HOCs applied)
const Routes = require('../src/routes.js').default;

// Minimal mocks for dependencies that render heavy trees but are not under test
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) =>
    React.createElement(React.Fragment, null, children),
}));

jest.mock('../src/components/head', () => () =>
  React.createElement('div', { 'data-testid': 'head' })
);
jest.mock('../src/components/appViewWrapper', () => props =>
  React.createElement(
    'div',
    { 'data-testid': 'appViewWrapper' },
    props.children
  )
);
jest.mock('../src/components/scrollManager', () => ({ children }) =>
  React.createElement('div', null, children)
);
jest.mock('../src/components/modals/modalRoot', () => () =>
  React.createElement('div', { 'data-testid': 'modal-root' })
);
jest.mock('../src/components/gallery', () => () =>
  React.createElement('div', { 'data-testid': 'gallery' })
);
jest.mock('../src/components/toasts', () => () =>
  React.createElement('div', { 'data-testid': 'toasts' })
);
jest.mock('../src/views/threadSlider', () => () =>
  React.createElement('div', { 'data-testid': 'thread-slider' })
);
jest.mock('../src/components/announcementBanner', () => () =>
  React.createElement('div', { 'data-testid': 'announcement' })
);
jest.mock('../src/views/navigation', () => () =>
  React.createElement('div', { 'data-testid': 'navigation' })
);
jest.mock('../src/views/status', () => () =>
  React.createElement('div', { 'data-testid': 'status' })
);
jest.mock('../src/views/login', () => () =>
  React.createElement('div', { 'data-testid': 'login' })
);
jest.mock('../src/views/directMessages', () => () =>
  React.createElement('div', { 'data-testid': 'direct-messages' })
);
jest.mock('../src/views/thread', () => ({
  ThreadView: () =>
    React.createElement('div', { 'data-testid': 'thread-view' }),
}));
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => props =>
    React.createElement(Comp, {
      ...props,
      currentUser: null,
      isLoadingCurrentUser: false,
    }),
}));
jest.mock('../src/components/maintenance', () => () =>
  React.createElement('div', { 'data-testid': 'maintenance' })
);
jest.mock('../src/views/thread/redirect-old-route', () => () =>
  React.createElement('div', { 'data-testid': 'redirect-old-thread' })
);
jest.mock('../src/views/newUserOnboarding', () => () =>
  React.createElement('div', { 'data-testid': 'new-user-onboarding' })
);
jest.mock('../src/views/queryParamToastDispatcher', () => () =>
  React.createElement('div', { 'data-testid': 'query-param-toast-dispatcher' })
);
jest.mock('../src/views/viewHelpers', () => ({
  LoadingView: () =>
    React.createElement('div', { 'data-testid': 'loading-view' }),
}));
jest.mock('../src/views/globalTitlebar', () => () =>
  React.createElement('div', { 'data-testid': 'global-titlebar' })
);

// React Loadable targets - mock to simple components to avoid dynamic import behavior in tests
jest.mock('../src/views/explore', () => () =>
  React.createElement('div', { 'data-testid': 'explore' })
);
jest.mock('../src/views/user', () => () =>
  React.createElement('div', { 'data-testid': 'user-view' })
);
jest.mock('../src/views/community', () => () =>
  React.createElement('div', { 'data-testid': 'community-view' })
);
jest.mock('../src/views/channel', () => () =>
  React.createElement('div', { 'data-testid': 'channel-view' })
);
jest.mock('../src/views/userSettings', () => () =>
  React.createElement('div', { 'data-testid': 'user-settings' })
);
jest.mock('../src/views/communitySettings', () => () =>
  React.createElement('div', { 'data-testid': 'community-settings' })
);
jest.mock('../src/views/channelSettings', () => () =>
  React.createElement('div', { 'data-testid': 'channel-settings' })
);
jest.mock('../src/views/pages', () => () =>
  React.createElement('div', { 'data-testid': 'pages' })
);

// Theme and global styles can be safely mocked out
jest.mock('../shared/theme', () => ({ theme: {} }));
jest.mock('../src/reset.css.js', () => () => null);
jest.mock('../src/components/message/threadAttachment/style', () => ({
  GlobalThreadAttachmentStyles: () => null,
}));

describe('Routes compose regression', () => {
  test('renders without crashing and redirects / to /explore', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/'] },
        React.createElement(Routes, { location: { pathname: '/' } })
      )
    );

    // Navigation and titlebar always render
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('global-titlebar')).toBeInTheDocument();

    // After redirect, Explore view should be present
    expect(screen.getByTestId('explore')).toBeInTheDocument();
  });

  test('renders maintenance page when maintenanceMode true', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/anything'] },
        React.createElement(Routes, {
          maintenanceMode: true,
          location: { pathname: '/anything' },
        })
      )
    );

    expect(screen.getByTestId('maintenance')).toBeInTheDocument();
  });
});
