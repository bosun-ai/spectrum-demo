// Regression test for the Routes component
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Mock raw-loader import in reset.css.js is global via moduleNameMapper

import Routes from 'src/routes';

describe('Routes regression', () => {
  it('renders the explore page at /explore', async () => {
    // Create a minimal mock Apollo client (v2)
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      // Provide a dummy link or leave undefined for tests that don't hit network
      link: {
        request: () => {},
        // Apollo 2.x expects a link or a network interface
        // If you see errors, consider using ApolloLink.empty() or a test link
      },
    });
    // Render the Routes component inside ApolloProvider and MemoryRouter at /explore
    const { findByTestId } = render(
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={['/explore']}>
          <Routes />
        </MemoryRouter>
      </ApolloProvider>
    );
    // The explore page should have data-cy="explore-page" according to implementation
    const explorePage = await findByTestId('explore-page');
    expect(explorePage).toBeInTheDocument();
  });
});
