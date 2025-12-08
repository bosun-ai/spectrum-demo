// Regression test for ExpoLogo component
// Uses React.createElement (no JSX) and Testing Library v8 APIs
const React = require('react');
const { render } = require('@testing-library/react');

// Import the component under test
const { ExpoLogo } = require('../src/views/pages/components/logos.js');

describe('ExpoLogo', () => {
  it('renders an img with the expo logo src and empty alt', () => {
    const utils = render(React.createElement(ExpoLogo));

    // Query by role img; alt is empty so it is not accessible name
    const img = utils.getByRole('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/img/logos/expo.svg');
    expect(img.getAttribute('alt')).toBe('');
    // Ensure height style is applied via styled-components (inline style not present)
    // We can't inspect generated className reliably; instead ensure it's an IMG element
    expect(img.tagName.toLowerCase()).toBe('img');
  });
});
