import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import ThreadByline from '../src/views/thread/components/threadByline';

const renderWithTheme = ui =>
  render(
    <MemoryRouter>
      <MockedProvider mocks={[]} addTypename={false}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </MockedProvider>
    </MemoryRouter>
  );

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
    // Two links may exist (avatar link + name link). Ensure one matches expected href.
    const links = screen.getAllByRole('link');
    expect(links.some(l => l.getAttribute('href') === '/users/janedoe')).toBe(
      true
    );
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
    renderWithTheme(<ThreadByline author={authorWithBadges} />);
    // Supporter label should appear
    expect(screen.getByText(/Supporter/i)).toBeInTheDocument();
    // Link remains present
    const links = screen.getAllByRole('link');
    expect(links.some(l => l.getAttribute('href') === '/users/janedoe')).toBe(
      true
    );
  });
});
