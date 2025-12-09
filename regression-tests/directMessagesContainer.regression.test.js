const React = require('react');
const { render, screen } = require('@testing-library/react');

// The container is the default export connected via react-redux
const DirectMessages = require('../src/views/directMessages/containers/index')
  .default;

// Mock redux connect to pass through the component
jest.mock('react-redux', () => ({
  connect: () => comp => comp,
}));

// Mock layout components used in render tree to simple wrappers
jest.mock('../src/components/layout', () => ({
  ViewGrid: ({ children }) =>
    React.createElement('div', { 'data-testid': 'view-grid' }, children),
  SecondaryPrimaryColumnGrid: ({ children }) =>
    React.createElement('div', { 'data-testid': 'grid' }, children),
  PrimaryColumn: ({ children }) =>
    React.createElement('div', { 'data-testid': 'primary' }, children),
}));

// Mock styled column and empty-state components with identifiable markers
jest.mock('../src/views/directMessages/style', () => ({
  StyledSecondaryColumn: ({ children }) =>
    React.createElement('div', { 'data-testid': 'secondary' }, children),
  NoCommunitySelected: ({ children }) =>
    React.createElement('div', { 'data-testid': 'no-selection' }, children),
  NoCommunityHeading: ({ children }) =>
    React.createElement(
      'h2',
      { 'data-testid': 'no-selection-heading' },
      children
    ),
}));

// Mock Head to render the title prop as text
jest.mock('../src/components/head', () => props =>
  React.createElement('span', { 'data-testid': 'head-title' }, props.title)
);

// Mock threads list and existing thread components
jest.mock('../src/views/directMessages/components/threadsList', () => props =>
  React.createElement(
    'div',
    { 'data-testid': 'threads-list' },
    `active:${props.activeThreadId || ''}`
  )
);
jest.mock(
  '../src/views/directMessages/containers/existingThread',
  () => props =>
    React.createElement(
      'div',
      { 'data-testid': 'existing-thread' },
      `id:${props.id}`
    )
);

// Mock titlebar action to observe dispatch calls without needing a store
const setTitlebarProps = jest.fn(() => ({ type: 'SET_TITLEBAR_PROPS' }));
jest.mock('../src/actions/titlebar', () => ({
  setTitlebarProps: (...args) => setTitlebarProps(...args),
}));

const makeMatch = params => ({ params });

test('renders empty state when no thread selected', () => {
  const match = makeMatch({});
  const dispatch = jest.fn();

  render(React.createElement(DirectMessages, { match, dispatch }));

  // Threads list renders with no active id
  expect(screen.getByTestId('threads-list')).toHaveTextContent('active:');
  // Empty state shows heading and head title
  expect(screen.getByTestId('no-selection')).toBeInTheDocument();
  expect(screen.getByTestId('no-selection-heading')).toHaveTextContent(
    /No conversation selected/i
  );
  expect(screen.getByTestId('head-title')).toHaveTextContent('Messages');
  // Titlebar set on mount
  expect(setTitlebarProps).toHaveBeenCalledWith({ title: 'Messages' });
});

test('renders existing thread when threadId present', () => {
  const match = makeMatch({ threadId: 'dm-123' });
  const dispatch = jest.fn();

  render(React.createElement(DirectMessages, { match, dispatch }));

  // Threads list gets active id
  expect(screen.getByTestId('threads-list')).toHaveTextContent('active:dm-123');
  // ExistingThread renders with the id
  expect(screen.getByTestId('existing-thread')).toHaveTextContent('id:dm-123');
  // Empty state not shown
  expect(screen.queryByTestId('no-selection')).not.toBeInTheDocument();
});

test('resets titlebar when threadId is removed', () => {
  const dispatch = jest.fn();
  const { rerender } = render(
    React.createElement(DirectMessages, {
      match: makeMatch({ threadId: 'dm-456' }),
      dispatch,
    })
  );

  // Remove the threadId and trigger update
  rerender(
    React.createElement(DirectMessages, {
      match: makeMatch({}),
      dispatch,
    })
  );

  // Titlebar should be set back to Messages
  expect(setTitlebarProps).toHaveBeenCalledWith({ title: 'Messages' });
});
