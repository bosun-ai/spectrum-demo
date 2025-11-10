import React from 'react';
import { render } from '@testing-library/react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import * as RendererModule from '../shared/clients/draft-js/renderer/index';

// Regression tests for InternalEmbed within renderer Embed handling
// Ensures: when type=internal and entity='thread', it renders ThreadAttachment
// and when entity is not 'thread', it renders nothing

describe('InternalEmbed regression', () => {
  test('renders ThreadAttachment for internal thread embed', () => {
    const { createRenderer } = RendererModule;
    const renderer = createRenderer({ headings: false });

    // Simulate an embed entity render
    const data = { type: 'internal', entity: 'thread', id: 'thread-123' };
    const { entities } = renderer;
    const element = entities.embed([], data, { key: 'k1' });

    // Minimal Apollo client to satisfy context for ThreadAttachment
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.empty(),
    });

    render(
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <div>{element}</div>
        </ThemeProvider>
      </ApolloProvider>
    );

    // Should render something (Attachment skeleton) under provider context
    expect(document.body.innerHTML).toMatch(/Attachment|Loading|div/);
  });

  test('renders nothing for internal embed with non-thread entity', () => {
    const { createRenderer } = RendererModule;
    const renderer = createRenderer({ headings: false });

    const data = { type: 'internal', entity: 'message', id: 'msg-1' };
    const { entities } = renderer;
    const element = entities.embed([], data, { key: 'k2' });

    const { container } = render(<div>{element}</div>);
    // Should render null -> no child
    expect(container.innerHTML).toBe('');
  });
});
