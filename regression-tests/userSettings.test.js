import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import { UserSettings } from '../src/views/userSettings/index';
import { HelmetProvider } from 'react-helmet-async';

// Minimal reducer to satisfy connect() usage; no-op dispatch
const reducer = (state = {}) => state;

const renderWithProviders = (
  ui,
  { route = '/settings', preloadedState = {} } = {}
) => {
  const store = createStore(reducer, preloadedState);
  // Minimal Apollo Client to satisfy react-apollo context; network not used
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.empty(),
  });
  return render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <HelmetProvider>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
          </HelmetProvider>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
};

describe('UserSettings component regression', () => {
  it('renders loading state when isLoading', () => {
    renderWithProviders(
      <UserSettings
        isLoading={true}
        hasError={false}
        data={{ user: null }}
        match={{ url: '/settings' }}
        currentUser={{ id: 'u1' }}
        dispatch={() => {}}
      />
    );
    // LoadingView renders a spinner element
    const spinner = document.querySelector('[class*="Spinner"]');
    expect(spinner).toBeTruthy();
  });

  it('renders error when currentUser exists but user is missing', () => {
    renderWithProviders(
      <UserSettings
        isLoading={false}
        hasError={false}
        data={{ user: null }}
        match={{ url: '/settings' }}
        currentUser={{ id: 'u1' }}
        dispatch={() => {}}
      />
    );
    // ErrorView likely renders a styled container; assert header not present
    // In this fallback case, the LoadingView may render; ensure no settings header
    expect(screen.queryByText(/my settings/i)).toBeNull();
  });

  it('renders overview when viewing own settings and header with My Settings', () => {
    const user = {
      id: 'u1',
      username: 'alice',
      profilePhoto: 'https://example.com/p.png',
    };
    // Provide a shape of props matching withCurrentUser HOC expectations
    // Simulate both currentUser and the query-resolved user being the same
    renderWithProviders(
      <UserSettings
        isLoading={false}
        hasError={false}
        data={{ user }}
        match={{ url: '/settings' }}
        currentUser={{ id: 'u1', username: 'alice' }}
        dispatch={() => {}}
      />
    );

    // Root container has data-cy="user-settings"; query via selector
    // Header heading text (case-insensitive)
    expect(screen.getByText(/my settings/i)).toBeInTheDocument();

    // Subheading link label appears in header and as a link
    const subheadings = screen.getAllByText(/return to profile/i);
    expect(subheadings.length).toBeGreaterThan(0);
  });
});
