// Regression test for src/views/thread/components/threadDetail.js
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Mock subcomponents and helpers to keep the test focused
jest.mock('src/components/entities', () => {
  function UserListItem(props) {
    return React.createElement('div', {
      'data-cy': 'user-list-item',
      ...props,
    });
  }
  return { UserListItem };
});
jest.mock('src/components/threadRenderer', () => {
  function ThreadRenderer(props) {
    return React.createElement('div', {
      'data-cy': 'thread-renderer',
      ...props,
    });
  }
  return ThreadRenderer;
});
jest.mock('src/components/error', () => {
  function ErrorBoundary(props) {
    return React.createElement('div', {
      'data-cy': 'error-boundary',
      ...props,
    });
  }
  return { ErrorBoundary };
});
jest.mock('src/views/thread/components/actionBar', () => {
  function ActionBar(props) {
    return React.createElement('div', { 'data-cy': 'action-bar', ...props });
  }
  return ActionBar;
});
jest.mock('src/helpers/get-thread-link', () => () => '/thread/link');
jest.mock('shared/time-formatting', () => ({
  convertTimestampToDate: ts => `date:${ts}`,
}));
jest.mock('shared/time-difference', () => ({
  timeDifference: () => '1 hour ago',
}));

describe('ThreadDetailPure regression', () => {
  const module = require('../src/views/thread/components/threadDetail.js');
  const DefaultExport = module.default;
  const ThreadDetailPure = DefaultExport.WrappedComponent
    ? DefaultExport.WrappedComponent.WrappedComponent
    : DefaultExport;

  const baseThread = {
    id: 't1',
    createdAt: 1600000000000,
    modifiedAt: 1600001000000,
    author: {
      user: {
        id: 'u1',
        name: 'Alice',
        username: 'alice',
        profilePhoto: 'photo.jpg',
      },
      roles: ['member'],
    },
    editedBy: {
      user: { id: 'u2', username: 'bob' },
    },
    community: {
      name: 'MyCommunity',
      website: 'https://community.example.com',
      redirect: true,
    },
    content: {
      title: 'Hello World',
      body: JSON.stringify({ type: 'doc', content: [] }),
    },
  };

  it('renders byline, heading, subtitle, renderer, and action bar', () => {
    const currentUser = { id: 'u3' };
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ThreadDetailPure, {
          thread: baseThread,
          currentUser,
          dispatch: jest.fn(),
        })
      )
    );

    // Byline
    expect(document.querySelector('[data-cy="user-list-item"]')).toBeTruthy();
    // Heading shows title
    expect(screen.getByText('Hello World')).toBeTruthy();
    // Subtitle contains timestamp text and edited marker
    expect(screen.getByText(/date:/)).toBeTruthy();
    expect(screen.getByText(/Edited/i)).toBeTruthy();
    // ThreadRenderer receives parsed body
    const renderer = document.querySelector('[data-cy="thread-renderer"]');
    expect(renderer).toBeTruthy();
    expect(renderer.getAttribute('body')).toBeTruthy();
    // ActionBar rendered inside ErrorBoundary
    expect(document.querySelector('[data-cy="error-boundary"]')).toBeTruthy();
    expect(document.querySelector('[data-cy="action-bar"]')).toBeTruthy();
  });

  it('shows redirect notice when community has website and redirect', () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ThreadDetailPure, {
          thread: baseThread,
          currentUser: null,
          dispatch: jest.fn(),
        })
      )
    );
    // The notice contains community name and link
    expect(
      screen.getByText(/MyCommunity community has a new home/i)
    ).toBeTruthy();
    const link = screen.getByText(/Go to new community home/i).closest('a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://community.example.com');
  });

  it('updates state when receiving a different thread id', () => {
    const { rerender } = render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ThreadDetailPure, {
          thread: { ...baseThread, id: 't1' },
          currentUser: null,
          dispatch: jest.fn(),
        })
      )
    );
    // initial title
    expect(screen.getByText('Hello World')).toBeTruthy();
    const newThread = {
      ...baseThread,
      id: 't2',
      content: { title: 'New Title', body: JSON.stringify({}) },
    };
    rerender(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ThreadDetailPure, {
          thread: newThread,
          currentUser: null,
          dispatch: jest.fn(),
        })
      )
    );
    // should reflect updated title
    expect(screen.getByText('New Title')).toBeTruthy();
  });
});
