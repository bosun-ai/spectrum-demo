// Regression test for Terms component redirect behavior
// Uses React.createElement to avoid JSX as per setup notes
const React = require('react');
const { render } = require('@testing-library/react');

describe('Terms page', () => {
  // Save original location to restore after test
  const originalLocation = global.window.location;

  beforeEach(() => {
    // JSDOM's location is read-only in some environments; stub href via defineProperty
    Object.defineProperty(global.window, 'location', {
      writable: true,
      value: { href: 'http://localhost/' },
    });
    // Clear module cache to re-run componentDidMount fresh
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original location object
    global.window.location = originalLocation;
  });

  test('redirects to GitHub Terms of Service on mount', () => {
    const Terms = require('../src/views/pages/terms/index.js').default;

    // Render the component; it should set window.location.href in componentDidMount
    render(React.createElement(Terms));

    expect(global.window.location.href).toBe(
      'https://help.github.com/en/github/site-policy/github-terms-of-service'
    );
  });
});
