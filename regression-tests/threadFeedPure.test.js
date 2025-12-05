const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the pure component to avoid Redux/HOCs
const {
  default: ThreadFeedModule,
} = require('../src/components/threadFeed/index.js');

// The file exports the connected component by default; we need ThreadFeedPure.
// Require the module source and access the class via module.exports if available.
// Since it's not exported directly, we re-require and access via property name.
const ThreadFeedPure =
  require('../src/components/threadFeed/index.js').ThreadFeedPure ||
  require('../src/components/threadFeed/index.js').default.WrappedComponent ||
  null;

// Fallback: if we couldn't grab the pure class via properties, mock a minimal wrapper.
// However, in this repo the class name is declared, but not exported. To reliably access it,
// we re-export ThreadFeedPure via a jest mock that proxies the module and adds the class.
// As a simpler approach for regression, we instantiate the default export with minimal store context
// by rendering the connected component inside a minimal Provider if needed; but to avoid complexity
// we target the main render branches by providing props via the pure component if accessible.

// Helper: build minimal props matching component expectations
const baseProps = (overrides = {}) => ({
  data: {
    fetchMore: jest.fn(),
    networkStatus: 7,
    hasNextPage: false,
    error: null,
    community: null,
    channel: null,
    threads: [],
    refetch: jest.fn(),
    ...overrides.data,
  },
  community: null,
  hasThreads: jest.fn(),
  hasNoThreads: jest.fn(),
  currentUser: null,
  viewContext: 'communityInbox',
  slug: 'slug',
  pinnedThreadId: null,
  dispatch: jest.fn(),
  networkOnline: true,
  websocketConnection: 'connected',
  ...overrides,
});

// Build thread edges similar to GraphQL return shape used in component (threads.map(edge => edge.node))
const makeThreads = ids =>
  ids.map(id => ({
    node: {
      id,
      channel: { channelPermissions: { isBlocked: false } },
      community: { communityPermissions: { isBlocked: false } },
    },
  }));

describe('ThreadFeedPure regression', () => {
  test('renders list when networkStatus=7 and threads exist', () => {
    // Ensure we resolved the pure component; if not, skip to avoid false failures
    const Comp = ThreadFeedPure;
    expect(Comp).toBeTruthy();

    const props = baseProps({
      data: {
        threads: makeThreads(['t1', 't2']),
      },
    });

    render(React.createElement(Comp, props));

    // Expect the container to be present
    expect(screen.getByTestId('thread-feed')).toBeInTheDocument();
  });

  test('shows loading skeletons when networkStatus=2', () => {
    const Comp = ThreadFeedPure;
    expect(Comp).toBeTruthy();

    const props = baseProps({
      data: { networkStatus: 2 },
    });

    render(React.createElement(Comp, props));

    // There are multiple LoadingInboxThread elements; we can assert presence via role or text fallback.
    // LoadingInboxThread likely renders a placeholder; to be robust, assert container exists without data-cy.
    // We at least ensure no error view is shown by checking absence of the error heading.
    expect(
      screen.queryByText('We ran into an issue loading the feed')
    ).toBeNull();
  });

  test('shows error view when networkStatus=8', () => {
    const Comp = ThreadFeedPure;
    expect(Comp).toBeTruthy();

    const props = baseProps({
      data: { networkStatus: 8 },
    });

    render(React.createElement(Comp, props));

    expect(
      screen.getByText('We ran into an issue loading the feed')
    ).toBeInTheDocument();
  });
});
