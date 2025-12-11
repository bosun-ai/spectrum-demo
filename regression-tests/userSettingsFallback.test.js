const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');

// We test the signedOutFallback component behavior used to create UserSettingsFallback
const { signedOutFallback } = require('src/helpers/signed-out-fallback');
const { CLIENT_URL } = require('src/api/constants');

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
  return ({ redirectPath }) =>
    ReactLocal.createElement(
      'div',
      { 'data-testid': 'login', 'data-redirect': redirectPath || '' },
      'Login View'
    );
});

// Mock AuthViewHandler to control authentication state used by signedOutFallback
jest.mock('src/views/authViewHandler', () => {
  const AuthViewHandler = ({ children, authed = false }) => children(authed);
  return AuthViewHandler;
});

function renderComponent(Component) {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/users/testuser/settings'] },
      React.createElement(Route, { path: '/' }, React.createElement(Component))
    )
  );
}

describe('UserSettingsFallback (src/routes.js)', () => {
  test('renders Login fallback when unauthenticated', () => {
    const UserSettings = require('src/views/userSettings');
    const Login = require('src/views/login');
    const UserSettingsFallback = signedOutFallback(UserSettings, () =>
      React.createElement(Login, { redirectPath: `${CLIENT_URL}/me/settings` })
    );
    renderComponent(UserSettingsFallback);
    const login = screen.getByTestId('login');
    expect(login).toBeInTheDocument();
    expect(login.getAttribute('data-redirect')).toBe(
      `${CLIENT_URL}/me/settings`
    );
    expect(screen.queryByTestId('user-settings')).not.toBeInTheDocument();
  });

  test('renders UserSettings when authenticated', () => {
    jest.resetModules();
    jest.doMock('src/views/authViewHandler', () => {
      const AuthViewHandler = ({ children }) => children(true);
      return AuthViewHandler;
    });
    const {
      signedOutFallback: signedOutFallbackAuthed,
    } = require('src/helpers/signed-out-fallback');
    const UserSettings = require('src/views/userSettings');
    const Login = require('src/views/login');
    const UserSettingsFallbackAuthed = signedOutFallbackAuthed(
      UserSettings,
      Login
    );
    renderComponent(UserSettingsFallbackAuthed);
    expect(screen.getByTestId('user-settings')).toBeInTheDocument();
    expect(screen.queryByTestId('login')).not.toBeInTheDocument();
  });
});
