import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router';
import UserSettings from '../src/views/userSettings/index';

// Minimal reducer to satisfy connect() usage; no-op dispatch
const reducer = (state = {}) => state;

const renderWithProviders = (
  ui,
  { route = '/settings', preloadedState = {} } = {}
) => {
  const store = createStore(reducer, preloadedState);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('UserSettings component regression', () => {
  it('renders loading state when isLoading', () => {
    renderWithProviders(
      <UserSettings
        isLoading={true}
        hasError={false}
        data={{ user: null }}
        match={{ url: '/settings' }}
        currentUser={{ id: 'u1' }}
        dispatch={() => {}}
      />
    );
    // LoadingView is used; assert presence via common text role/semantics
    // LoadingView likely renders a progress indicator; be generic
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error when currentUser exists but user is missing', () => {
    renderWithProviders(
      <UserSettings
        isLoading={false}
        hasError={false}
        data={{ user: null }}
        match={{ url: '/settings' }}
        currentUser={{ id: 'u1' }}
        dispatch={() => {}}
      />
    );
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('renders overview when viewing own settings and header with My Settings', () => {
    const user = {
      id: 'u1',
      username: 'alice',
      profilePhoto: 'https://example.com/p.png',
    };
    renderWithProviders(
      <UserSettings
        isLoading={false}
        hasError={false}
        data={{ user }}
        match={{ url: '/settings' }}
        currentUser={{ id: 'u1' }}
        dispatch={() => {}}
      />
    );

    // Root container has data-cy="user-settings"
    expect(
      screen.getByTestId
        ? screen.getByTestId('user-settings')
        : screen.getByText(/my settings/i)
    ).toBeTruthy();

    // Header heading text
    expect(screen.getByText(/my settings/i)).toBeInTheDocument();

    // Subheading link label "Return to profile" should be present
    expect(screen.getByText(/return to profile/i)).toBeInTheDocument();
  });
});
