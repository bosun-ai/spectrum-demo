// Regression test for FigmaLogo component
// Uses React.createElement (no JSX) and Testing Library v8 APIs
const React = require('react');
const { render } = require('@testing-library/react');

// Import the component under test
const { FigmaLogo } = require('../src/views/pages/components/logos.js');

describe('FigmaLogo', () => {
  it('renders an img with the figma logo src and empty alt', () => {
    const utils = render(React.createElement(FigmaLogo));

    const img = utils.getByRole('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/img/logos/figma.svg');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.tagName.toLowerCase()).toBe('img');
  });
});
