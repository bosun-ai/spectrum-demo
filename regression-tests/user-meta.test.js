// Regression test for UserMeta component rendering
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

// Component under test
import { UserMeta } from '../src/components/entities/profileCards/components/userMeta';

// Mock GithubProfile to control render-prop invocation deterministically
jest.mock('../src/components/githubProfile', () => {
  // The real component accepts props: { id, render }
  // We'll call render with a fake profile when id === 'with-github'
  const MockGithubProfile = ({ id, render }) => {
    const profile = id === 'with-github' ? { username: 'octocat' } : null;
    return render(profile);
  };
  return MockGithubProfile;
});

describe('UserMeta', () => {
  const baseUser = {
    id: 'user-1',
    name: 'Ada Lovelace',
    username: 'ada',
    website: 'example.com',
    description:
      'Engineer at **Spectrum**. See [profile](https://example.com/profile).',
  };

  it('renders name and username', () => {
    const { getByText } = render(
      <MemoryRouter>
        <UserMeta user={baseUser} />
      </MemoryRouter>
    );

    expect(getByText('Ada Lovelace')).toBeInTheDocument();
    // Username should be prefixed with '@'
    expect(getByText('@ada')).toBeInTheDocument();
  });

  it('renders description with markdown links', () => {
    const { getByText } = render(
      <MemoryRouter>
        <UserMeta user={baseUser} />
      </MemoryRouter>
    );

    const profileLink = getByText(/profile/i).closest('a');
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', 'https://example.com/profile');
  });

  it('renders website link with protocol normalization', () => {
    const { getByText } = render(
      <MemoryRouter>
        <UserMeta user={baseUser} />
      </MemoryRouter>
    );
    const websiteLink = getByText(/example.com/i).closest('a');
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('href', 'https://example.com');
  });

  it('omits username, description, website when not provided', () => {
    const minimal = { id: 'u2', name: 'Grace Hopper' };
    const { queryByText } = render(
      <MemoryRouter>
        <UserMeta user={minimal} />
      </MemoryRouter>
    );
    expect(queryByText('@')).toBeNull();
    expect(queryByText(/profile/i)).toBeNull();
    expect(queryByText(/example.com/i)).toBeNull();
    expect(queryByText('Grace Hopper')).toBeInTheDocument();
  });

  it('renders github profile link when GithubProfile provides data', () => {
    const userWithGithub = { ...baseUser, id: 'with-github' };
    const { getByText } = render(
      <MemoryRouter>
        <UserMeta user={userWithGithub} />
      </MemoryRouter>
    );
    const ghLink = getByText('@octocat').closest('a');
    expect(ghLink).toBeInTheDocument();
    expect(ghLink).toHaveAttribute('href', 'https://github.com/octocat');
  });

  it('does not render github link when GithubProfile returns null', () => {
    const userNoGithub = { ...baseUser, id: 'no-github' };
    const { queryByText } = render(
      <MemoryRouter>
        <UserMeta user={userNoGithub} />
      </MemoryRouter>
    );
    expect(queryByText('@octocat')).toBeNull();
  });
});
