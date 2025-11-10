import React from 'react';
import { render, screen } from '@testing-library/react';
import Messages from '../src/views/directMessages/components/messages';

// Minimal regression: renders loading when isLoading, and messages when provided
test('MessagesWithData renders loading and messages list', () => {
  // Render loading state
  const { rerender } = render(
    <Messages
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
  );

  // Loading component renders inside wrapper
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Provide a couple messages and a minimal thread
  const msg1 = { id: 'm1', content: { body: 'Hello' } };
  const msg2 = { id: 'm2', content: { body: 'World' } };
  const edges = [{ node: msg1 }, { node: msg2 }];

  rerender(
    <Messages
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
  );

  // ChatMessages should render; we don't assert internals, just presence of text bodies
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
  expect(screen.getByText(/world/i)).toBeInTheDocument();
});
