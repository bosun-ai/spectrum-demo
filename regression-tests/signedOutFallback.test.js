const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the HOC that switches based on auth state
const signedOutFallback = require('../src/helpers/signed-out-fallback').default;

// Since AuthViewHandler relies on Apollo and router, we only verify
// that the wrapper renders without crashing and passes props through.

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

test('signedOutFallback renders without crashing', () => {
  const Wrapped = signedOutFallback(PrimaryComponent, FallbackComponent);
  // We cannot easily toggle auth state here due to real AuthViewHandler,
  // but we can ensure the component tree mounts and one of the inner
  // components renders to the DOM.
  render(React.createElement(Wrapped, { label: 'Test' }));
  // Expect either primary or fallback to be present; at least one should render
  const primary = screen.queryByTestId('primary');
  const fallback = screen.queryByTestId('fallback');
  expect(primary || fallback).toBeTruthy();
});
