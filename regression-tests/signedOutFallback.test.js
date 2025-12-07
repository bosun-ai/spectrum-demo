const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock withCurrentUser to no-op
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));

// Mock AuthViewHandler to control auth state
jest.mock('../src/views/authViewHandler', () => ({ children }) =>
  children(false)
);

const signedOutFallback =
  require('../src/helpers/signed-out-fallback').default ||
  require('../src/helpers/signed-out-fallback');

function TestComp() {
  return React.createElement('div', null, 'Authed View');
}

function LoginMock() {
  return React.createElement('div', null, 'Log in');
}

test('signedOutFallback renders FallbackComponent when unauthenticated', () => {
  const Wrapped = signedOutFallback(TestComp, LoginMock);
  const utils = render(React.createElement(Wrapped));
  expect(screen.getByText(/log in/i)).toBeTruthy();
  expect(utils.container.textContent).toMatch(/log in/i);
});
