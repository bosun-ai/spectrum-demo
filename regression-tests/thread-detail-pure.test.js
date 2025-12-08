// @flow
/**
 * Regression test for ThreadDetailPure render behavior.
 * We mock heavy subcomponents and styled-components to avoid environment issues.
 */
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock styled-components styles imported via src/views/thread/style.js
jest.mock('src/views/thread/style.js', () => {
  const ReactLocal = require('react');
  const Fragment = ReactLocal.Fragment;
  const passthrough = ({ children }) =>
    ReactLocal.createElement(Fragment, null, children);
  // Provide all styled exports used by the component to avoid undefined
  return {
    ThreadViewContainer: passthrough,
    ThreadContentView: passthrough,
    ThreadSidebarView: passthrough,
    Content: passthrough,
    Input: passthrough,
    Detail: passthrough,
    DetailViewWrapper: passthrough,
    Container: passthrough,
    ThreadWrapper: passthrough,
    ThreadContent: passthrough,
    ThreadHeading: ({ children }) =>
      ReactLocal.createElement(
        'h1',
        { 'data-testid': 'thread-heading' },
        children
      ),
    A: passthrough,
    SocialShareWrapper: passthrough,
    ContextRow: passthrough,
    EditDone: passthrough,
    DropWrap: passthrough,
    FlyoutRow: passthrough,
    Byline: passthrough,
    BylineMeta: passthrough,
    AuthorNameLink: passthrough,
    AuthorNameNoLink: passthrough,
    AuthorName: passthrough,
    AuthorUsername: passthrough,
    Location: passthrough,
    Timestamp: passthrough,
    ChatWrapper: passthrough,
    NullMessagesWrapper: passthrough,
    NullCopy: passthrough,
    ShareButtons: passthrough,
    ShareButton: passthrough,
    StickyHeaderContent: passthrough,
    StickyHeaderActionsContainer: passthrough,
    CommunityHeaderName: passthrough,
    CommunityHeaderSubtitle: passthrough,
    ThreadSubtitle: ({ children }) =>
      ReactLocal.createElement(
        'div',
        { 'data-testid': 'thread-subtitle' },
        children
      ),
    CommunityHeaderChannelTag: passthrough,
    CommunityHeaderMeta: passthrough,
    CommunityHeaderMetaCol: passthrough,
    PillLink: passthrough,
    PillLinkPinned: passthrough,
    PillLabel: passthrough,
    SidebarChannelPill: passthrough,
    Lock: passthrough,
    PinIcon: passthrough,
    ActionBarContainer: passthrough,
    FixedBottomActionBarContainer: passthrough,
    FollowButton: passthrough,
    SidebarSection: passthrough,
    SidebarSectionTitle: passthrough,
    SidebarSectionBody: passthrough,
    SidebarSectionActions: passthrough,
    SidebarSectionAuth: passthrough,
    SidebarCommunityCover: passthrough,
    SidebarCommunityProfile: passthrough,
    SidebarCommunityName: passthrough,
    SidebarCommunityDescription: passthrough,
    SidebarRelatedThreadList: passthrough,
    SidebarRelatedThread: passthrough,
    RelatedTitle: passthrough,
    RelatedCount: passthrough,
    Label: passthrough,
    StickyHeaderContainer: passthrough,
    Stretch: passthrough,
    LockedWrapper: passthrough,
    LockedText: passthrough,
    TopBottomButtonContainer: passthrough,
    TopButton: passthrough,
    BottomButton: passthrough,
    BylineContainer: passthrough,
  };
});

// Avoid styled button styles
jest.mock('src/components/button/style', () => ({}));

// Mock UserListItem to a lightweight component
jest.mock('src/components/entities', () => {
  const ReactLocal = require('react');
  return {
    UserListItem: ({ name, username }) =>
      ReactLocal.createElement(
        'div',
        { 'data-testid': 'user-list-item' },
        `${name}${username ? ' @' + username : ''}`
      ),
  };
});

