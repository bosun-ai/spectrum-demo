const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Mock Apollo HOC to avoid ApolloProvider requirement
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));
// Mock Loading to a simple stub to avoid theme deps
jest.mock('../src/components/loading', () => ({
  Loading: () => React.createElement('div', null, 'Loading'),
}));
// Mock UserAvatar to avoid ApolloConsumer inside hover profile
jest.mock('../src/components/avatar', () => ({
  UserAvatar: () => React.createElement('img', { alt: 'avatar' }),
}));
// Import the component
const Attachment = require('../src/components/message/threadAttachment/attachment')
  .default;

function renderWithRouter(ui) {
  return render(
    React.createElement(MemoryRouter, { initialEntries: ['/'] }, ui)
  );
}

describe('Attachment component regression', () => {
  test('renders loading state', () => {
    const props = {
      id: 'thread-id-123',
      currentUser: null,
      data: { loading: true, error: null, thread: null },
    };
    const { getByText, container } = renderWithRouter(
      React.createElement(Attachment, props)
    );
    // Loading component should render
    expect(
      container.querySelector('.attachment-container')
    ).toBeInTheDocument();
    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders link on error or missing thread', () => {
    const props = {
      id: 'abc123',
      currentUser: null,
      data: { loading: false, error: 'boom', thread: null },
    };
    const { getByText } = renderWithRouter(
      React.createElement(Attachment, props)
    );
    const link = getByText('https://spectrum.chat/thread/abc123');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/thread/abc123');
  });

  test('renders thread attachment with title and avatar', () => {
    const thread = {
      id: 't1',
      author: {
        user: {
          id: 'u1',
          name: 'Alice',
          profilePhoto: 'http://example.com/a.jpg',
        },
      },
      content: { title: 'Hello World' },
      channel: { slug: 'general' },
      community: { slug: 'spectrum' },
    };

    const props = {
      id: 't1',
      currentUser: { id: 'cu1' },
      data: { loading: false, error: null, thread },
    };

    const { getByText, container } = renderWithRouter(
      React.createElement(Attachment, props)
    );

    // Container should be present
    expect(
      container.querySelector('[data-cy="thread-attachment"]')
    ).toBeInTheDocument();

    // Title should render
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
