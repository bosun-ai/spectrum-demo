const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Keep ErrorBoundary simple so errors bubble in Jest
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
}));

// Avoid styled-components theming complexity in tests
jest.mock('styled-components', () => {
  const actual = jest.requireActual('styled-components');
  const React = require('react');
  const createGlobalStyle = () => () => null;
  const makeTagged = () => {
    const fn = () => () => null;
    fn.withConfig = () => fn;
    return fn;
  };
  const css = () => '';
  const keyframes = () => '';
  const styled = new Proxy(() => null, {
    get: () => makeTagged(),
    apply: () => makeTagged(),
  });
  return {
    __esModule: true,
    ...actual,
    ThemeProvider: ({ children }) => children,
    createGlobalStyle,
    default: styled,
    styled,
    css,
    keyframes,
  };
});

// Avoid real Loadable behavior; just render the loaded component
jest.mock('react-loadable', () => ({
  __esModule: true,
  default: cfg =>
    cfg.loader().then
      ? // if loader returns a Promise, fake a minimal component
        () => null
      : cfg.loader(),
}));

// Keep global chrome like toast/gallery/modal quiet
jest.mock('../src/components/toasts', () => () => null);
jest.mock('../src/components/gallery', () => () => null);
jest.mock('../src/components/modals/modalRoot', () => () => null);
jest.mock('../src/components/announcementBanner', () => () => null);
jest.mock('../src/views/globalTitlebar', () => () => null);
jest.mock('../src/components/appViewWrapper', () => props => props.children);
jest.mock('../src/components/scrollManager', () => props => props.children);
jest.mock('../src/components/message/threadAttachment/style', () => ({
  GlobalThreadAttachmentStyles: () => null,
}));

// Head just renders nothing in tests
jest.mock('../src/components/head', () => () => null);

// Navigation renders marker so we know Routes mounted base layout
jest.mock('../src/views/navigation', () => () => {
  const React = require('react');
  return React.createElement('div', { 'data-testid': 'nav' });
});

// Status/Login keep quiet
jest.mock('../src/views/status', () => () => null);
jest.mock('../src/views/login', () => () => {
  const React = require('react');
  return React.createElement('div', { 'data-testid': 'login' });
});

// Thread related views
jest.mock('../src/views/thread', () => ({ ThreadView: () => null }));
jest.mock('../src/views/thread/redirect-old-route', () => () => null);

// Simplify HOC
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: C => C,
}));

// Explore page marker, used for redirect assertion
jest.mock('../src/views/explore', () => ({
  __esModule: true,
  default: () => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'explore-view' });
  },
}));

// Maintenance view marker
jest.mock('../src/components/maintenance', () => () => {
  const React = require('react');
  return React.createElement('div', { 'data-testid': 'maintenance' });
});

describe('Routes component', () => {
  test('redirects / to /explore and renders Explore', async () => {
    const Routes = require('../src/routes').default;
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/'] },
        React.createElement(Routes, {
          currentUser: null,
          isLoadingCurrentUser: false,
        })
      )
    );

    // Base layout should render
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    // Explore view should render after redirect
    expect(await screen.findByTestId('explore-view')).toBeInTheDocument();
  });

  test('renders maintenance mode when maintenanceMode=true', () => {
    const Routes = require('../src/routes').default;
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/anywhere'] },
        React.createElement(Routes, {
          maintenanceMode: true,
          currentUser: null,
          isLoadingCurrentUser: false,
        })
      )
    );
    // In maintenance, the special view should be present and nav/explore absent
    expect(screen.getByTestId('maintenance')).toBeInTheDocument();
  });
});
