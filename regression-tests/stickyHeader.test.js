// @flow
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock redux connect to pass through without out-of-scope refs
jest.mock('react-redux', () => ({
  connect: () => Comp => props => {
    const ReactLocal = require('react');
    return ReactLocal.createElement(Comp, props);
  },
}));

// Mock UserAvatar to render username for assertions
jest.mock('src/components/avatar', () => ({
  UserAvatar: ({ username }) => {
    const ReactLocal = require('react');
    return ReactLocal.createElement('div', {
      'data-testid': 'avatar',
      'data-username': username,
    });
  },
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
// Mock styled dependencies used by nested components to avoid FlexRow undefined
jest.mock('src/components/globals', () => ({
  FlexRow: props => {
    const ReactLocal = require('react');
    return ReactLocal.createElement('div', props);
  },
  FlexCol: props => {
    const ReactLocal = require('react');
    return ReactLocal.createElement('div', props);
  },
  zIndex: { card: 1 },
  H1: props => {
    const ReactLocal = require('react');
    return ReactLocal.createElement('h1', props);
  },
}));

// Mock flyout to a simple container
jest.mock('src/components/flyout', () => {
  const ReactLocal = require('react');
  return function Flyout(props) {
    return ReactLocal.createElement('div', props, props.children);
  };
});

// Mock icon and button used by actions dropdown to minimal elements
jest.mock('src/components/icon', () => {
  const ReactLocal = require('react');
  return function Icon(props) {
    const { 'data-cy': dataCy, onClick } = props;
    return ReactLocal.createElement(
      'button',
      { 'data-testid': dataCy, onClick },
      'icon'
    );
  };
});
jest.mock('src/components/button', () => ({
  TextButton: ({ children, onClick, 'data-cy': dataCy }) => {
    const ReactLocal = require('react');
    return ReactLocal.createElement(
      'button',
      { onClick, 'data-testid': dataCy },
      children
    );
  },
}));

// Mock useAppScroller; create fn within factory to satisfy hoist rules
jest.mock('src/hooks/useAppScroller', () => ({
  useAppScroller: () => ({ scrollToTop: require('jest-mock').fn() }),
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
    jest.resetModules();
  });

  test('renders title, avatar, and timestamp link', () => {
    const Comp = require('src/views/thread/components/stickyHeader').default;
    render(React.createElement(Comp, { thread: baseThread }));

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
    const { useAppScroller } = require('src/hooks/useAppScroller');
    const { scrollToTop } = useAppScroller();
    const Comp = require('src/views/thread/components/stickyHeader').default;
    render(React.createElement(Comp, { thread: baseThread }));
    // Find container content clickable area by role or text; use title parent
    const clickable = screen.getByText('A long thread title').closest('div');
    expect(clickable).toBeTruthy();
    fireEvent.click(clickable);
    expect(scrollToTop).toHaveBeenCalledTimes(1);
  });

  test('renders actions dropdown only when channel member', () => {
    // Member -> actions present
    const Comp = require('src/views/thread/components/stickyHeader').default;
    const { rerender } = render(
      React.createElement(Comp, { thread: baseThread })
    );
    expect(
      screen.getByTestId('thread-actions-dropdown-trigger')
    ).toBeInTheDocument();

    // Not a member -> actions absent
    const nonMemberThread = {
      ...baseThread,
      channel: { channelPermissions: { isMember: false } },
    };
    rerender(React.createElement(Comp, { thread: nonMemberThread }));
    expect(screen.queryByTestId('thread-actions-dropdown-trigger')).toBeNull();
  });
});
