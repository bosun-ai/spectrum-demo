// Regression test for AbstractLogo component
// Uses React.createElement to avoid JSX per setup notes

import React from 'react';
import { render } from '@testing-library/react';

// Import the component from source
import { AbstractLogo } from '../src/views/pages/components/logos';

describe('AbstractLogo', () => {
  it('renders an img with the correct src and empty alt', () => {
    const { getByRole } = render(React.createElement(AbstractLogo));

    const img = getByRole('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/img/logos/abstract.svg');
    expect(img.getAttribute('alt')).toBe('');
  });

  it('applies a styled-components class on the img', () => {
    const { container } = render(React.createElement(AbstractLogo));
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.className).toMatch(/sc-/);
  });
});
