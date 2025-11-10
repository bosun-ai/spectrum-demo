import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ThreadSliderConnected from '../src/views/threadSlider';

// Minimal reducer to provide titlebar slice used by ThreadSlider mapState
const rootReducer = (state = { titlebar: {} }, action) => state;

// Helper to render connected component with required props
const renderWithStoreAndProps = (
  ui,
  { initialState, store = createStore(rootReducer, initialState) } = {}
) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

// Mock ThreadView to avoid deep tree and focus on slider behavior
jest.mock('../src/views/thread', () => ({
  ThreadView: ({ children }) => (
    <div data-testid="mock-thread-view">{children}</div>
  ),
}));

// Mock Icon to avoid styled-components or glyph dependencies
jest.mock('../src/components/icon', () => {
  const MockIcon = () => <span data-testid="mock-icon" />;
  return MockIcon;
});

// Regression: ensure overlay and close button trigger history.push to previousLocation
test('ThreadSlider renders and closes via overlay and button', async () => {
  const previousLocation = {
    pathname: '/threads',
    search: '',
    hash: '',
    state: { modal: true },
  };

  const push = jest.fn();
  const history = { push };
  const match = { params: { threadId: 'thread-123' } };

  renderWithStoreAndProps(
    <ThreadSliderConnected
      previousLocation={previousLocation}
      history={history}
      match={match}
    />
  );

  // Overlay should be present and clickable
  const overlay = screen
    .getByTestId('mock-thread-view')
    .querySelector('[data-cy="overlay"]');
  expect(overlay).toBeInTheDocument();

  await userEvent.click(overlay);
  expect(push).toHaveBeenCalledWith({
    ...previousLocation,
    state: { modal: false },
  });

  // Close button should also trigger close (sibling of ThreadContainer)
  const closeBtn =
    screen.getByRole('button', { name: '' }) ||
    document.querySelector('[data-cy="thread-slider-close"]');
  expect(closeBtn).toBeInTheDocument();

  await userEvent.click(closeBtn);
  expect(push).toHaveBeenCalledTimes(2);
});

// Regression: pressing ESC should close the slider
test('ThreadSlider closes on ESC keydown', async () => {
  const previousLocation = {
    pathname: '/threads',
    search: '',
    hash: '',
    state: { modal: true },
  };
  const push = jest.fn();
  const history = { push };
  const match = { params: { threadId: 'thread-esc' } };

  renderWithStoreAndProps(
    <ThreadSliderConnected
      previousLocation={previousLocation}
      history={history}
      match={match}
    />
  );

  // Fire ESC keydown on document
  const escEvent = new KeyboardEvent('keydown', { keyCode: 27 });
  document.dispatchEvent(escEvent);

  expect(push).toHaveBeenCalledWith({
    ...previousLocation,
    state: { modal: false },
  });
});
