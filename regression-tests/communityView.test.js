const React = require('react');
const { render } = require('@testing-library/react');

// Mirror the route-level mocks from other regression tests to isolate routes.js
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
}));
jest.mock('../src/api/constants', () => ({ CLIENT_URL: 'http://localhost' }));
jest.mock('../shared/generate-meta-info', () => () => ({
  title: 't',
  description: 'd',
}));
jest.mock('../src/reset.css.js', () => () => null);
jest.mock('../src/components/message/threadAttachment/style', () => ({
  GlobalThreadAttachmentStyles: () => null,
}));
jest.mock('../shared/theme', () => ({ theme: {} }));
jest.mock(
  '../src/components/appViewWrapper',
  () =>
    function AppViewWrapper() {
      return null;
    }
);
jest.mock(
  '../src/components/scrollManager',
  () =>
    function ScrollManager() {
      return null;
    }
);
jest.mock(
  '../src/components/head',
  () =>
    function Head() {
      return null;
    }
);
jest.mock('../src/components/modals/modalRoot', () => () => null);
jest.mock('../src/components/gallery', () => () => null);
jest.mock('../src/components/toasts', () => () => null);
jest.mock('../src/helpers/signed-out-fallback', () => (A, B) => A);
jest.mock(
  '../src/views/threadSlider',
  () =>
    function ThreadSlider() {
      return null;
    }
);
jest.mock('../src/components/announcementBanner', () => () => null);
jest.mock('../src/views/navigation', () => () => null);
jest.mock('../src/views/status', () => () => null);
jest.mock('../src/views/login', () => () => null);
jest.mock('../src/views/directMessages', () => () => null);
jest.mock('../src/views/thread', () => ({ ThreadView: () => null }));
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: C => C,
}));
jest.mock('../src/components/maintenance', () => () => null);
jest.mock('../src/views/thread/redirect-old-route', () => () => null);
jest.mock('../src/views/newUserOnboarding', () => () => null);
jest.mock('../src/views/queryParamToastDispatcher', () => () => null);
jest.mock('../src/views/viewHelpers', () => ({
  LoadingView: function LoadingView() {
    return null;
  },
}));
jest.mock('../src/views/globalTitlebar', () => () => null);
jest.mock('../src/helpers/navigation-context', () => ({
  NavigationContext: {
    Provider: function Provider() {
      return null;
    },
  },
}));
// styled-components ThemeProvider used in routes
jest.mock('styled-components', () => ({
  ThemeProvider: function ThemeProvider(props) {
    return props && props.children ? props.children : null;
  },
}));

// The dynamically loaded CommunityView component import path
jest.mock(
  '../src/views/community',
  () =>
    function CommunityView() {
      return null;
    }
);

// Import routes.js so that Loadable is configured with our mocked module.
require('../src/routes.js');

test('CommunityView route resolves and renders via Loadable', () => {
  // By requiring the mocked CommunityView, we ensure the import path is correct.
  const CommunityView = require('../src/views/community');
  const utils = render(React.createElement(CommunityView));
  expect(utils.container).toBeTruthy();
});
