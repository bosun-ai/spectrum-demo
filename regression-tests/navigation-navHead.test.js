// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { HelmetProvider } = require('react-helmet-async');

// Bypass redux store requirement by mocking connect to identity HOC
jest.mock('react-redux', () => ({
  connect: () => Comp => Comp,
}));

// Import NavHead via src alias mapped in regression jest config
const NavHead =
  require('../src/views/navigation/navHead.js').default ||
  require('../src/views/navigation/navHead.js');

describe('NavHead regression', () => {
  test('injects favicon link into Head', () => {
    // Ensure PUBLIC_URL exists for href construction
    const originalPublicUrl = process.env.PUBLIC_URL;
    process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';

    // Wrap in HelmetProvider to ensure react-helmet-async context exists
    render(
      React.createElement(HelmetProvider, null, React.createElement(NavHead))
    );

    // The Head component renders children within Helmet; jsdom will reflect the link in the document head
    // Query by id to locate the favicon link injected into head
    const link = document.head.querySelector('#dynamic-favicon');
    // Validate attributes on the favicon link
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('id', 'dynamic-favicon');
    expect(link).toHaveAttribute(
      'href',
      `${process.env.PUBLIC_URL}/img/favicon.ico`
    );
    expect(link).toHaveAttribute('rel', 'shortcut icon');

    // Restore env
    process.env.PUBLIC_URL = originalPublicUrl;
  });
});
