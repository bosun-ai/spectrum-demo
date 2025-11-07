import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import ThreadDetailModule from '../src/views/thread/components/threadDetail';

// ThreadDetailModule default export is a composed HOC around ThreadDetailPure.
// We want to test the inner pure component behavior. The file exports
// the class named ThreadDetailPure; however it's not exported. To avoid
// reaching into non-exported internals, we exercise the default export
// with minimal props using a realistic thread object.

// Helper to build a minimal thread object matching GetThreadType shape
const buildThread = (overrides = {}) => ({
  id: 'thread-1',
  createdAt: new Date('2020-01-01T00:00:00Z').toISOString(),
  modifiedAt: null,
  editedBy: null,
  author: {
    user: {
      id: 'user-1',
      name: 'Alice Smith',
      username: 'alice',
      profilePhoto: 'https://example.com/alice.jpg',
    },
    roles: [],
  },
  content: {
    title: 'Test Thread Title',
    body: JSON.stringify({ entityMap: {}, blocks: [] }),
  },
  community: {
    name: 'Test Community',
    website: null,
    redirect: false,
  },
  channel: {
    id: 'channel-1',
    slug: 'general',
    community: {
      slug: 'test-community',
    },
  },
  ...overrides,
});

describe('ThreadDetailPure rendering', () => {
  it('renders title, author byline, and timestamp link', () => {
    const thread = buildThread();

    // Render within ThemeProvider for styled-components
    const { container } = render(
      <ThemeProvider theme={theme}>
        {/* Default export is composed component; pass required props */}
        {React.createElement(ThreadDetailModule, {
          // HOCs inject currentUser via withCurrentUser; but composing connect/withRouter
          // tolerates missing store by not using it directly in render path here.
          currentUser: { id: 'user-2', name: 'Bob' },
          thread,
          dispatch: () => {},
        })}
      </ThemeProvider>
    );

    // Title should be visible
    expect(screen.getByText('Test Thread Title')).toBeInTheDocument();

    // Byline shows author name and username
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('@alice')).toBeInTheDocument();

    // There should be a link to the thread route containing date text
    const link = container.querySelector(
      'a[href*="/test-community/general/thread/thread-1"]'
    );
    expect(link).toBeTruthy();
    // The link text includes formatted date, e.g., "Jan"; assert it has some content
    expect(link.textContent).toBeTruthy();
  });

  it('renders edited subtitle when modifiedAt present and different editor', () => {
    const thread = buildThread({
      modifiedAt: new Date('2020-01-02T00:00:00Z').toISOString(),
      editedBy: { user: { id: 'user-3', username: 'carol' } },
    });

    render(
      <ThemeProvider theme={theme}>
        {React.createElement(ThreadDetailModule, {
          currentUser: { id: 'user-2', name: 'Bob' },
          thread,
          dispatch: () => {},
        })}
      </ThemeProvider>
    );

    // Subtitle should include "Edited" and the editor username when different from author
    expect(screen.getByText(/Edited/i)).toBeInTheDocument();
    expect(screen.getByText(/@carol/)).toBeInTheDocument();
  });
});
