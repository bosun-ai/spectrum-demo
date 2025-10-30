// Regression test for src/views/thread/container/index.js
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock subcomponents that ThreadContainer renders to avoid deep trees
jest.mock('src/views/viewHelpers', () => {
  const React = require('react');
  return {
    LoadingView: () =>
      React.createElement('div', { 'data-cy': 'loading-view' }),
    ErrorView: props => React.createElement('div', { ...props }, 'Error'),
  };
});
jest.mock('src/components/layout', () => {
  const React = require('react');
  return {
    ViewGrid: props => React.createElement('div', { ...props }),
    SecondaryPrimaryColumnGrid: props => React.createElement('div', props),
    PrimaryColumn: props => React.createElement('div', props),
    SecondaryColumn: props => React.createElement('div', props),
    SingleColumnGrid: props => React.createElement('div', props),
  };
});
jest.mock('src/actions/titlebar', () => ({
  setTitlebarProps: jest.fn(() => ({ type: 'SET_TITLE' })),
}));
jest.mock('src/components/error', () => {
  const React = require('react');
  return {
    ErrorBoundary: props => React.createElement('div', props),
  };
});
jest.mock('src/components/communitySidebar', () => {
  const React = require('react');
  return props =>
    React.createElement('aside', { 'data-cy': 'community-sidebar', ...props });
});
jest.mock('src/views/thread/components/stickyHeader', () => {
  const React = require('react');
  return props =>
    React.createElement('div', { 'data-cy': 'sticky-header', ...props });
});
jest.mock('src/views/thread/components/threadDetail', () => {
  const React = require('react');
  return props =>
    React.createElement('div', { 'data-cy': 'thread-detail', ...props });
});
jest.mock('src/views/thread/components/messagesSubscriber', () => {
  const React = require('react');
  return props =>
    React.createElement('div', { 'data-cy': 'messages-subscriber', ...props });
});
jest.mock('src/views/thread/components/threadHead', () => {
  const React = require('react');
  return props =>
    React.createElement('div', { 'data-cy': 'thread-head', ...props });
});

describe('ThreadContainer regression', () => {
  // Import the unwrapped component via default export chain
  const ThreadContainerModule = require('../src/views/thread/container/index.js');
  const ThreadContainer =
    ThreadContainerModule.default.WrappedComponent.WrappedComponent
      .WrappedComponent.WrappedComponent;

  it('renders LoadingView when isLoading', () => {
    render(
      React.createElement(ThreadContainer, {
        isLoading: true,
        data: {},
        dispatch: jest.fn(),
        children: null,
      })
    );
    expect(document.querySelector('[data-cy="loading-view"]')).toBeTruthy();
  });

  it('renders error view when thread is null', () => {
    render(
      React.createElement(ThreadContainer, {
        isLoading: false,
        data: { thread: null },
        dispatch: jest.fn(),
        children: null,
      })
    );
    const errorNode = document.querySelector('[data-cy="null-thread-view"]');
    expect(errorNode).toBeTruthy();
  });

  const baseThread = {
    id: 't1',
    watercooler: false,
    metaImage: null,
    type: 'discussion',
    community: { id: 'c1', name: 'Community', redirect: false, noindex: false },
    content: { title: 'Hello', body: 'World' },
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    author: { user: { id: 'u1', username: 'alice' } },
    messageConnection: { edges: [] },
  };

  it('renders thread view with sidebar in non-modal', () => {
    render(
      React.createElement(ThreadContainer, {
        isLoading: false,
        data: { thread: baseThread },
        dispatch: jest.fn(),
        children: null,
        isModal: false,
      })
    );
    // container
    expect(document.querySelector('[data-cy="thread-view"]')).toBeTruthy();
    // head + detail + messages
    expect(document.querySelector('[data-cy="thread-head"]')).toBeTruthy();
    expect(document.querySelector('[data-cy="thread-detail"]')).toBeTruthy();
    expect(
      document.querySelector('[data-cy="messages-subscriber"]')
    ).toBeTruthy();
    // sidebar present in non-modal
    expect(
      document.querySelector('[data-cy="community-sidebar"]')
    ).toBeTruthy();
  });

  it('renders single column and marks modal when isModal=true', () => {
    render(
      React.createElement(ThreadContainer, {
        isLoading: false,
        data: { thread: baseThread },
        dispatch: jest.fn(),
        children: null,
        isModal: true,
      })
    );
    // should tag stretch with data-cy=thread-is-modal
    expect(document.querySelector('[data-cy="thread-is-modal"]')).toBeTruthy();
    // sidebar should not be present
    expect(document.querySelector('[data-cy="community-sidebar"]')).toBeFalsy();
  });
});
