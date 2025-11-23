const React = require('react');
const { Provider } = require('react-redux');
const configureStore = require('redux-mock-store').default;
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock GraphQL HOC used by Gallery component to inject messages
jest.mock('shared/graphql/queries/message/getMediaMessagesForThread', () => {
  return Component => props => {
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
});

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

test('renders nothing when gallery closed', () => {
  renderWithStore({
    gallery: { isOpen: false, threadId: 't1', messageId: 'm2' },
  });
  expect(screen.queryByRole('img')).toBeNull();
});

test('renders active image and thumbnails when open', () => {
  renderWithStore({
    gallery: { isOpen: true, threadId: 't1', messageId: 'm2' },
  });
  const imgs = screen.getAllByRole('img');
  // First img is the active image element
  expect(imgs[0]).toHaveAttribute('src', 'https://example.com/2.jpg');
  // Thumbnails should include all images
  const thumbSrcs = imgs.slice(1).map(img => img.getAttribute('src'));
  expect(thumbSrcs).toEqual([
    'https://example.com/1.jpg',
    'https://example.com/2.jpg',
    'https://example.com/3.jpg',
  ]);
});

test('navigates with arrow keys, click, and wrap-around', () => {
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

  // Right arrow at end wraps to first
  fireEvent.keyDown(document, { keyCode: 39 });
  activeImg = screen.getAllByRole('img')[0];
  expect(activeImg).toHaveAttribute('src', 'https://example.com/1.jpg');

  // Left arrow from first wraps to last
  fireEvent.keyDown(document, { keyCode: 37 });
  activeImg = screen.getAllByRole('img')[0];
  expect(activeImg).toHaveAttribute('src', 'https://example.com/3.jpg');

  // Clicking a thumbnail sets active index
  const thumbs = screen.getAllByRole('img').slice(1);
  fireEvent.click(thumbs[1]); // second thumbnail -> m2
  activeImg = screen.getAllByRole('img')[0];
  expect(activeImg).toHaveAttribute('src', 'https://example.com/2.jpg');
});
