// @flow
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock redux connect to pass through
jest.mock('react-redux', () => ({
  connect: () => Comp => props => React.createElement(Comp, props),
}));

// Mock UserAvatar to render username for assertions
jest.mock('src/components/avatar', () => ({
  UserAvatar: ({ username }) =>
    React.createElement('div', {
      'data-testid': 'avatar',
      'data-username': username,
    }),
}));

// Mock getThreadLink to predictable path
jest.mock('src/helpers/get-thread-link', () => {
  return function getThreadLink(thread) {
    const slug =
      thread && thread.content && thread.content.slug
        ? thread.content.slug
        : 'slug';
    return `/thread/${slug}`;
  };
});

// Mock time formatting to fixed timestamp string
jest.mock('shared/time-formatting', () => ({
  convertTimestampToDate: () => 'Jan 02, 2020',
}));

// Mock truncate to return input unchanged for simplicity
jest.mock('src/helpers/utils', () => ({
  truncate: str => str,
}));

// Mock useAppScroller to expose a spyable scrollToTop
const scrollToTop = jest.fn();
jest.mock('src/hooks/useAppScroller', () => ({
  useAppScroller: () => ({ scrollToTop }),
}));

// Use real styled components from style.js; they render fine in jsdom
const StickyHeader = require('src/views/thread/components/stickyHeader')
  .default;

const baseThread = {
  id: 't1',
  createdAt: new Date('2020-01-02T03:04:05.000Z').getTime(),
  author: { user: { username: 'alice' } },
  content: { title: 'A long thread title', slug: 'a-long-thread' },
  channel: { channelPermissions: { isMember: true } },
};

describe('StickyHeader', () => {
  beforeEach(() => {
    scrollToTop.mockClear();
  });

  test('renders title, avatar, and timestamp link', () => {
    render(React.createElement(StickyHeader, { thread: baseThread }));

    // Title text rendered
    expect(screen.getByText('A long thread title')).toBeInTheDocument();

    // Avatar renders with correct username
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar.getAttribute('data-username')).toBe('alice');

    // Timestamp link uses getThreadLink
    const link = screen.getByRole('link', { name: 'Jan 02, 2020' });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/thread/a-long-thread');
  });

  test('clicking header triggers scrollToTop', () => {
    render(React.createElement(StickyHeader, { thread: baseThread }));
    // Find container content clickable area by role or text; use title parent
    const clickable = screen.getByText('A long thread title').closest('div');
    expect(clickable).toBeTruthy();
    fireEvent.click(clickable);
    expect(scrollToTop).toHaveBeenCalledTimes(1);
  });

  test('renders actions dropdown only when channel member', () => {
    // Member -> actions present
    const { rerender } = render(
      React.createElement(StickyHeader, { thread: baseThread })
    );
    expect(
      screen.getByTestId('thread-actions-dropdown-trigger')
    ).toBeInTheDocument();

    // Not a member -> actions absent
    const nonMemberThread = {
      ...baseThread,
      channel: { channelPermissions: { isMember: false } },
    };
    rerender(React.createElement(StickyHeader, { thread: nonMemberThread }));
    expect(screen.queryByTestId('thread-actions-dropdown-trigger')).toBeNull();
  });
});
