const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the component from routes where it is defined
const { default: Routes } = require('src/routes');
const { MemoryRouter, Route } = require('react-router');

// Mock UserSettings and Login to simplify assertions
jest.mock('src/views/userSettings', () => {
  const ReactLocal = require('react');
  return () =>
    ReactLocal.createElement(
      'div',
      { 'data-testid': 'user-settings' },
      'User Settings'
    );
});
jest.mock('src/views/login', () => {
  const ReactLocal = require('react');
  return () =>
    ReactLocal.createElement('div', { 'data-testid': 'login' }, 'Login View');
});

// Mock AuthViewHandler to control authentication state used by signedOutFallback
jest.mock('src/views/authViewHandler', () => {
  const AuthViewHandler = ({ children, authed = false }) => children(authed);
  return AuthViewHandler;
});

// Use actual styled-components to avoid styled() issues

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

describe('UserSettingsFallback (src/routes.js)', () => {
  test('renders Login fallback when unauthenticated', () => {
    // AuthViewHandler mock defaults to authed=false
    renderAtPath('/users/someuser/settings');
    expect(screen.queryByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('user-settings')).not.toBeInTheDocument();
  });

  test('renders UserSettings when authenticated', () => {
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
          { initialEntries: ['/users/another/settings'] },
          React.createElement(
            Route,
            { path: '/' },
            React.createElement(RoutesAuthed)
          )
        )
      );
      expect(screen.queryByTestId('user-settings')).toBeInTheDocument();
      expect(screen.queryByTestId('login')).not.toBeInTheDocument();
    });
  });
});
