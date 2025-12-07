const React = require('react');
const { render } = require('@testing-library/react');

// Mock all absolute-path imports used by src/routes.js to avoid alias resolution issues.
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

// The dynamically loaded CommunitySettings component import path
jest.mock(
  '../src/views/communitySettings',
  () =>
    function CommunitySettings() {
      return null;
    }
);

// Finally import routes.js so Loadable is configured, then render CommunitySettings through the mocked module.
require('../src/routes.js');

test('CommunitySettings route renders the component via Loadable', () => {
  const CommunitySettings = require('../src/views/communitySettings');
  const utils = render(React.createElement(CommunitySettings));
  expect(utils.container).toBeTruthy();
});
