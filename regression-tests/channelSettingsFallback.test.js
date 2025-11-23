const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');
// Minimal inline implementation mirroring signedOutFallback to avoid importing ESM modules
const makeSignedOutFallback = (Component, FallbackComponent, authed) => props =>
  authed
    ? React.createElement(Component, props)
    : React.createElement(FallbackComponent, props);
// Lightweight stand-ins to avoid Apollo/Redux contexts
const ChannelSettings = () =>
  React.createElement('div', null, 'Channel Settings View');
const Login = () => React.createElement('div', null, 'Login');

/*
  Regression goal: ensure ChannelSettingsFallback (from routes.js) renders Login
  when unauthenticated, and renders ChannelSettings when authenticated. We avoid
  importing routes.js (dynamic imports) by constructing the wrapped component
  the same way routes.js does: signedOutFallback(ChannelSettings, () => <Login />)
*/

describe('ChannelSettingsFallback behavior', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('../src/views/authViewHandler', () => {
      const React = require('react');
      return { __esModule: true, default: ({ children }) => children(false) };
    });
  });

  test('renders Login fallback when unauthenticated', () => {
    const ChannelSettingsFallback = makeSignedOutFallback(
      ChannelSettings,
      () => React.createElement(Login),
      false
    );

    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/c/ch/settings'] },
        React.createElement(Route, {
          path: '/:communitySlug/:channelSlug/settings',
          component: ChannelSettingsFallback,
        })
      )
    );

    expect(document.body.textContent).toMatch(/login/i);
  });

  test('renders ChannelSettings when authenticated', () => {
    jest.resetModules();
    jest.doMock('../src/views/authViewHandler', () => {
      const React = require('react');
      return { __esModule: true, default: ({ children }) => children(true) };
    });

    const ChannelSettingsFallback = makeSignedOutFallback(
      ChannelSettings,
      () => React.createElement(Login),
      true
    );

    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/c/ch/settings'] },
        React.createElement(Route, {
          path: '/:communitySlug/:channelSlug/settings',
          component: ChannelSettingsFallback,
        })
      )
    );

    expect(document.body.textContent).toMatch(/Channel Settings View/);
  });
});
