const React = require('react');
const { render } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { HelmetProvider } = require('react-helmet-async');

// Component under test
const NavHead = require('src/views/navigation/navHead').default;

// The Head component uses react-helmet-async under the hood. For a
// straightforward regression, we just verify that NavHead renders without
// crashing and includes the favicon link element with the expected id.
// This guards against accidental removal or id/name changes.

describe('NavHead regression', () => {
  test('renders favicon link in Head', () => {
    // Ensure PUBLIC_URL is defined so href template composes deterministically
    const originalPublicUrl = process.env.PUBLIC_URL;
    process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';

    // Minimal mock store for react-redux connect()
    const mockStore = {
      // Only the properties used by react-redux are required
      subscribe: () => () => {},
      dispatch: () => {},
      getState: () => ({}),
    };

    const { container } = render(
      React.createElement(
        HelmetProvider,
        null,
        React.createElement(
          Provider,
          { store: mockStore },
          React.createElement(NavHead)
        )
      )
    );

    // Query by id set in the component
    const link = container.querySelector('link#dynamic-favicon');
    expect(link).toBeTruthy();
    expect(link.getAttribute('rel')).toBe('shortcut icon');
    // href should include PUBLIC_URL + '/img/favicon.ico'
    expect(link.getAttribute('href')).toContain('/img/favicon.ico');

    // Restore env
    process.env.PUBLIC_URL = originalPublicUrl;
  });
});
