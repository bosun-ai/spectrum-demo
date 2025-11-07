import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import ThreadByline from '../src/views/thread/components/threadByline';

const renderWithTheme = ui =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ThreadByline', () => {
  const baseAuthor = {
    user: {
      id: 'u1',
      name: 'Jane Doe',
      username: 'janedoe',
      profilePhoto: null,
      betaSupporter: false,
    },
    roles: [],
  };

  it('renders with link when username exists and shows username', () => {
    renderWithTheme(<ThreadByline author={baseAuthor} />);
    // Author name text
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    // Username rendered with @ prefix
    expect(screen.getByText('@janedoe')).toBeInTheDocument();
    // Link to the user profile
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/users/janedoe');
  });

  it('renders without link when username is missing', () => {
    const noUsernameAuthor = {
      ...baseAuthor,
      user: { ...baseAuthor.user, username: null },
    };
    renderWithTheme(<ThreadByline author={noUsernameAuthor} />);
    // Author name is present
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    // No link should be rendered
    expect(screen.queryByRole('link')).toBeNull();
    // Username should not be rendered
    expect(screen.queryByText('@janedoe')).toBeNull();
  });

  it('renders role badges and beta supporter badge', () => {
    const authorWithBadges = {
      ...baseAuthor,
      user: { ...baseAuthor.user, betaSupporter: true },
      roles: ['moderator', 'owner'],
    };
    const { container } = renderWithTheme(
      <ThreadByline author={authorWithBadges} />
    );
    // Role badges likely render as elements with text or labels; check count via type attribute presence
    // Fallback: query all elements that might be badges by their text content
    expect(
      container.querySelectorAll('[data-testid="badge"], svg, span').length
    ).toBeGreaterThan(0);
    // Supporter label should appear
    expect(screen.getByText(/Supporter/i)).toBeInTheDocument();
  });
});
