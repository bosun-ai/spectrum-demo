import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
// Import the unwrapped component to avoid Apollo/viewNetworkHandler requirements
import { default as MessagesModule } from '../src/views/directMessages/components/messages';
const MessagesWithData = MessagesModule.WrappedComponent || MessagesModule;

// Minimal regression: renders loading when isLoading, and messages when provided
test('MessagesWithData renders loading and messages list', () => {
  // Render loading state
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

  const { rerender } = render(
    <Wrapper>
      <MessagesWithData
        id="dm-1"
        data={{
          loading: true,
          directMessageThread: null,
          messages: [],
          hasNextPage: false,
          fetchMore: jest.fn(),
        }}
        isLoading={true}
        hasError={false}
        isFetchingMore={false}
      />
    </Wrapper>
  );

  // Loading component renders spinner inside wrapper
  expect(document.querySelector('[class*="Spinner"]')).toBeTruthy();

  // Provide a couple messages and a minimal thread
  const msg1 = { id: 'm1', content: { body: 'Hello' } };
  const msg2 = { id: 'm2', content: { body: 'World' } };
  const edges = [{ node: msg1 }, { node: msg2 }];

  rerender(
    <Wrapper>
      <MessagesWithData
        id="dm-1"
        data={{
          loading: false,
          directMessageThread: {
            id: 'thread-1',
            messageConnection: { edges },
          },
          messages: edges,
          hasNextPage: false,
          fetchMore: jest.fn(),
        }}
        isLoading={false}
        hasError={false}
        isFetchingMore={false}
      />
    </Wrapper>
  );

  // ChatMessages should render; we don't assert internals, just presence of text bodies
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
  expect(screen.getByText(/world/i)).toBeInTheDocument();
});
