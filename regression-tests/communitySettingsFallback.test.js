const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the component tree from routes where CommunitySettingsFallback is wired
const { default: Routes } = require('src/routes');
const { MemoryRouter, Route } = require('react-router');

// Mock CommunitySettings and Login to simplify assertions
jest.mock('src/views/communitySettings', () => () => {
  const React = require('react');
  return React.createElement(
    'div',
    { 'data-testid': 'community-settings' },
    'Community Settings'
  );
});
jest.mock('src/views/login', () => () => {
  const React = require('react');
  return React.createElement('div', { 'data-testid': 'login' }, 'Login View');
});

// Mock AuthViewHandler to control authentication state used by signedOutFallback
jest.mock('src/views/authViewHandler', () => {
  const React = require('react');
  const AuthViewHandler = ({ children, authed = false }) => children(authed);
  return AuthViewHandler;
});

// Suppress styled-components ThemeProvider warnings in test output
// Lightweight mock to ensure styled-components default export exists
jest.mock('styled-components', () => {
  const React = require('react');
  const styledMock = new Proxy(function() {}, {
    get: (target, prop) => {
      if (prop === 'default') return styledMock;
      if (prop === 'ThemeProvider') {
        return ({ children }) =>
          React.createElement(React.Fragment, null, children);
      }
      // return a curried tag function for styled.tag`` usage
      return () => () => React.createElement('div');
    },
    apply: () => () => React.createElement('div'),
  });
  return styledMock;
});

// Helper to render the app at a specific route
function renderAtPath(path, extraProps = {}) {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [path] },
      React.createElement(
        Route,
        { path: '/' },
        React.createElement(Routes, extraProps)
      )
    )
  );
}

describe('CommunitySettingsFallback (src/routes.js)', () => {
  test('renders Login fallback when unauthenticated', () => {
    // AuthViewHandler mock defaults to authed=false
    renderAtPath('/some-community/settings');
    expect(screen.queryByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('community-settings')).not.toBeInTheDocument();
  });

  test('renders CommunitySettings when authenticated', () => {
    // Rewire AuthViewHandler mock to return authed=true for this test
    jest.isolateModules(() => {
      jest.doMock('src/views/authViewHandler', () => {
        const React = require('react');
        const AuthViewHandler = ({ children }) => children(true);
        return AuthViewHandler;
      });
      const { default: RoutesAuthed } = require('src/routes');
      render(
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/another-community/settings'] },
          React.createElement(
            Route,
            { path: '/' },
            React.createElement(RoutesAuthed)
          )
        )
      );
      expect(screen.queryByTestId('community-settings')).toBeInTheDocument();
      expect(screen.queryByTestId('login')).not.toBeInTheDocument();
    });
  });
});
