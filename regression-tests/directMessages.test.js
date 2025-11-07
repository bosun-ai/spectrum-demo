import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import DirectMessages from '../src/views/directMessages/containers/index.js';

const mockStore = configureStore([]);

describe('DirectMessages container', () => {
  it('renders empty state when no threadId param', () => {
    const store = mockStore({});
    const match = { params: {} };

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DirectMessages match={match} />
        </ThemeProvider>
      </Provider>
    );

    // Expect the heading indicating no conversation selected
    expect(screen.getByText('No conversation selected')).toBeInTheDocument();
  });

  it('renders ExistingThread when threadId is present', () => {
    const store = mockStore({});
    const match = { params: { threadId: 'dm-123' } };

    const { container } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DirectMessages match={match} />
        </ThemeProvider>
      </Provider>
    );

    // ThreadsList is hidden on mobile via CSS when threadId is present; we assert ExistingThread mount
    // ExistingThread renders with a container; assert that No conversation text is not present
    expect(screen.queryByText('No conversation selected')).toBeNull();

    // Sanity check: ensure something rendered in the primary column
    const primary = container.querySelector('[grid-area="primary"], section');
    expect(primary).toBeTruthy();
  });
});
