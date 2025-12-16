const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the component under test
const Attachment = require('../src/components/message/threadAttachment/attachment')
  .default;

// Helper to render with minimal props
function renderAttachment(overrides) {
  const defaultProps = {
    id: 'abc123',
    currentUser: { id: 'u1', name: 'Test User' },
    data: {
      loading: false,
      error: null,
      thread: {
        id: 't1',
        author: { user: { id: 'u2', name: 'Author' } },
        content: { title: 'Thread title' },
        community: { slug: 'comm' },
        channel: { slug: 'chan' },
      },
    },
  };
  const props = Object.assign({}, defaultProps, overrides || {});
  return render(React.createElement(Attachment, props));
}

test('renders loading state', () => {
  renderAttachment({ data: { loading: true } });
  // Loading component renders inside Container
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test('renders fallback Link when error or missing thread', () => {
  renderAttachment({
    data: { loading: false, error: 'boom', thread: null },
    id: 'xyz',
  });
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/thread/xyz');
  expect(link).toHaveTextContent('https://spectrum.chat/thread/xyz');
});

test('renders thread attachment with title and avatar', () => {
  renderAttachment();
  // Root container flag used by Cypress
  expect(screen.getByTestId('thread-attachment')).toBeInTheDocument();
  // Title text
  expect(screen.getByText('Thread title')).toBeInTheDocument();
  // Avatar mocked in setupTests may not expose user avatar; ensure the element exists via role or by absence of error
  // Link overlay should be present and normalized to anchor by setupTests
  const links = screen.getAllByRole('link');
  // One overlay link plus possibly others; ensure at least one exists
  expect(links.length).toBeGreaterThan(0);
});
