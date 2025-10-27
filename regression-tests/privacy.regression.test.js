import React from 'react';
import { render } from '@testing-library/react';
import Privacy from '../src/views/pages/privacy/index';

describe('Privacy regression', () => {
  const PRIVACY_URL =
    'https://help.github.com/en/github/site-policy/github-privacy-statement';

  // Save and restore window.location.href after each test
  let originalHref;

  beforeEach(() => {
    // Save real href
    originalHref = window.location.href;
    // Redefine href setter/getter for spy
    let hrefValue = originalHref;
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      get() {
        return hrefValue;
      },
      set(val) {
        hrefValue = val;
      },
    });
  });
  afterEach(() => {
    // Restore the real href
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      value: originalHref,
      writable: true,
    });
  });

  it('redirects to the correct privacy URL on mount and renders nothing', () => {
    const { container } = render(<Privacy />);

    // Privacy component should have set window.location.href
    expect(window.location.href).toBe(PRIVACY_URL);

    // Should render nothing (container empty)
    // container.innerHTML will be an empty string
    expect(container.innerHTML).toBe('');
  });
});
