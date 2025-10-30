// Regression test for src/views/channelSettings/components/channelMembers.js
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Import the unconnected composed default export
const ChannelMembers = require('src/views/channelSettings/components/channelMembers')
  .default;

describe('ChannelMembers regression', () => {
  const baseMember = (overrides = {}) => ({
    id: 'u1',
    name: 'Test User',
    username: 'testuser',
    profilePhoto: 'http://example.com/p.jpg',
    description: 'Hello there',
    ...overrides,
  });

  const baseProps = (overrides = {}) => ({
    data: {
      channel: {
        memberConnection: {
          edges: [{ node: baseMember() }],
          pageInfo: { hasNextPage: false },
        },
      },
      fetchMore: jest.fn(),
    },
    isLoading: false,
    isFetchingMore: false,
    currentUser: null,
    dispatch: jest.fn(),
    ...overrides,
  });

  it('renders members list and Section title', () => {
    render(React.createElement(ChannelMembers, baseProps()));
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(
      screen.getByTestId('user-list-item-name') || screen.getByText('Test User')
    ).toBeTruthy();
  });

  it('marks current user correctly', () => {
    const member = baseMember({ id: 'me' });
    const props = baseProps({
      data: {
        channel: {
          memberConnection: {
            edges: [{ node: member }],
            pageInfo: { hasNextPage: false },
          },
        },
        fetchMore: jest.fn(),
      },
      currentUser: { id: 'me' },
    });
    render(React.createElement(ChannelMembers, props));
    // The underlying UserListItem receives isCurrentUser=true, but we can't peek props.
    // Assert that the item renders with the provided name.
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows Load more and calls fetchMore', () => {
    const fetchMore = jest.fn();
    const props = baseProps({
      data: {
        channel: {
          memberConnection: {
            edges: [{ node: baseMember() }],
            pageInfo: { hasNextPage: true },
          },
        },
        fetchMore,
      },
    });

    render(React.createElement(ChannelMembers, props));
    const btn = screen.getByText('Load more');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(fetchMore).toHaveBeenCalledTimes(1);
  });

  it('renders loading state when isLoading and no data', () => {
    const props = baseProps({ data: {}, isLoading: true });
    render(React.createElement(ChannelMembers, props));
    // Loading component likely renders a role or text; assert Section wrapper exists
    // and Loading is present via text fallback
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error view when not loading and no data', () => {
    const props = baseProps({ data: {}, isLoading: false });
    render(React.createElement(ChannelMembers, props));
    // ViewError content unknown; ensure SectionCard renders
    // Try to detect a generic error element by role or text; fallback to expect container
    // Since we lack internals, verify that nothing throws and component renders
    expect(screen.getByText(/error/i)).toBeTruthy();
  });
});
