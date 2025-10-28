// Regression test for the Routes component
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider } from 'styled-components';

// Mock raw-loader import in reset.css.js is global via moduleNameMapper

import Routes from 'src/routes';

describe('Routes regression', () => {
  it('renders the explore page at /explore', async () => {
    // Minimal Redux store
    const store = createStore((s = {}) => s, {});
    // Minimal styled-components theme
    const theme = { brand: { alt: '#cccccc' } };
    // Minimal Apollo client (v2)
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: { request: () => {} },
    });
    // Render the Routes component inside all required providers
    const { findByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <MemoryRouter initialEntries={['/explore']}>
              <Routes />
            </MemoryRouter>
          </ApolloProvider>
        </Provider>
      </ThemeProvider>
    );
    // The explore page should have data-cy="explore-page" according to implementation
    const explorePage = await findByTestId('explore-page');
    expect(explorePage).toBeInTheDocument();
  });
});
