const React = require('react');
const { render, screen } = require('@testing-library/react');

// Test CommunitySettingsFallback behavior in isolation to avoid dynamic import parsing
const signedOutFallback = require('../src/helpers/signed-out-fallback').default;

// Create simple stand-ins for components
const CommunitySettingsStub = () =>
  React.createElement('div', null, 'Community Settings View');
const LoginStub = () =>
  React.createElement('button', { type: 'button' }, 'Sign in');

// Mock AuthViewHandler to control auth state via prop
jest.mock('../src/views/authViewHandler', () => {
  return function AuthViewHandler(props) {
    const child = props.children;
    // Prefer explicit prop for tests, default to false
    const authed = props.__authed === true;
    return child(authed);
  };
});

// Build the fallback component under test
const CommunitySettingsFallback = signedOutFallback(
  CommunitySettingsStub,
  LoginStub
);

test('CommunitySettingsFallback renders Login when signed out', () => {
  render(React.createElement(CommunitySettingsFallback, { __authed: false }));
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
});

test('CommunitySettingsFallback renders CommunitySettings when authed', () => {
  render(React.createElement(CommunitySettingsFallback, { __authed: true }));
  expect(screen.getByText('Community Settings View')).toBeInTheDocument();
});
