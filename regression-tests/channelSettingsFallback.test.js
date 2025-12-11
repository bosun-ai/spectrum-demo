const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the fallback HOC-created component from routes
const { default: Routes } = require('src/routes');
const signedOutFallback = require('src/helpers/signed-out-fallback').default;

// Mock GraphQL HOCs to avoid Apollo client requirement
jest.mock('shared/graphql/queries/user/getUser', () => ({
  __esModule: true,
  getCurrentUser: function mockGetCurrentUser(Component) {
    return function Wrapped(props) {
      const ReactLocal = require('react');
      const data = { user: null, loading: false, networkStatus: 7 };
      return ReactLocal.createElement(
        Component,
        Object.assign({}, props, { data })
      );
    };
  },
}));
jest.mock('shared/graphql/mutations/user/editUser', () => ({
  __esModule: true,
  default: Component => props => React.createElement(Component, props),
}));

// Import the underlying views used by the fallback
// Mock ChannelSettings and Login to avoid Apollo/Redux dependencies
jest.mock('src/views/channelSettings', () => ({
  __esModule: true,
  default: function MockChannelSettings() {
    const ReactLocal = require('react');
    return ReactLocal.createElement('div', null, 'Channel Settings');
  },
}));
jest.mock('src/views/login', () => ({
  __esModule: true,
  default: function MockLogin() {
    const ReactLocal = require('react');
    return ReactLocal.createElement('h1', null, 'Log in to Spectrum');
  },
}));
const ChannelSettings = require('src/views/channelSettings').default;
const Login = require('src/views/login').default;

// The ChannelSettingsFallback is created in src/routes.js like:
// const ChannelSettingsFallback = signedOutFallback(ChannelSettings, () => (<Login />));
// Recreate the same wrapper here to regression test its behavior in isolation.
const ChannelSettingsFallback = signedOutFallback(ChannelSettings, () =>
  React.createElement(Login, null)
);

// Helper provider to satisfy ThemeProvider usage downstream if any
const { ThemeProvider } = require('styled-components');
const { theme } = require('shared/theme');

// Mock AuthViewHandler to simulate authed vs unauthenticated states used by signedOutFallback
jest.mock(
  'src/views/authViewHandler',
  () =>
    function MockAuthViewHandler({ children }) {
      return children(false);
    }
);

describe('ChannelSettingsFallback', () => {
  afterEach(() => {
    // reset module mock to default unauthenticated state
    jest.resetModules();
  });

  test('renders Login when user is signed out', () => {
    // default mock returns children(false)
    render(
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(ChannelSettingsFallback, null)
      )
    );
    // Login view renders a heading element with "Log in to Spectrum" text
    const loginHeading = screen.getByText(/log in/i);
    expect(loginHeading).toBeInTheDocument();
  });

  test('renders ChannelSettings when user is authenticated', () => {
    // Swap the mock to authed true
    jest.doMock('src/views/authViewHandler', () => {
      const React = require('react');
      return ({ children }) => children(true);
    });

    // Re-require the HOC with updated mock
    const signedOutFallback2 = require('src/helpers/signed-out-fallback')
      .default;
    const ChannelSettings2 = require('src/views/channelSettings').default;
    const ChannelSettingsFallbackAuthed = signedOutFallback2(
      ChannelSettings2,
      () => React.createElement(Login, null)
    );

    render(
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(ChannelSettingsFallbackAuthed, null)
      )
    );

    // Channel settings overview contains text "Channel Settings"
    const heading = screen.getByText(/channel settings/i);
    expect(heading).toBeInTheDocument();
  });
});
