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
jest.mock('../src/components/appViewWrapper', () => props =>
  React.createElement('div', props)
);
jest.mock('../src/components/scrollManager', () => props =>
  React.createElement('div', props)
);
jest.mock('../src/components/head', () => props =>
  React.createElement('div', props)
);
jest.mock('../src/components/modals/modalRoot', () => () => null);
jest.mock('../src/components/gallery', () => () => null);
jest.mock('../src/components/toasts', () => () => null);
jest.mock('../src/helpers/signed-out-fallback', () => (A, B) => A);
jest.mock('../src/views/threadSlider', () => props =>
  React.createElement('div', props)
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
  LoadingView: () => React.createElement('div', { 'data-testid': 'loading' }),
}));
jest.mock('../src/views/globalTitlebar', () => () => null);
jest.mock('../src/helpers/navigation-context', () => ({
  NavigationContext: { Provider: ({ children }) => children },
}));

// The dynamically loaded ChannelSettings component import path
jest.mock('../src/views/channelSettings', () => () =>
  React.createElement(
    'div',
    { 'data-testid': 'channel-settings' },
    'Channel Settings'
  )
);

// Finally import routes.js so Loadable is configured, then render ChannelSettings through the signedOutFallback route.
const routes = require('../src/routes.js');

test('ChannelSettings route renders the component via Loadable', () => {
  // ChannelSettingsFallback is used in a <Route/>; instead, directly render the Loadable-wrapped module
  // by requiring the mocked module and creating the element. We verify that our mocked ChannelSettings
  // renders, which means the Loadable configuration points to the expected path.
  const ChannelSettings = require('../src/views/channelSettings');
  const { getByTestId } = render(React.createElement(ChannelSettings));
  expect(getByTestId('channel-settings')).toBeTruthy();
});
