const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');

// Mock react-loadable to avoid evaluating dynamic import() in jest
jest.mock('react-loadable', () => {
  return function Loadable(opts) {
    // Return a component that renders loading fallback immediately
    const Fallback = props =>
      (opts.loading && opts.loading({ isLoading: false })) || null;
    Fallback.displayName = 'MockLoadable';
    return Fallback;
  };
});

// Render the Routes component at the settings URL and assert fallback/login behavior
describe('UserSettingsFallback in routes.js', () => {
  test('renders Login fallback when signed out on /users/:username/settings', () => {
    // Import after mocks
    const Routes = require('../src/routes').default;

    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/users/testuser/settings'] },
        React.createElement(Route, { path: '/', component: Routes })
      )
    );

    // When unauthenticated, signedOutFallback renders the FallbackComponent which is Login
    // The Login component renders buttons for providers; assert one stable text exists
    // We expect a "Login" route content to be present; fallback may render a login button set
    const loginHeading = screen.queryByText(/login/i);
    expect(loginHeading).toBeTruthy();
  });
});
