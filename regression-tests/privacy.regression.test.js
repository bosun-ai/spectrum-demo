import React from 'react';
import { render } from '@testing-library/react';
import Privacy from '../src/views/pages/privacy/index';

describe('Privacy regression', () => {
  const PRIVACY_URL =
    'https://help.github.com/en/github/site-policy/github-privacy-statement';

  let originalLocation;
  beforeEach(() => {
    // Save and replace window.location
    originalLocation = window.location;
    let hrefValue = 'http://localhost/'; // jsdom default
    // @ts-ignore
    delete window.location;
    // Minimal mock (only what we need)
    window.location = {
      get href() {
        return hrefValue;
      },
      set href(v) {
        hrefValue = v;
      },
    };
  });
  afterEach(() => {
    window.location = originalLocation;
  });

  it('redirects to the correct privacy URL on mount and renders nothing', () => {
    const { container } = render(<Privacy />);
    expect(window.location.href).toBe(PRIVACY_URL);
    expect(container.innerHTML).toBe('');
  });
});
