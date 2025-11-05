import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import NewUserOnboarding from '../src/views/newUserOnboarding';

// Helper to render component with router context and injected props
const renderWithRouter = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) => {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
};

describe('NewUserOnboarding view regression', () => {
  it('renders login when no currentUser', async () => {
    // Provide location.search with no r param so redirectPath defaults to CLIENT_URL/home
    const history = createMemoryHistory({ initialEntries: ['/new?x=1'] });
    render(
      <Router history={history}>
        {/* Bypass HOCs by rendering the inner component with minimal props */}
        <NewUserOnboarding.WrappedComponent
          currentUser={null}
          dispatch={() => {}}
          history={history}
          location={history.location}
        />
      </Router>
    );

    // Login view renders a large title "Log in"
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it('redirects away when user already has a username', async () => {
    const history = createMemoryHistory({ initialEntries: ['/new'] });
    const location = history.location;
    render(
      <Router history={history}>
        <NewUserOnboarding.WrappedComponent
          currentUser={{ id: 'u1', username: 'alice' }}
          dispatch={() => {}}
          history={history}
          location={location}
        />
      </Router>
    );

    // Component calls history.replace('/') when username exists
    expect(history.location.pathname).toBe('/');
  });

  it('shows onboarding UI when user missing username', async () => {
    const history = createMemoryHistory({ initialEntries: ['/new'] });
    render(
      <Router history={history}>
        <NewUserOnboarding.WrappedComponent
          currentUser={{ id: 'u1', username: null }}
          dispatch={() => {}}
          history={history}
          location={history.location}
        />
      </Router>
    );

    // Heading text and logout button should be present
    expect(screen.getByText('Create a username')).toBeInTheDocument();
    expect(
      screen.getByText('You can change this at any time, so no pressure!')
    ).toBeInTheDocument();
    const logout = screen.getByRole('link', { name: /log out/i });
    expect(logout).toBeInTheDocument();
  });
});
