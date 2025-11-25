const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the LoginFallback HOC instance from src/routes.js
// It is created via signedOutFallback(() => <Redirect to="/" />, Login)
const RoutesModule = require('../src/routes.js');

// Helper: render the LoginFallback route component at /login
function renderLoginFallback() {
  // RoutesModule exports only default Routes component; LoginFallback is a local const.
  // To test LoginFallback, recreate it using the same factory and inputs.
  const signedOutFallback = require('../src/helpers/signed-out-fallback')
    .default;
  const { Redirect } = require('react-router');
  const Login = require('../src/views/login').default;

  const LoginFallback = signedOutFallback(
    () => React.createElement(Redirect, { to: '/' }),
    Login
  );

  return render(React.createElement(LoginFallback));
}

test('LoginFallback renders Login when unauthenticated', () => {
  renderLoginFallback();
  // The Login view typically contains a heading or buttons; assert it renders.
  // Be generic: check that something from Login exists. Login includes provider buttons.
  // Look for a common string used on login page, e.g., 'Sign in' or provider names.
  const possibleTexts = [
    /login/i,
    /sign in/i,
    /github/i,
    /google/i,
    /twitter/i,
    /facebook/i,
  ];
  const found = possibleTexts.some(rx => {
    try {
      return screen.queryByText(rx) !== null;
    } catch (_) {
      return false;
    }
  });
  expect(found).toBe(true);
});
