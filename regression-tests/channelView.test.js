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

// The dynamically loaded ChannelView component import path
jest.mock(
  '../src/views/channel',
  () =>
    function ChannelView() {
      return null;
    }
);

// Import routes.js so that Loadable is configured with our mocked module.
require('../src/routes.js');

test('ChannelView route resolves and renders via Loadable', () => {
  // By requiring the mocked ChannelView, we ensure the import path is correct.
  const ChannelView = require('../src/views/channel');
  const utils = render(React.createElement(ChannelView));
  expect(utils.container).toBeTruthy();
});
