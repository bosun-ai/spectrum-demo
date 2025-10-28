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

// Minimal stub state for all required connected components
const initialState = {
  modals: { modalProps: {}, activeModal: '' },
  toasts: { toasts: [] },
  gallery: { threadId: null },
  globals: { websocketConnection: null },
};

describe('Routes regression', () => {
  it('renders without crashing (smoke regression)', () => {
    const store = createStore((s = initialState) => s, initialState);
    const theme = { brand: { alt: '#cccccc' } };
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: { request: () => {} },
    });
    // Just render; if this throws, it's a regression.
    expect(() => {
      render(
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
    }).not.toThrow();
  });
});
