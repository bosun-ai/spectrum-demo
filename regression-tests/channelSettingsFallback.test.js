const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');

// Import the compiled CommonJS module via require
const Routes = require('../src/routes.js').default;

/*
  Regression goal: ensure ChannelSettingsFallback route renders a Login fallback
  when unauthenticated, and renders the ChannelSettings view when authenticated.

  We simulate routing to '/community-slug/channel-slug/settings' with MemoryRouter.
  Since AuthViewHandler gates on current user from GraphQL, we mock AuthViewHandler
  to control the 'authed' value for the Switch in signed-out-fallback.
*/

describe('ChannelSettingsFallback behavior', () => {
  // Mock AuthViewHandler to call children with desired auth state
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('../src/views/authViewHandler', () => {
      const React = require('react');
      return {
        __esModule: true,
        default: ({ children }) => children(false), // default: unauthenticated
      };
    });
  });

  test('renders Login fallback when unauthenticated', () => {
    const routes = require('../src/routes.js').default;
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/c/ch/settings'] },
        React.createElement(Route, { component: routes })
      )
    );
    // Login view renders a form or specific text; assert Login route exists via redirect to /login component.
    // Since LoginFallback is used, ensure something from Login component is present.
    // The Login view renders buttons; we can assert the document contains an element with text 'Login' via button labels.
    // As a safer assertion, check that the DOM contains the word 'Login'.
    expect(document.body.textContent).toMatch(/login/i);
  });

  test('renders ChannelSettings when authenticated', () => {
    jest.resetModules();
    jest.doMock('../src/views/authViewHandler', () => {
      const React = require('react');
      return {
        __esModule: true,
        default: ({ children }) => children(true),
      };
    });
    // Mock channel query HOC to provide a simple channel object so ChannelSettings renders
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
    // Mock viewNetworkHandler to pass through props
    jest.doMock(
      '../src/components/viewNetworkHandler',
      () => Component => props => {
        return React.createElement(Component, {
          ...props,
          isLoading: false,
          hasError: false,
        });
      }
    );

    const routes = require('../src/routes.js').default;
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/c/ch/settings'] },
        React.createElement(Route, { component: routes })
      )
    );

    // Expect Channel Settings header to appear
    expect(document.body.textContent).toMatch(/Settings/);
    expect(document.body.textContent).toMatch(/General/);
  });
});
