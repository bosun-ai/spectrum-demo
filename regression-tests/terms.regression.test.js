import React from 'react';
import { render } from '@testing-library/react';
import Terms from '../src/views/pages/terms/index.js';

describe('Terms regression', () => {
  // Save the original window.location
  const originalLocation = window.location;

  afterEach(() => {
    // Restore window.location to prevent test pollution
    window.location = originalLocation;
    jest.restoreAllMocks();
  });

  it('redirects to the correct terms of service URL on mount', () => {
    // Remove existing window.location and create a mock
    delete window.location;
    window.location = { href: '' };
    render(<Terms />);
    expect(window.location.href).toBe(
      'https://help.github.com/en/github/site-policy/github-terms-of-service'
    );
  });
});
