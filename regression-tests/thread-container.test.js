// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');
const { Provider } = require('react-redux');
const { createStore } = require('redux');

const emptyReducer = (state = {}) => state;
const renderWithProviders = ui => {
  const store = createStore(emptyReducer);
  return render(React.createElement(Provider, { store }, ui));
};

// Minimal mocks for child components used by ThreadContainer
jest.mock('src/views/thread/components/threadHead', () => {
  return function ThreadHead() {
    const R = require('react');
    return R.createElement(
      'div',
      { 'data-testid': 'thread-head' },
      'ThreadHead'
    );
  };
});
jest.mock('src/views/thread/components/stickyHeader', () => {
  return function StickyHeader() {
    const R = require('react');
    return R.createElement(
      'div',
      { 'data-testid': 'sticky-header' },
      'StickyHeader'
    );
  };
});
jest.mock('src/views/thread/components/threadDetail', () => {
  return function ThreadDetail() {
    const R = require('react');
    return R.createElement(
      'div',
      { 'data-testid': 'thread-detail' },
      'ThreadDetail'
    );
  };
});
jest.mock('src/views/thread/components/messagesSubscriber', () => {
  return function MessagesSubscriber() {
    const R = require('react');
    return R.createElement(
      'div',
      { 'data-testid': 'messages-subscriber' },
      'MessagesSubscriber'
    );
  };
});
jest.mock('src/components/communitySidebar', () => {
  return function CommunitySidebar() {
    const R = require('react');
    return R.createElement(
      'div',
      { 'data-testid': 'community-sidebar' },
      'CommunitySidebar'
    );
  };
});
jest.mock('src/views/viewHelpers', () => ({
  LoadingView: () => {
    const R = require('react');
    return R.createElement('div', { 'data-testid': 'loading-view' }, 'Loading');
  },
  ErrorView: props => {
    const R = require('react');
    return R.createElement(
      'div',
      { 'data-cy': props['data-cy'] || 'error-view' },
      'Error'
    );
  },
}));
jest.mock('src/components/layout', () => {
  const React = require('react');
  const Wrapper = ({ children, ...rest }) =>
    React.createElement('div', rest, children);
  return {
    ViewGrid: Wrapper,
    SecondaryPrimaryColumnGrid: Wrapper,
    PrimaryColumn: Wrapper,
    SecondaryColumn: Wrapper,
    SingleColumnGrid: Wrapper,
  };
});

// Mock styled components imported from src/views/thread/style
jest.mock('src/views/thread/style', () => {
  const React = require('react');
  const Stretch = ({ children, ...rest }) =>
    React.createElement('div', rest, children);
  return { Stretch };
});

// Avoid Apollo/CurrentUser HOCs requiring provider context
jest.mock('src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));
jest.mock('react-apollo', () => ({ withApollo: Comp => Comp }));
// Mock graphql HOC used in getThreadByMatch to avoid calling real react-apollo graphql
jest.mock('shared/graphql/queries/thread/getThread', () => ({
  getThreadByMatch: Comp => Comp,
}));

const ThreadContainer = require('../src/views/thread/container').default;

const baseThread = {
  id: 'thread-1',
  watercooler: false,
  author: { user: { id: 'user-1', name: 'Alice' } },
  community: { id: 'community-1', name: 'Test Community' },
  messageConnection: { edges: [] },
};

const getBaseProps = (overrides = {}) => ({
  data: { thread: baseThread },
  isLoading: false,
  dispatch: jest.fn(),
  isModal: false,
  children: null,
  ...overrides,
});

test('renders loading state', () => {
  renderWithProviders(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ThreadContainer, getBaseProps({ isLoading: true }))
    )
  );
  expect(screen.getByTestId('loading-view')).toBeInTheDocument();
});

test('renders error when no thread', () => {
  renderWithProviders(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(
        ThreadContainer,
        getBaseProps({ data: { thread: null } })
      )
    )
  );
  // ThreadContainer sets data-cy="null-thread-view" on ErrorView for null thread
  expect(screen.getByText('Error')).toBeInTheDocument();
  const errorEl = screen.getByText('Error');
  expect(errorEl.getAttribute('data-cy')).toBe('null-thread-view');
});

test('renders thread view with sidebar by default', () => {
  renderWithProviders(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ThreadContainer, getBaseProps())
    )
  );
  // Outer container
  expect(screen.getByText('ThreadHead')).toBeInTheDocument();
  expect(screen.getByText('StickyHeader')).toBeInTheDocument();
  expect(screen.getByText('ThreadDetail')).toBeInTheDocument();
  expect(screen.getByText('MessagesSubscriber')).toBeInTheDocument();
  // Sidebar visible when not modal
  expect(screen.getByText('CommunitySidebar')).toBeInTheDocument();
});

test('renders single column when isModal', () => {
  renderWithProviders(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ThreadContainer, getBaseProps({ isModal: true }))
    )
  );
  // Sidebar should not be rendered in modal view
  expect(screen.queryByText('CommunitySidebar')).toBeNull();
  // Stretch should mark modal via data-cy
  const modalMarker = screen.getByText('MessagesSubscriber').parentElement;
  // Walk up to find element with data-cy attribute set by Stretch wrapper
  let foundMarker = null;
  let el = modalMarker;
  for (let i = 0; i < 4 && el; i += 1) {
    if (el.getAttribute && el.getAttribute('data-cy') === 'thread-is-modal') {
      foundMarker = el;
      break;
    }
    el = el.parentElement;
  }
  expect(foundMarker).not.toBeNull();
});
