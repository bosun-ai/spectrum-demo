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

  it('applies styled-components className', () => {
    const { queryAllByRole } = render(React.createElement(Logos.InvisionLogo));
    const imgs = queryAllByRole('img');
    const img = imgs[imgs.length - 1];

    // Assert a styled-components generated className is present.
    // In this codebase, styled-components uses BEM-like hash names.
    expect(img.className).toMatch(/Logo/);
  });
});
