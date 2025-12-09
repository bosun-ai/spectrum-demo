const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the component under test
const ExistingThread = require('../src/views/directMessages/containers/existingThread')
  .default;

// Minimal stubs for children used inside ExistingThread
jest.mock('../src/views/directMessages/components/header', () => () => {
  return React.createElement('div', { 'data-testid': 'header' }, 'Header');
});
jest.mock('../src/views/directMessages/components/messages', () => props => {
  return React.createElement(
    'div',
    { 'data-testid': 'messages' },
    `Messages for ${props.id}`
  );
});

// Mock components used within render path
jest.mock('../src/components/titlebar', () => ({
  DesktopTitlebar: props =>
    React.createElement(
      'div',
      { 'data-testid': 'desktop-title', title: props.title || '' },
      props.title || ''
    ),
}));
jest.mock('../src/components/loading', () => ({
  Loading: () =>
    React.createElement('div', { 'data-testid': 'loading' }, 'Loading'),
}));
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) =>
    React.createElement(React.Fragment, null, children),
}));
jest.mock('../src/views/viewHelpers', () => ({
  LoadingView: () =>
    React.createElement(
      'div',
      { 'data-testid': 'loading-view' },
      'LoadingView'
    ),
  ErrorView: () =>
    React.createElement('div', { 'data-testid': 'error-view' }, 'ErrorView'),
}));
jest.mock('../src/components/avatar', () => ({
  UserAvatar: () =>
    React.createElement('div', { 'data-testid': 'user-avatar' }, 'Avatar'),
}));

// Helper to build props
const baseProps = ({
  data = {},
  isLoading = false,
  threadSliderIsOpen = false,
} = {}) => ({
  data: Object.assign({ refetch: jest.fn() }, data),
  isLoading,
  match: { params: { threadId: 'thread-1' } },
  id: 'thread-1',
  currentUser: { id: 'me' },
  threadSliderIsOpen,
  networkOnline: true,
  websocketConnection: 'open',
  dispatch: jest.fn(),
});

test('renders LoadingView when loading and no data yet', () => {
  const props = baseProps({
    isLoading: true,
    data: { directMessageThread: null },
  });
  render(React.createElement(ExistingThread, props));
  expect(screen.getByTestId('loading-view')).toBeInTheDocument();
});

test('renders ErrorView when not loading and no thread data', () => {
  const props = baseProps({
    isLoading: false,
    data: { directMessageThread: null },
  });
  render(React.createElement(ExistingThread, props));
  expect(screen.getByTestId('error-view')).toBeInTheDocument();
});

test('renders header and messages when thread data is present', () => {
  const thread = {
    id: 'thread-1',
    participants: [
      { userId: 'me', name: 'Me', username: 'me' },
      { userId: 'u2', name: 'Alice', username: 'alice' },
    ],
  };
  const props = baseProps({
    isLoading: false,
    data: { directMessageThread: thread },
  });
  render(React.createElement(ExistingThread, props));

  // Titlebar renders with participant name (excluding current user)
  expect(screen.getByTestId('desktop-title')).toHaveTextContent('Alice');
  // Child components present
  expect(screen.getByTestId('header')).toBeInTheDocument();
  expect(screen.getByTestId('messages')).toHaveTextContent(
    'Messages for thread-1'
  );
});
