import React from 'react';
import { render, screen } from '@testing-library/react';
import ThreadContainer from '../src/views/thread/container';
// Prevent styled-components from trying to style an undefined Link
jest.mock('react-router-dom', () => {
  const Actual = jest.requireActual('react-router-dom');
  const Link = ({ children, ...props }) => <a {...props}>{children}</a>;
  return {
    ...Actual,
    Link,
    withRouter: Comp => props => <Comp {...props} />,
  };
});

// Minimal mocks to satisfy ThreadContainer composition HOCs
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => props => <Comp {...props} />,
}));
jest.mock('react-apollo', () => ({
  withApollo: Comp => props => <Comp {...props} client={{}} />,
}));
jest.mock('react-redux', () => ({
  connect: () => Comp => props => <Comp {...props} dispatch={() => {}} />,
}));
jest.mock('../src/components/viewNetworkHandler', () => {
  const View = Comp => props => <Comp {...props} isLoading={false} />;
  return {
    __esModule: true,
    default: View,
  };
});

// Mock the graphql HOC export used by ThreadContainer importer
jest.mock('../shared/graphql/queries/thread/getThread', () => ({
  getThreadByMatch: Comp => props => (
    <Comp {...props} data={props.data || { thread: null }} />
  ),
}));

// Child components render simple placeholders to avoid complex internals
jest.mock('../src/views/thread/components/stickyHeader', () => props => (
  <div data-testid="sticky-header">sticky</div>
));
jest.mock('../src/views/thread/components/threadDetail', () => props => (
  <div data-testid="thread-detail">detail</div>
));
jest.mock('../src/views/thread/components/messagesSubscriber', () => props => (
  <div data-testid="messages-subscriber">messages</div>
));
jest.mock('../src/views/thread/components/threadHead', () => props => (
  <div data-testid="thread-head">head</div>
));
jest.mock('../src/components/communitySidebar', () => props => (
  <div data-testid="community-sidebar">sidebar</div>
));
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => <div>{children}</div>,
}));

// Layout components render children directly
jest.mock('../src/components/layout', () => ({
  ViewGrid: ({ children, ...rest }) => (
    <div data-cy={rest['data-cy'] || 'thread-view'}>{children}</div>
  ),
  SecondaryPrimaryColumnGrid: ({ children }) => <div>{children}</div>,
  PrimaryColumn: ({ children }) => <div>{children}</div>,
  SecondaryColumn: ({ children }) => <div>{children}</div>,
  SingleColumnGrid: ({ children }) => <div>{children}</div>,
  CenteredGrid: ({ children }) => <div>{children}</div>,
}));

// Titlebar action not relevant for render assertions
jest.mock('../src/actions/titlebar', () => ({
  setTitlebarProps: p => ({ type: 'SET_TITLEBAR', payload: p }),
}));

// Helpers
jest.mock('../src/components/infiniteScroll/deduplicateChildren', () => ({
  deduplicateChildren: arr => arr,
}));

describe('ThreadContainer regression', () => {
  const baseThread = {
    id: 't1',
    watercooler: false,
    community: { id: 'c1', name: 'Community' },
    author: { user: { id: 'u1', name: 'Author' } },
    messageConnection: { edges: [] },
  };

  it('renders error view when thread is null', () => {
    const props = {
      data: { thread: null },
      isModal: false,
      className: 'cls',
      children: null,
    };
    render(<ThreadContainer {...props} />);
    // Should render the error view container
    expect(
      screen.getByText(/We ran into trouble loading this page/i)
    ).toBeInTheDocument();
    // ErrorView renders with data-cy="null-thread-view"
    const error = screen.queryByTestId('null-thread-view');
    expect(error).toBeInTheDocument();
    // If ErrorView doesn't expose testid, assert absence of head/detail
    expect(screen.queryByTestId('thread-head')).not.toBeInTheDocument();
    expect(screen.queryByTestId('thread-detail')).not.toBeInTheDocument();
  });

  it('renders thread view with head, detail, messages, and sidebar', () => {
    const props = {
      data: { thread: baseThread },
      isModal: false,
      className: 'cls',
      children: <div data-testid="child">child</div>,
    };
    render(<ThreadContainer {...props} />);
    // Thread head always renders
    expect(screen.getByTestId('thread-head')).toBeInTheDocument();
    // Main view grid
    expect(screen.getByText('child')).toBeInTheDocument();
    // Non-modal shows sidebar
    expect(screen.getByTestId('community-sidebar')).toBeInTheDocument();
    // Primary column contents
    expect(screen.getByTestId('sticky-header')).toBeInTheDocument();
    expect(screen.getByTestId('thread-detail')).toBeInTheDocument();
    expect(screen.getByTestId('messages-subscriber')).toBeInTheDocument();
  });

  it('renders single column when isModal', () => {
    const props = {
      data: { thread: baseThread },
      isModal: true,
      className: 'cls',
      children: null,
    };
    render(<ThreadContainer {...props} />);
    // In modal, sidebar should not render
    expect(screen.queryByTestId('community-sidebar')).not.toBeInTheDocument();
    // Primary column pieces still present
    expect(screen.getByTestId('sticky-header')).toBeInTheDocument();
    expect(screen.getByTestId('thread-detail')).toBeInTheDocument();
    expect(screen.getByTestId('messages-subscriber')).toBeInTheDocument();
    // Stretch marks modal with data-cy="thread-is-modal", but our layout mock won't render it;
    // we simply assert core pieces render.
  });
});
