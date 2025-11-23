const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');
const signedOutFallback = require('../src/helpers/signed-out-fallback').default;
const ChannelSettings = require('../src/views/channelSettings').default;
const Login = require('../src/views/login').default;

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

    // Provide channel data to allow ChannelSettings to render
    jest.doMock('../shared/graphql/queries/channel/getChannel', () => ({
      getChannelByMatch: Component => props => {
        const mock = {
          channel: {
            id: '1',
            name: 'General',
            isArchived: false,
            community: {
              name: 'Community',
              slug: 'c',
              communityPermissions: { isOwner: true, isModerator: false },
            },
            channelPermissions: { isOwner: true, isModerator: false },
          },
        };
        return React.createElement(Component, { ...props, data: mock });
      },
    }));
    jest.doMock(
      '../src/components/viewNetworkHandler',
      () => Component => props =>
        React.createElement(Component, {
          ...props,
          isLoading: false,
          hasError: false,
        })
    );

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

    expect(document.body.textContent).toMatch(/Settings/);
    expect(document.body.textContent).toMatch(/General/);
  });
});
