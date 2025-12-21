const React = require('react');
const { render, screen } = require('@testing-library/react');
const { SketchLogo } = require('../src/views/pages/components/logos');

describe('SketchLogo regression', () => {
  it('renders the Sketch brand asset with empty alt text', () => {
    render(React.createElement(SketchLogo));

    const logoImage = screen.getByRole('img', { name: '' });
    expect(logoImage).toHaveAttribute('src', '/img/logos/sketch.svg');
    expect(logoImage).toHaveAttribute('alt', '');
  });
});
