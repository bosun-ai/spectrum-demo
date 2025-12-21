const React = require('react');
const { render } = require('@testing-library/react');

const { NodeLogo } = require('../src/views/pages/components/logos');

describe('NodeLogo regression', () => {
  it('renders the Node.js mark with expected attributes', () => {
    const { container } = render(React.createElement(NodeLogo));
    const img = container.querySelector('img');

    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('src', '/img/logos/nodejs.svg');
    expect(img).toHaveAttribute('alt', '');
  });
});
