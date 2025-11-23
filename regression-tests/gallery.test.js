const React = require('react');
const { Provider } = require('react-redux');
const configureStore = require('redux-mock-store').default;
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock GraphQL HOC used by Gallery component to inject messages
jest.mock(
  'shared/graphql/queries/message/getMediaMessagesForThread',
  () =>
    function mockGetMediaMessagesForThread(Component) {
      return function Wrapped(props) {
        const ReactLocal = require('react');
        const data = {
          messages: [
            { id: 'm1', content: { body: 'https://example.com/1.jpg' } },
            { id: 'm2', content: { body: 'https://example.com/2.jpg' } },
            { id: 'm3', content: { body: 'https://example.com/3.jpg' } },
          ],
        };
        return ReactLocal.createElement(
          Component,
          Object.assign({}, props, { data })
        );
      };
    }
);

// Mock loading HOC to just pass-through
jest.mock('src/components/loading', () => ({
  displayLoadingGallery: Comp => Comp,
}));

const Gallery =
  require('src/components/gallery').default ||
  require('src/components/gallery');

const mockStore = configureStore([]);

function renderWithStore(state) {
  const store = mockStore(state);
  return render(
    React.createElement(Provider, { store }, React.createElement(Gallery))
  );
}

test('does not render when closed', () => {
  renderWithStore({
    gallery: { isOpen: false, threadId: 't1', messageId: 'm2' },
  });
  // Overlay or ActiveImage should not exist
  expect(screen.queryByRole('img')).toBeNull();
});

test('renders active image when open', () => {
  renderWithStore({
    gallery: { isOpen: true, threadId: 't1', messageId: 'm2' },
  });
  // The active main image should use the active message id's src
  const activeImg = screen.getAllByRole('img')[0];
  expect(activeImg).toHaveAttribute('src', 'https://example.com/2.jpg');
});

test('navigates images with arrow keys and click', () => {
  renderWithStore({
    gallery: { isOpen: true, threadId: 't1', messageId: 'm1' },
  });
  let activeImg = screen.getAllByRole('img')[0];
  expect(activeImg).toHaveAttribute('src', 'https://example.com/1.jpg');

  // Right arrow -> next image
  fireEvent.keyDown(document, { keyCode: 39 });
  activeImg = screen.getAllByRole('img')[0];
  expect(activeImg).toHaveAttribute('src', 'https://example.com/2.jpg');

  // Click main image -> next image
  fireEvent.click(activeImg);
  activeImg = screen.getAllByRole('img')[0];
  expect(activeImg).toHaveAttribute('src', 'https://example.com/3.jpg');

  // Left arrow -> previous image (wrap-around test too)
  fireEvent.keyDown(document, { keyCode: 37 });
  activeImg = screen.getAllByRole('img')[0];
  expect(activeImg).toHaveAttribute('src', 'https://example.com/2.jpg');
});
