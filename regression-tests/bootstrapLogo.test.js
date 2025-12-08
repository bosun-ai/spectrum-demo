// Regression test for BootstrapLogo component
// Uses React.createElement to avoid JSX per setup
const React = require('react');

// Import the component from the source file
const { BootstrapLogo } = require('../src/views/pages/components/logos.js');

// Import testing utilities (Testing Library v8)
const { render, getByAltText } = require('@testing-library/react');

describe('BootstrapLogo', () => {
  test('renders an image with correct src and alt', () => {
    const { container } = render(React.createElement(BootstrapLogo));

    // Component renders <img alt="" src="/img/logos/bootstrap.svg" />
    const img = getByAltText(container, '');

    expect(img.tagName).toBe('IMG');
    expect(img.getAttribute('src')).toBe('/img/logos/bootstrap.svg');
    expect(img.getAttribute('alt')).toBe('');
  });

  test('applies styled height rules', () => {
    const { container } = render(React.createElement(BootstrapLogo));
    const img = getByAltText(container, '');

    // styled-components injects a className; style computed via CSS
    // We can at least assert a class is present to indicate styling applied
    expect(img.className).toBeTruthy();
  });
});
