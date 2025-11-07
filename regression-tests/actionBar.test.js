import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import ActionBar from '../src/views/thread/components/actionBar';

// Minimal thread shape based on usage: only passed through to ActionsDropdown
const mockThread = {
  id: 'thread-1',
  content: { title: 'Test thread' },
};

describe('ActionBar component', () => {
  it('renders the ActionsDropdown inside the ActionBarContainer', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        {/* ActionBar is connected; provide minimal props via wrapping with Provider-less connect */}
        <ActionBar thread={mockThread} />
      </ThemeProvider>
    );

    // Assert the container exists
    const actionBarContainer = container.querySelector('div');
    expect(actionBarContainer).toBeTruthy();

    // ActionsDropdown renders a button or clickable element; look for it by role or by existence in DOM
    // Since ActionsDropdown implementation isn't imported here, assert that it mounted by checking for an element
    // within the first flex container inside ActionBarContainer
    const flexContainer = container.querySelector('div[style]');
    expect(flexContainer).toBeTruthy();

    // Basic smoke test: ensure something rendered within the flex container (ActionsDropdown subtree)
    expect(flexContainer.childElementCount).toBeGreaterThan(0);
  });
});