// Mock ThreadRenderer to show provided body length
jest.mock('src/components/threadRenderer', () => {
  const ReactLocal = require('react');
  return function ThreadRendererMock({ body }) {
    const blocks = body && body.blocks ? body.blocks : [];
    const text = Array.isArray(blocks)
      ? blocks.map(b => b.text).join('\n')
      : '';
    return ReactLocal.createElement(
      'div',
      { 'data-testid': 'thread-renderer' },
      text
    );
  };
});

// Mock ActionBar to a placeholder
jest.mock('src/views/thread/components/actionBar', () => {
  const ReactLocal = require('react');
  return function ActionBarMock(props) {
    return ReactLocal.createElement(
      'div',
      { 'data-testid': 'action-bar' },
      `title:${props.title || ''}`
    );
  };
});

// Mock withCurrentUser HOC to passthrough
jest.mock('src/components/withCurrentUser', () => ({
  withCurrentUser: C => C,
}));

// Mock react-router Link to a simple anchor
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) =>
    React.createElement(
      'a',
      { href: typeof to === 'string' ? to : '/link' },
      children
    ),
}));

// Import after mocks
const ThreadDetailPure =
  require('src/views/thread/components/threadDetail').default
    .WrappedComponent ||
  require('src/views/thread/components/threadDetail').default;

// Helper to build a minimal thread object
const makeThread = (overrides = {}) => ({
  id: 't1',
  createdAt: Date.now(),
  modifiedAt: null,
  editedBy: null,
  author: {
    user: { id: 'u1', name: 'Jane Doe', username: 'janed', profilePhoto: '' },
    roles: [],
  },
  community: {
    id: 'c1',
    name: 'Example',
    website: null,
    redirect: false,
  },
  channel: { id: 'ch1', slug: 'general', community: { slug: 'example' } },
  content: {
    title: 'Hello World',
    body: JSON.stringify({ blocks: [{ text: 'Body content' }] }),
  },
  ...overrides,
});

describe('ThreadDetailPure', () => {
  test('renders heading, byline, timestamp link and body', () => {
    const thread = makeThread();
    const currentUser = { id: 'u2' };
    // Render the composed component; it reads props.thread/currentUser
    render(React.createElement(ThreadDetailPure, { thread, currentUser }));

    // Heading
    expect(screen.getByTestId('thread-heading')).toHaveTextContent(
      'Hello World'
    );

    // Byline/User list item shows name and username
    const byline = screen.getByTestId('user-list-item');
    expect(byline).toHaveTextContent('Jane Doe @janed');

    // Subtitle link exists
    const subtitle = screen.getByTestId('thread-subtitle');
    const link = subtitle.querySelector('a');
    expect(link).toBeTruthy();
    // href should contain channel/community slugs via getThreadLink
    expect(link.getAttribute('href')).toContain('/thread/');

    // Body rendered by ThreadRenderer mock
    expect(screen.getByTestId('thread-renderer')).toHaveTextContent(
      'Body content'
    );

    // ActionBar receives title from state, which is set from thread.content.title in componentWillMount
    expect(screen.getByTestId('action-bar')).toHaveTextContent(
      'title:Hello World'
    );
  });

  test('shows redirect banner when community has website and redirect', () => {
    const thread = makeThread({
      community: {
        id: 'c1',
        name: 'Example',
        website: 'https://example.com',
        redirect: true,
      },
    });
    render(
      React.createElement(ThreadDetailPure, { thread, currentUser: null })
    );

    // Banner text
    expect(screen.getByText(/community has a new home/i)).toBeInTheDocument();
    // Link to website
    const bannerLink = screen
      .getByText(/Go to new community home/i)
      .closest('a');
    expect(bannerLink).toBeTruthy();
    expect(bannerLink.getAttribute('href')).toBe('https://example.com');
  });

  test('renders edited subtitle when modifiedAt present and editedBy is different user', () => {
    const thread = makeThread({
      modifiedAt: Date.now() - 1000 * 60, // 1 minute ago
      editedBy: { user: { id: 'u3', username: 'editor' } },
    });
    render(
      React.createElement(ThreadDetailPure, { thread, currentUser: null })
    );

    const subtitle = screen.getByTestId('thread-subtitle');
    expect(subtitle.textContent).toMatch(/edited/i);
    expect(subtitle.textContent).toMatch(/@editor/);
  });
});
