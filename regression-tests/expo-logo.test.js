const React = require('react');
const { render } = require('@testing-library/react');

const { ExpoLogo } = require('../src/views/pages/components/logos');

describe('ExpoLogo regression', () => {
  it('renders with the expected asset and alt text', () => {
    const { container } = render(React.createElement(ExpoLogo));
    const img = container.querySelector('img');

    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('src', '/img/logos/expo.svg');
    expect(img).toHaveAttribute('alt', '');
  });
});
