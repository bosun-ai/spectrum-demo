// Regression test for Privacy component redirect behavior
// Uses React.createElement to avoid JSX and matches Testing Library v8

/* eslint-env jest */

const React = require('react');
const { render, cleanup } = require('@testing-library/react');

// Import the component under test
const Privacy = require('../src/views/pages/privacy/index.js').default;

// Ensure jsdom has a deterministic starting URL
// jest.config sets testURL, but we also assert it here for clarity
describe('Privacy component', () => {
  let originalLocation;

  beforeEach(() => {
    // Save original location to restore later
    originalLocation = window.location.href;
  });

  afterEach(() => {
    // Reset DOM and restore original location
    cleanup();
    window.location.href = originalLocation;
  });

  it('redirects to GitHub Privacy Statement on mount', () => {
    // Render the component; it should set window.location.href in componentDidMount
    render(React.createElement(Privacy));

    expect(window.location.href).toBe(
      'https://help.github.com/en/github/site-policy/github-privacy-statement'
    );
  });
});
