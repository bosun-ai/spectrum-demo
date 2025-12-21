const React = require('react');
const { render, screen } = require('@testing-library/react');

const { Empty } = require('../src/components/illustrations');

describe('Empty illustration regression', () => {
  it('renders the empty illustration asset with hidden alt text', () => {
    render(React.createElement(Empty));

    const emptyImage = screen.getByRole('img', { name: '' });
    expect(emptyImage).toHaveAttribute('src', '/img/empty.svg');
    expect(emptyImage).toHaveAttribute('alt', '');
  });
});
