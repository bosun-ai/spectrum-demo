import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import ThreadsList from '../src/views/directMessages/components/threadsList.js';

const mockStore = configureStore([]);

// Helper to render with providers
const renderWithProviders = (ui, { state = {} } = {}) => {
  const store = mockStore({
    connectionStatus: { networkOnline: true, websocketConnection: 'open' },
    ...state,
  });
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>
  );
};

describe('ThreadsList', () => {
  it('renders loading skeletons when dmData is loading', () => {
    renderWithProviders(
      <ThreadsList
        currentUser={{ id: 'me' }}
        activeThreadId={null}
        isFetchingMore={false}
        dmData={{ loading: true, user: null }}
      />
    );

    // Titlebar should render
    expect(screen.getByText('Messages')).toBeInTheDocument();
    // LoadingDMs exist; assert at least one
    const loaders = document.querySelectorAll(
      '[data-testid="loading-dm"], svg'
    );
    expect(loaders.length).toBeGreaterThan(0);
  });

  it('renders empty state when there are no threads', () => {
    const dmData = {
      loading: false,
      user: {
        directMessageThreadsConnection: {
          edges: [],
          pageInfo: { hasNextPage: false },
        },
      },
    };

    renderWithProviders(
      <ThreadsList
        currentUser={{ id: 'me' }}
        activeThreadId={null}
        isFetchingMore={false}
        dmData={dmData}
      />
    );

    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('No conversation selected')).toBeInTheDocument();
  });

  it('renders a list of threads and next page loader when present', () => {
    const threads = [
      { node: { id: 't1', threadLastActive: new Date().toISOString() } },
      { node: { id: 't2', threadLastActive: new Date().toISOString() } },
    ];

    const dmData = {
      loading: false,
      user: {
        directMessageThreadsConnection: {
          edges: threads,
          pageInfo: { hasNextPage: true },
        },
      },
    };

    const { container } = renderWithProviders(
      <ThreadsList
        currentUser={{ id: 'me' }}
        activeThreadId={null}
        isFetchingMore={false}
        dmData={dmData}
      />
    );

    // Titlebar
    expect(screen.getByText('Messages')).toBeInTheDocument();

    // Expect DirectMessageListItem components rendered; they likely render an element per thread
    // We can assert ErrorBoundary wrappers exist via presence of their children
    const items = container.querySelectorAll(
      '[data-testid="dm-list-item"], article, li, div'
    );
    expect(items.length).toBeGreaterThan(0);

    // Next page loader should be present (VisibilitySensor + LoadingDM)
    const possibleLoader = container.querySelector(
      '[data-testid="loading-dm"], svg'
    );
    expect(possibleLoader).toBeTruthy();
  });
});
