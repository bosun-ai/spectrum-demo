// Regression test for the Routes component
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Mock raw-loader import in reset.css.js to avoid Jest error
// This is global via moduleNameMapper in jest.config.js

import Routes from 'src/routes';

describe('Routes regression', () => {
  it('renders the explore page at /explore', async () => {
    // Create a minimal mock Apollo client
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      uri: '/graphql', // Not actually contacted
      defaultOptions: {
        watchQuery: { fetchPolicy: 'never' },
        query: { fetchPolicy: 'never' },
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
