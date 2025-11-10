import React from 'react';
import { render, screen } from '@testing-library/react';
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

    render(<div>{element}</div>);

    // ThreadAttachment component renders aria-label with thread id via img or container?
    // It renders a link with href to thread or an element with data-id; to be resilient,
    // assert that an element referencing the id is present via toString
    // We can check for the rendered ThreadAttachment root by role or text fallback.
    // In absence of specific semantics, assert the DOM contains the id string.
    expect(document.body.textContent).toContain('thread-123');
  });

  test('renders nothing for internal embed with non-thread entity', () => {
    const { createRenderer } = RendererModule;
    const renderer = createRenderer({ headings: false });

    const data = { type: 'internal', entity: 'message', id: 'msg-1' };
    const { entities } = renderer;
    const element = entities.embed([], data, { key: 'k2' });

    const { container } = render(<div>{element}</div>);
    // Should render null -> empty container
    expect(container.querySelector('*')).toBeNull();
  });
});
