import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
// Access the inner wrapped component from the composed default export
const NewUserOnboardingModule = require('../src/views/newUserOnboarding');
const NewUserOnboarding = NewUserOnboardingModule.default.WrappedComponent;

// Mock child components to avoid Provider/Apollo contexts
jest.mock('../src/views/login', () => {
  const React = require('react');
  return function MockLogin() {
    return React.createElement('div', null, 'Log in');
  };
});
jest.mock('../src/views/newUserOnboarding/components/setUsername', () => {
  const React = require('react');
  return function MockSetUsername() {
    return React.createElement(
      'div',
      { 'data-testid': 'set-username' },
      'Set Username'
    );
  };
});

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
        {/* Render inner component with minimal props */}
        <NewUserOnboarding
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
    // Prevent Router setState loop by stubbing replace
    const replaceSpy = jest
      .spyOn(history, 'replace')
      .mockImplementation(path => {
        history.location.pathname = path;
      });
    render(
      <Router history={history}>
        <NewUserOnboarding
          currentUser={{ id: 'u1', username: 'alice' }}
          dispatch={() => {}}
          history={history}
          location={location}
        />
      </Router>
    );

    // Component calls history.replace('/') when username exists
    expect(history.location.pathname).toBe('/');
    replaceSpy.mockRestore();
  });

  it('shows onboarding UI when user missing username', async () => {
    const history = createMemoryHistory({ initialEntries: ['/new'] });
    render(
      <Router history={history}>
        <NewUserOnboarding
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
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
  });
});
