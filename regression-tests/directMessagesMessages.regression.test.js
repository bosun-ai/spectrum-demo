import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
// Import the unwrapped component via the HOC's WrappedComponent
import MessagesDefault from '../src/views/directMessages/components/messages';
// Use the unwrapped inner class component
const MessagesWithData = MessagesDefault.WrappedComponent;
// Also stub ChatMessages to avoid Apollo in withCurrentUser
jest.mock('../src/components/messageGroup', () => {
  const React = require('react');
  const DirectMessages = ({ messages }) => (
    <div>
      {messages.flat().map(m => (
        <div key={m.id}>{m.content && m.content.body}</div>
      ))}
    </div>
  );
  return DirectMessages;
});

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
  const baseMsg = (id, body) => ({
    id,
    timestamp: new Date().toISOString(),
    author: { user: { id: 'u1' } },
    content: { body },
  });
  const msg1 = baseMsg('m1', 'Hello');
  const msg2 = baseMsg('m2', 'World');
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
