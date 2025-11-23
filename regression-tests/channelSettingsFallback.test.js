const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');
const signedOutFallback = require('../src/helpers/signed-out-fallback').default;
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
    const ChannelSettingsFallback = signedOutFallback(ChannelSettings, () =>
      React.createElement(Login)
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

    const ChannelSettingsFallback = signedOutFallback(ChannelSettings, () =>
      React.createElement(Login)
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
