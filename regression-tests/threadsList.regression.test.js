import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import ThreadsList from '../src/views/directMessages/components/threadsList.js';
import { MemoryRouter } from 'react-router-dom';

// Mock VisibilitySensor to immediately call onChange(true) and render children
jest.mock('react-visibility-sensor', () => {
  const React = require('react');
  return ({ onChange, children }) => {
    if (typeof onChange === 'function') onChange(true);
    return <div data-testid="visibility-sensor">{children}</div>;
  };
});

// Mock LoadingDM to a simple identifiable element
jest.mock('../src/components/loading', () => ({
  LoadingDM: () => <div data-testid="loading-dm">Loading...</div>,
}));

// Mock style container to a div
jest.mock('../src/views/directMessages/components/style', () => {
  const React = require('react');
  return {
    ThreadsListScrollContainer: ({ children }) => (
      <div data-testid="threads-scroll">{children}</div>
    ),
  };
});

// Minimal reducer for connected props
function reducer(
  state = {
    connectionStatus: { networkOnline: true, websocketConnection: 'open' },
  },
  action
) {
  return state;
}

function renderWithProviders(ui, { apolloOptions = {} } = {}) {
  const store = createStore(reducer);
  const client = new ApolloClient({
    link: new HttpLink({ uri: '/graphql', fetch: window.fetch.bind(window) }),
    cache: new InMemoryCache(),
    ssrMode: true,
    ...apolloOptions,
  });
  return render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={[{ pathname: '/messages' }]}>
          <React.Fragment>{ui}</React.Fragment>
        </MemoryRouter>
      </ApolloProvider>
    </Provider>
  );
}

// Helper to build dmData structure expected by ThreadsList
function buildDmData({ edges = [], hasNextPage = false, overrides = {} } = {}) {
  return {
    loading: false,
    networkStatus: 7,
    fetchMore: jest.fn(),
    refetch: jest.fn(),
    user: {
      directMessageThreadsConnection: {
        edges: edges.map(node => ({ node })),
        pageInfo: { hasNextPage },
      },
    },
    ...overrides,
  };
}

test('renders LoadingDMWithVisibility when hasNextPage and triggers fetchMore on visibility', () => {
  const thread = {
    id: 't1',
    threadLastActive: new Date().toISOString(),
  };
  const dmData = buildDmData({ edges: [thread], hasNextPage: true });

  renderWithProviders(
    <ThreadsList
      currentUser={{ id: 'me' }}
      dmData={dmData}
      isFetchingMore={false}
      activeThreadId={null}
      networkOnline={true}
      websocketConnection={'open'}
    />
  );

  // Threads container renders
  expect(screen.getByTestId('threads-scroll')).toBeInTheDocument();

  // LoadingDMs rendered (initial skeletons + visibility one)
  expect(screen.getAllByTestId('loading-dm').length).toBeGreaterThan(0);

  // VisibilitySensor called onChange(true) should trigger paginate -> fetchMore
  expect(dmData.fetchMore).toHaveBeenCalled();
});

test('does not call fetchMore when isFetchingMore=true', () => {
  const thread = { id: 't2', threadLastActive: new Date().toISOString() };
  const dmData = buildDmData({ edges: [thread], hasNextPage: true });

  renderWithProviders(
    <ThreadsList
      currentUser={{ id: 'me' }}
      dmData={dmData}
      isFetchingMore={true}
      activeThreadId={null}
      networkOnline={true}
      websocketConnection={'open'}
    />
  );

  // Loading indicators visible
  expect(screen.getAllByTestId('loading-dm').length).toBeGreaterThan(0);
  expect(dmData.fetchMore).not.toHaveBeenCalled();
});
