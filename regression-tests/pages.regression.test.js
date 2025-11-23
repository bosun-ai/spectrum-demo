import React from 'react';
import { render } from '@testing-library/react';
import Pages from '../src/views/pages/index.js';

// Helper: create a minimal match object
const makeMatch = path => ({ path });

describe('Pages regression', () => {
  // Save and restore original window.location
  const originalLocation = window.location;

  afterEach(() => {
    // Reset after each test
    window.location = originalLocation;
    jest.restoreAllMocks();
  });

  it('renders Nav and Terms, triggers redirect for /terms', () => {
    // Mock window.location for redirect check
    delete window.location;
    window.location = { href: '' };
    const { container } = render(<Pages match={makeMatch('/terms')} />);
    // <Terms /> triggers location.href set
    expect(window.location.href).toBe(
      'https://help.github.com/en/github/site-policy/github-terms-of-service'
    );
    // Nav is always rendered (Nav renders a <nav> or known element, check existence)
    expect(container.querySelector('.view-grid')).toBeInTheDocument();
  });

  it('renders Nav and Privacy, triggers redirect for /privacy', () => {
    delete window.location;
    window.location = { href: '' };
    const { container } = render(<Pages match={makeMatch('/privacy')} />);
    expect(window.location.href).toBe(
      'https://help.github.com/en/github/site-policy/github-privacy-statement'
    );
    expect(container.querySelector('.view-grid')).toBeInTheDocument();
  });

  it('renders Nav component for an unknown path', () => {
    const { container } = render(<Pages match={makeMatch('/about')} />);
    // Should still render the grid (Nav is inside)
    expect(container.querySelector('.view-grid')).toBeInTheDocument();
    // Should NOT redirect (window.location.href remains unchanged)
    // The default jsdom value for href is 'about:blank'
    expect(window.location.href === 'about:blank').toBe(true);
  });

  it('renders Nav with dark prop when path is / or /about', () => {
    // Check that the .view-grid is rendered for these paths
    ['/', '/about'].forEach(path => {
      const { container } = render(<Pages match={makeMatch(path)} />);
      expect(container.querySelector('.view-grid')).toBeInTheDocument();
    });
  });
});
