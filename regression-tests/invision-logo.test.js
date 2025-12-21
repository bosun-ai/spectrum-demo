const React = require('react');
const { render } = require('@testing-library/react');

const { InvisionLogo } = require('../src/views/pages/components/logos');

describe('InvisionLogo regression', () => {
  it('renders the Invision mark with expected attributes', () => {
    const { container } = render(React.createElement(InvisionLogo));
    const img = container.querySelector('img');

    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('src', '/img/logos/invision.svg');
    expect(img).toHaveAttribute('alt', '');
  });
});
