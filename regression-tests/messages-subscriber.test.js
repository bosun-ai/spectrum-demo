// @flow
/**
 * Regression tests for Messages (messagesSubscriber.js) render behavior.
 * We avoid Apollo/network by mocking getThreadMessages and withRouter HOCs.
 */
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Mock withRouter to passthrough component and provide location prop
jest.mock('react-router-dom', () => ({
  withRouter: Comp => Comp,
}));

// Mock the GraphQL HOC to passthrough without injecting Apollo props
jest.mock('shared/graphql/queries/thread/getThreadMessageConnection', () => ({
  __esModule: true,
  default: Comp => Comp,
}));

// Mock viewNetworkHandler to passthrough
jest.mock('src/components/viewNetworkHandler', () => Comp => Comp);
// Mock styled modules used by Loading/NullMessages wrappers
jest.mock('src/views/thread/style', () => {
  const React = require('react');
  const Passthrough = ({ children, ...rest }) =>
    React.createElement('div', rest, children);
  return {
    Stretch: Passthrough,
    NullMessagesWrapper: Passthrough,
    NullCopy: Passthrough,
  };
});
// Mock button styles to avoid styled-components requiring Link
jest.mock('src/components/button/style', () => ({}));
// Mock Loading component to a placeholder div
jest.mock('src/components/loading', () => ({
  Loading: () => {
    const ReactLocal = require('react');
    return ReactLocal.createElement(
      'div',
      { 'data-testid': 'loading' },
      'Loading'
    );
  },
}));

// Stub NextPageButton to a simple button-like element exposing children and href
jest.mock('src/components/nextPageButton', () => {
  const ReactLocal = require('react');
  return function NextPageButton({ href, children }) {
    const label = typeof children === 'string' ? children : 'NextPage';
    return ReactLocal.createElement(
      'a',
      { 'data-testid': 'next-page', href: (href && href.search) || '' },
      label
    );
  };
});

// Mock message grouping to identity mapping for predictability
jest.mock('shared/clients/group-messages', () => ({
  sortAndGroupMessages: msgs => msgs,
}));

// Mock ChatMessages to a lightweight marker that shows count
jest.mock('src/components/messageGroup', () => {
  const ReactLocal = require('react');
  return function ChatMessages({ uniqueMessageCount }) {
    return ReactLocal.createElement(
      'div',
      { 'data-testid': 'chat-messages' },
      `count:${uniqueMessageCount}`
    );
  };
});

const Messages = require('src/views/thread/components/messagesSubscriber')
  .default;

const baseLocation = { pathname: '/thread/t1', search: '', hash: '' };

const makeEdge = (id, cursor = `c-${id}`) => ({ node: { id }, cursor });

const makeThread = (overrides = {}) => ({
  id: 't1',
  watercooler: false,
  messageConnection: {
    edges: [],
    pageInfo: { hasPreviousPage: false, hasNextPage: false },
  },
  ...overrides,
});

describe('MessagesSubscriber (render)', () => {
  test('renders NullMessages when no edges', () => {
    const props = {
      isWatercooler: false,
      data: { loading: false, thread: makeThread() },
      loadPreviousPage: jest.fn(),
      loadNextPage: jest.fn(),
      location: baseLocation,
      isLoading: false,
      isFetchingMore: false,
      hasError: false,
    };

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(Messages, props)
      )
    );

    // Null copy from NullMessages
    expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();
  });

  test('renders messages and prev/next page buttons based on pageInfo', () => {
    const thread = makeThread({
      messageConnection: {
        edges: [makeEdge('m1'), makeEdge('m2'), makeEdge('m3')],
        pageInfo: { hasPreviousPage: true, hasNextPage: true },
      },
    });
    const props = {
      isWatercooler: false,
      data: { loading: false, thread },
      loadPreviousPage: jest.fn(),
      loadNextPage: jest.fn(),
      location: baseLocation,
      isLoading: false,
      isFetchingMore: false,
      hasError: false,
    };

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(Messages, props)
      )
    );

    // ChatMessages receives uniqueMessageCount
    expect(screen.getByTestId('chat-messages')).toHaveTextContent('count:3');

    // Two pagination anchors should be rendered with appropriate labels
    expect(screen.getByText('Show previous messages')).toBeInTheDocument();
    expect(screen.getByText('Show more messages')).toBeInTheDocument();

    // Ensure href search params are composed
    const links = screen.getAllByTestId('next-page');
    expect(links.length).toBe(2);
    // First link uses msgsbefore from first edge cursor
    expect(links[0].getAttribute('href')).toMatch(/msgsbefore=c-m1/);
    // Second link uses msgsafter from last edge cursor
    expect(links[1].getAttribute('href')).toMatch(/msgsafter=c-m3/);
  });

  test('renders loading placeholder when isLoading and no thread', () => {
    const props = {
      isWatercooler: false,
      data: { loading: false, thread: null },
      loadPreviousPage: jest.fn(),
      loadNextPage: jest.fn(),
      location: baseLocation,
      isLoading: true,
      isFetchingMore: false,
      hasError: false,
    };

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(Messages, props)
      )
    );

    // Loading component renders within NullMessagesWrapper
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
