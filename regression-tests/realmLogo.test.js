// Regression test for RealmLogo component
// Uses Testing Library v8 without JSX per repo setup
const React = require('react');
const { render } = require('@testing-library/react');

// Import the component via CommonJS require to match jest 22 environment
const logos = require('../src/views/pages/components/logos.js');

describe('RealmLogo', () => {
  it('renders an img with realm logo src and empty alt', () => {
    const { container } = render(React.createElement(logos.RealmLogo));
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    // src should be the realm logo path used in component
    expect(img.getAttribute('src')).toBe('/img/logos/realm.svg');
    // alt is explicitly empty string in component
    expect(img.getAttribute('alt')).toBe('');
  });
});
