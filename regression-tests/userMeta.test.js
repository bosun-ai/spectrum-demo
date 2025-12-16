const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock aliased helpers used inside the component file
jest.mock('../src/helpers/render-text-with-markdown-links', () => text => {
  const React = require('react');
  const match = /\[(.+?)\]\((.+?)\)/.exec(text || '');
  if (match) {
    return React.createElement(
      React.Fragment,
      null,
      'Creator of the first algorithm. ',
      React.createElement('a', { href: match[2] }, match[1])
    );
  }
  return text;
});
jest.mock('../shared/normalize-url', () => url => {
  if (!url) return url;
  return url.startsWith('http') ? url : `https://${url}`;
});

// Import the component from the project source (after mocks so they apply)
const {
  UserMeta,
} = require('../src/components/entities/profileCards/components/userMeta.js');

// Minimal mock for Icon to avoid styled-component class noise
jest.mock('../src/components/icon', () => {
  const React = require('react');
  return function IconMock({ glyph, size }) {
    return React.createElement(
      'span',
      { className: 'icon', 'data-glyph': glyph },
      `icon-${glyph}-${size}`
    );
  };
});

// Mock GithubProfile to control render prop without hitting network
jest.mock('../src/components/githubProfile', () => {
  const React = require('react');
  return function GithubProfileMock({ render }) {
    // Simulate presence of a github profile by default
    return render({ username: 'octocat' });
  };
});

// Basic user object based on UserInfoType fields used by the component
const baseUser = {
  id: 'user-1',
  name: 'Ada Lovelace',
  username: 'ada',
  description:
    'Creator of the first algorithm. Visit [site](https://example.com).',
  website: 'example.com',
};

test('renders name and optional username', () => {
  render(React.createElement(UserMeta, { user: baseUser }));
  expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
  // Username should be prefixed with @
  expect(screen.getByText('@ada')).toBeInTheDocument();
});

test('renders description with markdown links', () => {
  render(React.createElement(UserMeta, { user: baseUser }));
  // The description text should be present
  expect(
    screen.getByText('Creator of the first algorithm.')
  ).toBeInTheDocument();
  // Link created by renderTextWithLinks should render anchor with correct href
  const link = screen.getByRole('link', { name: /site/i });
  expect(link).toHaveAttribute('href', 'https://example.com');
});

test('normalizes website and displays link icon + raw website', () => {
  render(React.createElement(UserMeta, { user: baseUser }));
  // It should render a link to the normalized website (with protocol)
  const websiteLink = screen.getByRole('link', { name: /example\.com/i });
  expect(websiteLink).toHaveAttribute('href', 'https://example.com');
  // Includes link icon (mocked)
  expect(screen.getByText(/icon-link-20/)).toBeInTheDocument();
});

test('renders Github profile row when available', () => {
  render(React.createElement(UserMeta, { user: baseUser }));
  const ghLink = screen.getByRole('link', { name: /@octocat/i });
  expect(ghLink).toHaveAttribute('href', 'https://github.com/octocat');
  // Includes github icon (mocked)
  expect(screen.getByText(/icon-github-20/)).toBeInTheDocument();
});

test('handles missing optional fields gracefully', () => {
  const noOptionals = { id: 'u2', name: 'Grace Hopper' };
  render(React.createElement(UserMeta, { user: noOptionals }));
  expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
  // No username shown
  expect(screen.queryByText(/^@/)).toBeNull();
  // No website link
  expect(screen.queryByText(/icon-link-20/)).toBeNull();
});
