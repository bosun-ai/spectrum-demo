import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import theme from '../shared/theme';
import ActionBar from '../src/views/thread/components/actionBar';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';

// Minimal thread shape based on usage: only passed through to ActionsDropdown
const mockThread = {
  id: 'thread-1',
  content: { title: 'Test thread' },
};

describe('ActionBar component', () => {
  it('renders the ActionsDropdown inside the ActionBarContainer', () => {
    // Minimal Redux store to satisfy connected component
    const store = createStore((state = {}) => state);
    // Minimal Apollo client to satisfy withCurrentUser HOC
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.empty(),
    });
    const { container } = render(
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <ActionBar thread={mockThread} />
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
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
