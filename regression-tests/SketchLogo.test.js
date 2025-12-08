// Regression test for SketchLogo component
// Uses React.createElement (no JSX) and Testing Library v8 APIs
const React = require('react');
const { render } = require('@testing-library/react');

// Import the component under test
const { SketchLogo } = require('../src/views/pages/components/logos.js');

describe('SketchLogo', () => {
  it('renders an img with the sketch logo src and empty alt', () => {
    const utils = render(React.createElement(SketchLogo));

    const img = utils.getByRole('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/img/logos/sketch.svg');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.tagName.toLowerCase()).toBe('img');
  });
});
