import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
// Import the raw component by reaching into the file and using named export pattern.
// The module exports default wrapped component; to test without Apollo, require the file and access the class.
const AuthModule = require('../src/views/authViewHandler/index.js');
const AuthViewHandler =
  AuthModule.__esModule && AuthModule.default
    ? AuthModule.default.WrappedComponent ||
      AuthModule.AuthViewHandler ||
      AuthModule.default
    : AuthModule.AuthViewHandler || AuthModule;
// Fallback: if wrapped default exposes `WrappedComponent`, prefer it, else assume exported class name
const Unwrapped =
  AuthModule.default && AuthModule.default.WrappedComponent
    ? AuthModule.default.WrappedComponent
    : AuthViewHandler;

// Helper: render with mocked HOCs props injection
const renderWithProps = ({
  user = null,
  loading = false,
  pathname = '/',
  editUser = jest.fn(),
  children = authed => <div>authed:{String(authed)}</div>,
} = {}) => {
  const history = { replace: jest.fn() };
  const location = { pathname };

  const ui = (
    <MemoryRouter initialEntries={[pathname]}>
      <Unwrapped
        history={history}
        location={location}
        editUser={editUser}
        data={{ user, loading }}
      >
        {children}
      </Unwrapped>
    </MemoryRouter>
  );

  const utils = render(ui);
  return { ...utils, history, editUser };
};

describe('AuthViewHandler regression', () => {
  it('renders children(false) when no user and not loading', () => {
    renderWithProps({ user: null, loading: false });
    expect(screen.getByText('authed:false')).toBeInTheDocument();
  });

  it('returns null while loading when no user', () => {
    const { container } = renderWithProps({ user: null, loading: true });
    expect(container.firstChild).toBeNull();
  });

  it('renders NewUserOnboarding when user exists without username', () => {
    // Mock NewUserOnboarding to avoid HOCs (Apollo/Redux) requirements
    jest.doMock('../src/views/newUserOnboarding', () => () => (
      <div data-testid="new-user-onboarding">onboarding</div>
    ));
    const Module = require('../src/views/authViewHandler/index.js');
    const Raw =
      Module.default && Module.default.WrappedComponent
        ? Module.default.WrappedComponent
        : Module.AuthViewHandler || Module.default;

    const history = { replace: jest.fn() };
    const location = { pathname: '/' };
    render(
      <MemoryRouter>
        <Raw
          history={history}
          location={location}
          editUser={jest.fn()}
          data={{ user: { id: 'u1', username: null }, loading: false }}
        >
          {authed => <div>authed:{String(authed)}</div>}
        </Raw>
      </MemoryRouter>
    );
    expect(screen.getByTestId('new-user-onboarding')).toBeInTheDocument();
  });

  it('calls children(true) when user has id and username', () => {
    renderWithProps({ user: { id: 'u1', username: 'alice' } });
    expect(screen.getByText('authed:true')).toBeInTheDocument();
  });

  it('on first user load: sets timezone if missing and redirects from /home', () => {
    // initial render with no user
    const { rerender, editUser, history } = renderWithProps({
      user: null,
      loading: false,
      pathname: '/home',
    });

    // simulate user arriving without timezone
    const userNoTz = { id: 'u1', username: 'alice', timezone: null };
    const location = { pathname: '/home' };
    const next = (
      <MemoryRouter initialEntries={['/home']}>
        <Unwrapped
          history={history}
          location={location}
          editUser={editUser}
          data={{ user: userNoTz, loading: false }}
        >
          {authed => <div>authed:{String(authed)}</div>}
        </Unwrapped>
      </MemoryRouter>
    );
    rerender(next);

    // editUser should be called with a timezone value
    expect(editUser).toHaveBeenCalled();
    const arg = editUser.mock.calls[0][0];
    expect(typeof arg.timezone).toBe('number');

    // history.replace should be called to redirect away from /home
    expect(history.replace).toHaveBeenCalledWith('/');
  });
});
