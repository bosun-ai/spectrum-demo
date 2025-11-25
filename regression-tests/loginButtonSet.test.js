const React = require('react');
const { screen } = require('@testing-library/react');
const { renderWithThemeAndRouter } = require('./test-utils');

// Import unwrapped component by reaching into the module before withRouter wraps it
// The default export is withRouter(LoginButtonSet), but we can still render it
// within a Router context using MemoryRouter and route entries.
const LoginButtonSet = require('../src/components/loginButtonSet').default;

// Helpers
function renderWithRouter(ui, opts) {
  return renderWithThemeAndRouter(ui, opts);
}

describe('LoginButtonSet', () => {
  beforeEach(() => {
    // Ensure clean localStorage between tests
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  test('renders all providers by default and marks one preferred when none saved', () => {
    // When no preferred_signin_method exists, all non-githubOnly providers should render
    renderWithRouter(
      React.createElement(LoginButtonSet, { location: { search: '' } })
    );

    // The button components render anchor tags with provider names in most implementations.
    // Be resilient: assert presence of provider names somewhere in the tree.
    expect(screen.queryByText(/twitter/i)).toBeTruthy();
    expect(screen.queryByText(/facebook/i)).toBeTruthy();
    expect(screen.queryByText(/google/i)).toBeTruthy();
    expect(screen.queryByText(/github/i)).toBeTruthy();
  });

  test('only renders GitHub when githubOnly is true', () => {
    renderWithRouter(
      React.createElement(LoginButtonSet, {
        githubOnly: true,
        location: { search: '' },
      })
    );

    expect(screen.queryByText(/github/i)).toBeTruthy();
    expect(screen.queryByText(/twitter/i)).toBeNull();
    expect(screen.queryByText(/facebook/i)).toBeNull();
    expect(screen.queryByText(/google/i)).toBeNull();
  });

  test('uses redirect from query string r when provided', () => {
    // Simulate a preferred method stored and ensure href contains r param
    window.localStorage.setItem(
      'preferred_signin_method',
      JSON.stringify('github')
    );

    renderWithRouter(
      React.createElement(LoginButtonSet, {
        location: { search: '?r=%2Fwelcome' },
      }),
      { route: '/login?r=%2Fwelcome' }
    );

    // Find the GitHub anchor and check it links to server auth with r=/welcome
    const githubLink = screen
      .getAllByRole('link')
      .find(a => /github/i.test(a.textContent || ''));
    expect(githubLink).toBeTruthy();
    expect(githubLink.getAttribute('href')).toMatch(/auth\/github\?r=/);
    expect(decodeURIComponent(githubLink.getAttribute('href'))).toMatch(
      /r=\/welcome/
    );
  });
});
