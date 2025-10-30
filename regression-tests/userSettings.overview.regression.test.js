// Regression test for src/views/userSettings/components/overview.js
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock ErrorBoundary to render children directly to simplify assertions
jest.mock('src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
  SettingsFallback: () => null,
}));

// Mock layout components used within Overview
jest.mock('src/components/settingsViews/style', () => ({
  SectionsContainer: ({ children, ...props }) =>
    React.createElement(
      'div',
      { 'data-cy': 'user-settings-overview', ...props },
      children
    ),
  Column: ({ children }) => React.createElement('div', null, children),
}));

// Mock child components to expose identifiable text in render
jest.mock('src/views/userSettings/components/editForm', () => ({ user }) =>
  React.createElement('div', null, `Edit Profile for ${user.name}`)
);

jest.mock(
  'src/views/userSettings/components/deleteAccountForm',
  () => ({ id }) => React.createElement('div', null, `Delete Account ${id}`)
);

jest.mock(
  'src/views/userSettings/components/downloadDataForm',
  () => ({ user }) =>
    React.createElement('div', null, `Download Data for ${user.username}`)
);

jest.mock('src/views/userSettings/components/logout', () => () =>
  React.createElement('button', { type: 'button' }, 'Log out')
);

const Overview = require('src/views/userSettings/components/overview').default;

const baseUser = {
  id: 'user-123',
  username: 'jane',
  name: 'Jane Doe',
  profilePhoto: 'https://example.com/jane.jpg',
};

describe('UserSettings Overview regression', () => {
  it('renders all sections with provided user', () => {
    render(React.createElement(Overview, { user: baseUser }));

    // Edit form renders inside ErrorBoundary
    expect(screen.getByText(`Edit Profile for ${baseUser.name}`)).toBeTruthy();

    // Delete account form gets the id
    expect(screen.getByText(`Delete Account ${baseUser.id}`)).toBeTruthy();

    // Download data form gets the username
    expect(
      screen.getByText(`Download Data for ${baseUser.username}`)
    ).toBeTruthy();

    // Logout button appears
    expect(screen.getByText('Log out')).toBeTruthy();

    // Root container exists
    const container = document.querySelector(
      '[data-cy="user-settings-overview"]'
    );
    expect(container).toBeTruthy();
  });
});
