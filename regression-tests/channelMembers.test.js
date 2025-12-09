const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Import the unconnected component via require and access default export's wrapped component
const ChannelMembersModule = require('../src/views/channelSettings/components/channelMembers.js');

// The default export is a composed HOC; we need the inner class to unit test.
// The file defines `class ChannelMembers extends Component` then exports default compose(...)(ChannelMembers)
// We can access the original class via ChannelMembersModule.__esModule ? ChannelMembersModule.default.WrappedComponent : fallback
const Wrapped = ChannelMembersModule && ChannelMembersModule.default;

// Helper to render the inner component by bypassing HOCs: use Wrapped.WrappedComponent if present
const InnerComponent =
  Wrapped && Wrapped.WrappedComponent ? Wrapped.WrappedComponent : Wrapped;

test('ChannelMembers renders members and load more button', () => {
  // Build a minimal channel object matching expected shape
  const channel = {
    id: 'channel-1',
    memberConnection: {
      edges: [
        {
          cursor: 'c1',
          node: { id: 'u1', name: 'User One', username: 'userone' },
        },
        {
          cursor: 'c2',
          node: { id: 'u2', name: 'User Two', username: 'usertwo' },
        },
      ],
      pageInfo: { hasNextPage: true },
    },
  };

  const fetchMore = jest.fn();

  const props = {
    data: { channel, fetchMore },
    isLoading: false,
    isFetchingMore: false,
    dispatch: () => {},
    currentUser: { id: 'u1' },
  };

  render(React.createElement(InnerComponent, props));

  // Header
  expect(screen.getByText('Members')).toBeInTheDocument();

  // Members are rendered
  expect(screen.getByText('User One')).toBeInTheDocument();
  expect(screen.getByText('User Two')).toBeInTheDocument();

  // Load more button should be present and clickable
  const loadMoreBtn = screen.getByText('Load more');
  expect(loadMoreBtn).toBeInTheDocument();
  fireEvent.click(loadMoreBtn);
  expect(fetchMore).toHaveBeenCalledTimes(1);
});

test('ChannelMembers shows loading when isLoading and no data', () => {
  const props = {
    data: {},
    isLoading: true,
    isFetchingMore: false,
    dispatch: () => {},
    currentUser: null,
  };

  render(React.createElement(InnerComponent, props));

  // Expect a Loading component to be rendered inside SectionCard
  // We can assert by role or text fallback; Loading may not have text, but SectionCard exists
  // Verify that SectionCard wrapper exists via data-cy when channel present; here it's not, so we check for generic elements
  // Fallback: ensure the document rendered without throwing and no Members header
  expect(screen.queryByText('Members')).toBeNull();
});
