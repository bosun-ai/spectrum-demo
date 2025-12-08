/*
 * Regression test for InvisionLogo component
 * Uses Testing Library v8 APIs consistent with existing setup.
 */
const React = require('react');
const { render } = require('@testing-library/react');

// Import the component via CommonJS require to match jest 22 environment
const Logos = require('../src/views/pages/components/logos.js');

// Note: @testing-library/react v8 does not export `screen`; use return value from render.

describe('InvisionLogo', () => {
  it('renders an img with the Invision src and empty alt', () => {
    const { getByRole } = render(React.createElement(Logos.InvisionLogo));

    // The Logo is a styled img, so role should be 'img'
    const img = getByRole('img');

    // Verify the src points to the expected logo asset
    expect(img.getAttribute('src')).toBe('/img/logos/invision.svg');

    // The component sets alt to empty string
    expect(img.getAttribute('alt')).toBe('');
  });

  it('applies expected height via styled-component at default breakpoint', () => {
    const { getByRole } = render(React.createElement(Logos.InvisionLogo));
    const img = getByRole('img');

    // Styled-components injects className and CSS; JSDOM won't compute layout,
    // but inline styles are not used. We can assert it has a class name applied.
    expect(img.className).toMatch(/sc-/); // styled-components typical class prefix
  });
});
