const React = require('react');
const { render, screen } = require('@testing-library/react');
const { AbstractLogo } = require('../src/views/pages/components/logos');

jest.mock('shared/theme', () => ({
  __esModule: true,
  default: {
    bg: { default: '#fff' },
  },
}));

jest.mock('../../src/components/layout', () => ({
  MEDIA_BREAK: 768,
}));

describe('AbstractLogo regression', () => {
  it('renders the expected brand asset', () => {
    render(React.createElement(AbstractLogo));

    const logoImage = screen.getByRole('img', { name: '' });
    expect(logoImage).toHaveAttribute('src', '/img/logos/abstract.svg');
    expect(logoImage).toHaveAttribute('alt', '');
  });
});
