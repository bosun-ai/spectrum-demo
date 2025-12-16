const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the Query (HOC-wrapped) entry and raw Attachment to compare behaviors
const ThreadAttachment = require('../src/components/message/threadAttachment')
  .default;

// Helper to render with minimal props that the Query forwards to Attachment
function renderQuery(overrides) {
  const defaultProps = {
    id: 'abc123',
    message: { id: 'm1' },
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
  const { Provider } = require('react-redux');
  const { createStore } = require('redux');
  const { ThemeProvider } = require('styled-components');
  const theme = require('../shared/theme').default;
  const rootReducer = (state = {}) => state;
  const store = createStore(rootReducer);
  return render(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(ThreadAttachment, props)
      )
    )
  );
}

test('Query forwards loading to Attachment', () => {
  renderQuery({ data: { loading: true } });
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test('Query renders link fallback on error', () => {
  renderQuery({
    data: { loading: false, error: 'boom', thread: null },
    id: 'xyz',
  });
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/thread/xyz');
  expect(link).toHaveTextContent('https://spectrum.chat/thread/xyz');
});

test('Query renders thread attachment content', () => {
  renderQuery();
  // The Container sets data-cy which we can expose via test id in DOM
  expect(screen.getByTestId('thread-attachment')).toBeInTheDocument();
  expect(screen.getByText('Thread title')).toBeInTheDocument();
  const links = screen.getAllByRole('link');
  expect(links.length).toBeGreaterThan(0);
});
