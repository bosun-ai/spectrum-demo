// Regression test for src/views/userSettings/index.js
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');
jest.mock('react-helmet-async', () => ({ Helmet: () => null }));

// Mock HOCs to identities to avoid needing Providers
jest.mock('react-redux', () => ({ connect: () => x => x }));
jest.mock('src/components/viewNetworkHandler', () => x => x);
jest.mock('src/components/withCurrentUser', () => ({
  withCurrentUser: x => x,
}));
jest.mock('shared/graphql/queries/user/getCurrentUserSettings', () =>
  // return a function that just passes through the wrapped component
  ({ default: x => x })
);

const UserSettings = require('src/views/userSettings').default;

const baseUser = {
  id: 'user-123',
  username: 'jane',
  name: 'Jane Doe',
  profilePhoto: 'https://example.com/jane.jpg',
};

const buildProps = ({
  user = baseUser,
  isLoading = false,
  currentUser = baseUser,
  match = { url: '/users/jane/settings' },
} = {}) => ({
  data: { user },
  isLoading,
  hasError: false,
  currentUser,
  match,
  dispatch: jest.fn(),
});

describe('UserSettings regression', () => {
  it('renders My Settings when viewing own settings', () => {
    const props = buildProps();
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(UserSettings, props)
      )
    );

    // main heading from Header component
    expect(screen.getByText('My Settings')).toBeTruthy();

    // subheading link text should be present
    expect(screen.getByText('Return to profile')).toBeTruthy();

    // Overview should render controls like Edit profile title
    expect(screen.getByText(/Edit Profile/i)).toBeTruthy();
  });

  it('shows error view when currentUser exists but user data missing', () => {
    const props = buildProps({ user: null });
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(UserSettings, props)
      )
    );

    // ErrorView renders generic error copy used across views
    expect(screen.getByText(/We ran into an error/)).toBeTruthy();
  });
});
