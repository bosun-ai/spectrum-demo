const React = require('react');
const { render, screen } = require('@testing-library/react');

const { Discover } = require('../src/components/illustrations');

describe('Discover illustration regression', () => {
  it('renders the discover image asset with empty alt text', () => {
    render(React.createElement(Discover));

    const discoverImage = screen.getByRole('img', { name: '' });
    expect(discoverImage).toHaveAttribute('src', '/img/discover.png');
    expect(discoverImage).toHaveAttribute('alt', '');
  });
});
