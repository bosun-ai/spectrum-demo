import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import DirectMessages from '../src/views/directMessages/containers/index.js';

// Minimal reducer to satisfy connected components used inside DirectMessages
function reducer(
  state = {
    connectionStatus: { networkOnline: true, websocketConnection: 'open' },
    threadSlider: { isOpen: false },
    titlebar: {},
  },
  action
) {
  // Allow setTitlebarProps to be dispatched without errors
  if (action && action.type && action.type.includes('TITLEBAR')) {
    return {
      ...state,
      titlebar: { ...(state.titlebar || {}), ...(action.payload || {}) },
    };
  }
  return state;
}

function renderWithProviders(
  ui,
  { route = '/messages', path = '/messages/:threadId?' } = {}
) {
  const store = createStore(reducer);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Route path={path} component={() => ui} />
      </MemoryRouter>
    </Provider>
  );
}

// Regression: with no threadId, show the empty state heading
test('DirectMessages shows empty state when no thread selected', () => {
  renderWithProviders(<DirectMessages />, { route: '/messages' });

  // Empty state heading used by the component
  expect(screen.getByText(/no conversation selected/i)).toBeInTheDocument();
  // Titlebar set to Messages via DesktopTitlebar or Head
  expect(screen.getAllByText(/messages/i).length).toBeGreaterThan(0);
});

// Regression: with a threadId, it should render the ExistingThread container
test('DirectMessages renders ExistingThread when threadId is present', () => {
  renderWithProviders(<DirectMessages />, { route: '/messages/abc123' });

  // ThreadsList should be hidden on small viewports when activeThreadId is present;
  // however we can still assert ExistingThread path renders without crashing.
  // ExistingThread may fetch data; in absence of GraphQL, it returns LoadingView/ErrorView/null.
  // We assert the page layout renders without the empty state.
  expect(
    screen.queryByText(/no conversation selected/i)
  ).not.toBeInTheDocument();
});
