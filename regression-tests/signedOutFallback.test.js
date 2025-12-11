const React = require('react');
const { render, screen, cleanup } = require('@testing-library/react');

// Mock AuthViewHandler to control auth state without Apollo setup
jest.mock('../src/views/authViewHandler', () => {
  const React = require('react');
  return function AuthViewHandlerMock(props) {
    const authed = global.__TEST_AUTH_STATE__ || false;
    return props.children(authed);
  };
});

// Import the HOC that switches based on auth state
const signedOutFallback = require('../src/helpers/signed-out-fallback').default;

function PrimaryComponent(props) {
  return React.createElement(
    'div',
    { 'data-testid': 'primary' },
    props.label || 'Primary'
  );
}

function FallbackComponent(props) {
  return React.createElement(
    'div',
    { 'data-testid': 'fallback' },
    props.label || 'Fallback'
  );
}

afterEach(() => {
  cleanup();
  delete global.__TEST_AUTH_STATE__;
});

test('renders fallback when not authenticated', () => {
  global.__TEST_AUTH_STATE__ = false;
  const Wrapped = signedOutFallback(PrimaryComponent, FallbackComponent);
  render(React.createElement(Wrapped, { label: 'Test' }));
  expect(screen.queryByTestId('fallback')).toBeInTheDocument();
  expect(screen.queryByTestId('primary')).toBeNull();
});

test('renders primary component when authenticated', () => {
  global.__TEST_AUTH_STATE__ = true;
  const Wrapped = signedOutFallback(PrimaryComponent, FallbackComponent);
  render(React.createElement(Wrapped, { label: 'Test' }));
  expect(screen.queryByTestId('primary')).toBeInTheDocument();
  expect(screen.queryByTestId('fallback')).toBeNull();
});
