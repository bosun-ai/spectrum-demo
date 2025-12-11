const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');

// We import real signedOutFallback behavior via Routes wiring
const signedOutFallback = require('src/helpers/signed-out-fallback').default;

// Mock Login to expose a test id and inspect redirect
jest.mock('src/views/login', () => {
  const ReactLocal = require('react');
  return ({ redirectPath }) =>
    ReactLocal.createElement(
      'div',
      { 'data-testid': 'login-page', 'data-redirect': redirectPath || '' },
      'Login View'
    );
});

// Mock withCurrentUser to avoid Apollo dependency in unit test
jest.mock('src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));
// Also mock react-apollo HOCs used by AuthViewHandler internals if any
jest.mock('react-apollo', () => {
  const ReactLocal = require('react');
  const passthrough = Comp => Comp;
  return {
    Query: ({ children }) => children({ data: {}, loading: false }),
    ApolloProvider: ({ children }) => children,
    graphql: () => passthrough,
    withApollo: () => passthrough,
  };
});
// Mock react-redux connect to pass through without requiring a Provider
jest.mock('react-redux', () => {
  const passthrough = Comp => Comp;
  return {
    connect: () => passthrough,
    Provider: ({ children }) => children,
    useSelector: () => ({}),
    useDispatch: () => () => {},
  };
});

// Helper to render a component at /login
function renderAtLogin(Component) {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/login'] },
      React.createElement(
        Route,
        { path: '/' },
        React.createElement(Component, { data: { user: null, loading: false } })
      )
    )
  );
}

describe('LoginFallback (src/routes.js)', () => {
  test('redirects to / when authenticated', () => {
    // AuthViewHandler yields authed=true so fallback should render Redirect to '/'
    jest.doMock('src/views/authViewHandler', () => {
      const AuthViewHandler = ({ children }) => children(true);
      return AuthViewHandler;
    });
    // Re-require signedOutFallback and compose LoginFallback as in src/routes.js
    const signedOutFallbackAuthed = require('src/helpers/signed-out-fallback')
      .default;
    const { Redirect } = require('react-router');
    const Login = require('src/views/login');
    const LoginFallback = signedOutFallbackAuthed(
      () => React.createElement(Redirect, { to: '/' }),
      Login
    );

    renderAtLogin(LoginFallback);

    // When authed, fallback (Login) should NOT render
    expect(screen.queryByTestId('login-page')).toBeNull();
  });

  test('renders Login when signed out', () => {
    jest.resetModules();
    // AuthViewHandler yields authed=false to drive fallback behavior
    jest.doMock('src/views/authViewHandler', () => {
      const AuthViewHandler = ({ children }) => children(false);
      return AuthViewHandler;
    });
    const signedOutFallbackSignedOut = require('src/helpers/signed-out-fallback')
      .default;
    const { Redirect } = require('react-router');
    const Login = require('src/views/login');
    const LoginFallback = signedOutFallbackSignedOut(
      () => React.createElement(Redirect, { to: '/' }),
      Login
    );

    renderAtLogin(LoginFallback);

    // Expect the Login component to render
    const login = screen.getByTestId('login-page');
    expect(login).toBeInTheDocument();
    // Ensure no Redirect element takes effect in this branch
    // (we only assert presence/absence of login here)
  });
});
