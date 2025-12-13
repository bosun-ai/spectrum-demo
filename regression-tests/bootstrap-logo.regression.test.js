const React = require('react');
const { render } = require('@testing-library/react');

// Import the component from the project source
const { BootstrapLogo } = require('../src/views/pages/components/logos');

/**
 * Regression test: verifies BootstrapLogo renders a styled <img>
 * with the expected src and alt attributes.
 * Runs in jsdom via regression-tests/jest.config.js.
 */
test('BootstrapLogo renders with correct src and alt', () => {
  const element = React.createElement(BootstrapLogo, null, null);
  const { getByRole } = render(element);

  // The component renders an <img> with empty alt, so role is 'img'
  const img = getByRole('img');
  expect(img).toBeInTheDocument();
  expect(img.getAttribute('src')).toBe('/img/logos/bootstrap.svg');
  expect(img.getAttribute('alt')).toBe('');
});
