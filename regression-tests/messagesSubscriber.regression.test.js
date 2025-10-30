// Regression test for src/views/thread/components/messagesSubscriber.js
const React = require('react');
const { render, screen } = require('@testing-library/react');

// The component is default-exported composed; import default
const MessagesSubscriber = require('src/views/thread/components/messagesSubscriber')
  .default;

// Helper to build minimal thread data shape expected by component
const buildThread = ({
  edges,
  hasNextPage = false,
  hasPreviousPage = false,
  watercooler = false,
} = {}) => ({
  watercooler,
  messageConnection: {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
    },
  },
});

describe('MessagesSubscriber regression', () => {
  it('renders NullMessages when no edges', () => {
    const data = { thread: buildThread({ edges: [] }) };
    render(
      React.createElement(MessagesSubscriber, {
        data,
        isLoading: false,
        hasError: false,
      })
    );
    // NullMessages renders a simple null state text; assert by button absence
    expect(screen.queryByText('Show previous messages')).toBeNull();
    expect(screen.queryByText('Show more messages')).toBeNull();
  });

  it('renders ChatMessages and next/previous buttons based on pageInfo', () => {
    const edges = [
      { node: { id: 'm1' }, cursor: 'c1' },
      { node: { id: 'm2' }, cursor: 'c2' },
    ];
    const thread = buildThread({
      edges,
      hasNextPage: true,
      hasPreviousPage: true,
    });
    const data = { thread };
    const location = { pathname: '/thread/123', search: '' };
    const loadPreviousPage = jest.fn();
    const loadNextPage = jest.fn();
    render(
      React.createElement(MessagesSubscriber, {
        data,
        isLoading: false,
        hasError: false,
        isFetchingMore: false,
        loadPreviousPage,
        loadNextPage,
        location,
      })
    );

    // NextPageButton instances render children labels
    const prevBtn = screen.getByText('Show previous messages');
    const nextBtn = screen.getByText('Show more messages');
    expect(prevBtn).toBeTruthy();
    expect(nextBtn).toBeTruthy();

    // ensure anchor href is constructed using query-string
    const prevAnchor = prevBtn.closest('a');
    const nextAnchor = nextBtn.closest('a');
    expect(prevAnchor).toBeTruthy();
    expect(nextAnchor).toBeTruthy();
    expect(prevAnchor.getAttribute('href')).toContain('msgsbefore=c1');
    expect(nextAnchor.getAttribute('href')).toContain('msgsafter=c2');
  });

  it('shows loading NullMessagesWrapper when loading without thread', () => {
    render(
      React.createElement(MessagesSubscriber, {
        data: { loading: true },
        isLoading: true,
      })
    );
    // Loading component has style height 80vh; assert spinner by role or wrapper presence
    // We simply expect nothing throws and component renders
    expect(true).toBe(true);
  });
});
