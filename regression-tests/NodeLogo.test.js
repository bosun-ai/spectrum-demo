// Regression test for NodeLogo component
// Uses React.createElement (no JSX) to match setup constraints

import React from 'react';
import { render, fireEvent } from '@testing-library/react';

// Import the component under test
import { NodeLogo } from '../src/views/pages/components/logos';

describe('NodeLogo', () => {
  it('renders an img with the nodejs logo src and empty alt', () => {
    const { container } = render(React.createElement(NodeLogo));
    const img = container.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/img/logos/nodejs.svg');
    expect(img.getAttribute('alt')).toBe('');
  });

  it('applies styled-components class and remains mounted on resize', () => {
    const { container } = render(React.createElement(NodeLogo));
    const img = container.querySelector('img');

    // styled-components injects a generated className; assert presence to ensure styling is applied
    expect(img.className).toBeTruthy();

    // Simulate viewport resize to trigger media query; jsdom won't recompute CSS,
    // but this serves as a smoke test to ensure component remains mounted.
    // Fire a resize event for completeness.
    fireEvent(window, new Event('resize'));
    expect(container.querySelector('img')).toBe(img);
  });
});
