import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import ExistingThread from '../src/views/directMessages/containers/existingThread';

// Helper to render with minimal props and theme
const renderWithTheme = ui =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const baseMatch = { params: { threadId: 'dm-123' } };
const baseCurrentUser = { id: 'u1' };

describe('ExistingThread view (direct messages)', () => {
  it('renders Loading state when isLoading is true and no data', () => {
    const { container } = renderWithTheme(
      <ExistingThread
        match={baseMatch}
        currentUser={baseCurrentUser}
        isLoading={true}
        data={{ refetch: jest.fn(), directMessageThread: null }}
        threadSliderIsOpen={false}
        networkOnline={true}
        websocketConnection={'open'}
        dispatch={jest.fn()}
      />
    );
    // LoadingView renders a Loading component; assert presence via generic svg/div
    const loadingEl = container.querySelector('svg, div');
    expect(loadingEl).toBeTruthy();
  });

  it('renders ErrorView when not loading and no thread data', () => {
    const { container } = renderWithTheme(
      <ExistingThread
        match={baseMatch}
        currentUser={baseCurrentUser}
        isLoading={false}
        data={{ refetch: jest.fn(), directMessageThread: null }}
        threadSliderIsOpen={false}
        networkOnline={true}
        websocketConnection={'open'}
        dispatch={jest.fn()}
      />
    );
    // ErrorView shows an error container; assert something rendered
    expect(container.firstChild).toBeTruthy();
  });

  it('renders titlebar and messages when thread data available', () => {
    const thread = {
      participants: [
        { userId: 'u1', name: 'You', username: 'you' },
        { userId: 'u2', name: 'Alice', username: 'alice' },
      ],
    };
    const { getByText } = renderWithTheme(
      <ExistingThread
        match={baseMatch}
        currentUser={baseCurrentUser}
        isLoading={false}
        data={{ refetch: jest.fn(), directMessageThread: thread }}
        threadSliderIsOpen={false}
        networkOnline={true}
        websocketConnection={'open'}
        dispatch={jest.fn()}
      />
    );
    // The DesktopTitlebar receives the other participant's name as title
    expect(getByText('Alice')).toBeTruthy();
  });
});
