// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');
// Avoid styled-components globals issues by mocking problematic modules before requiring component
jest.mock('src/components/button/style', () => ({}));
const ThreadByline = require('src/views/thread/components/threadByline')
  .default;

// Minimal stubs for subcomponents used inside ThreadByline
jest.mock('src/components/avatar', () => {
  const ReactLocal = require('react');
  return {
    UserAvatar: ({ user, size }) =>
      ReactLocal.createElement('img', {
        'data-testid': 'user-avatar',
        alt: user && user.name ? user.name : 'avatar',
        width: size,
      }),
  };
});

jest.mock('src/components/badges', () => {
  const ReactLocal = require('react');
  return function BadgeMock(props) {
    return ReactLocal.createElement(
      'span',
      {
        'data-testid': `badge-${props.type}`,
      },
      props.label || props.type
    );
  };
});

// The styled components come from src/views/thread/style.js and use react-router Link.
// JSDOM environment provides href rendering; we only assert text content and existence.

describe('ThreadByline', () => {
  const baseUser = {
    id: 'u1',
    name: 'Jane Doe',
    username: 'janed',
    betaSupporter: false,
    profilePhoto: 'http://example.com/avatar.png',
  };

  const makeAuthor = (overrides = {}) => ({
    user: { ...baseUser, ...overrides },
    roles: [],
  });

  test('renders author link, name and username when username exists', () => {
    const author = makeAuthor();
    render(React.createElement(ThreadByline, { author }));

    // Name and username should be present
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('@janed')).toBeInTheDocument();

    // Avatar stub should render
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();

    // Link container should exist pointing to /users/{username}
    const link = screen.getByText('Jane Doe').closest('a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('/users/janed');
  });

  test('renders without link when username is missing', () => {
    const author = makeAuthor({ username: '' });
    render(React.createElement(ThreadByline, { author }));

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    // No username displayed
    expect(screen.queryByText('@')).not.toBeInTheDocument();

    // Ensure name is not wrapped in a link
    const nameEl = screen.getByText('Jane Doe');
    const maybeLink = nameEl.closest('a');
    expect(maybeLink).toBeNull();
  });

  test('renders role badges and beta supporter badge', () => {
    const author = {
      user: { ...baseUser, betaSupporter: true },
      roles: ['moderator', 'owner'],
    };
    render(React.createElement(ThreadByline, { author }));

    // Role badges
    expect(screen.getByTestId('badge-moderator')).toBeInTheDocument();
    expect(screen.getByTestId('badge-owner')).toBeInTheDocument();

    // Beta supporter badge renders with label
    const supporter = screen.getByTestId('badge-beta-supporter');
    expect(supporter).toBeInTheDocument();
    expect(supporter).toHaveTextContent('Supporter');
  });
});
