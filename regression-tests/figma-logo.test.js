const React = require('react');
const { render, screen } = require('@testing-library/react');
const { FigmaLogo } = require('../src/views/pages/components/logos');

describe('FigmaLogo regression', () => {
  it('renders the correct logo asset', () => {
    render(React.createElement(FigmaLogo));

    const logoImage = screen.getByRole('img', { name: '' });
    expect(logoImage).toHaveAttribute('src', '/img/logos/figma.svg');
    expect(logoImage).toHaveAttribute('alt', '');
  });
});
