const React = require('react');
const { render, screen } = require('@testing-library/react');

const { RealmLogo } = require('../src/views/pages/components/logos');

describe('RealmLogo regression', () => {
  it('renders the correct Realm brand asset', () => {
    render(React.createElement(RealmLogo));

    const logoImage = screen.getByRole('img', { name: '' });
    expect(logoImage).toHaveAttribute('src', '/img/logos/realm.svg');
    expect(logoImage).toHaveAttribute('alt', '');
  });
});
