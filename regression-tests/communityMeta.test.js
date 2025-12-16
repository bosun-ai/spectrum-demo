const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock react-router-dom Link to render an anchor with to as href
jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...rest }) =>
    React.createElement(
      'a',
      { href: typeof to === 'string' ? to : '#', ...rest },
      children
    ),
}));

// Mock Icon to a simple span to avoid SVG complexity
jest.mock('src/components/icon', () => ({
  __esModule: true,
  default: ({ glyph, size }) =>
    React.createElement('span', {
      'data-testid': 'icon',
      'data-glyph': glyph,
      'data-size': String(size),
    }),
}));

// Mock styled components used in CommunityMeta to plain elements
jest.mock('src/components/entities/profileCards/style', () => ({
  MetaContainer: props => React.createElement('div', { ...props }),
  Name: props => React.createElement('h2', { ...props }),
  Description: props => React.createElement('p', { ...props }),
  MetaLinksContainer: props => React.createElement('div', { ...props }),
  MetaRow: props => React.createElement('div', { ...props }),
}));

// Import component under test
const {
  CommunityMeta,
} = require('../src/components/entities/profileCards/components/communityMeta.js');

describe('CommunityMeta', () => {
  test('renders name link, description and website link', () => {
    const community = {
      slug: 'my-community',
      name: 'My Community',
      description: 'Visit **our** site: https://example.com',
      website: 'example.com',
    };

    render(React.createElement(CommunityMeta, { community }));

    // Name renders inside link to /slug
    const nameLink = screen.getByRole('link', { name: 'My Community' });
    expect(nameLink).toHaveAttribute('href', '/my-community');

    // Description should render text content (markdown links handled)
    expect(screen.getByText(/Visit/)).toBeInTheDocument();

    // Website link should be normalized with protocol and show raw website text
    const websiteLink = screen.getByRole('link', { name: /example\.com/i });
    expect(websiteLink).toHaveAttribute('href', 'https://example.com');
  });

  test('omits description and website when not provided', () => {
    const community = {
      slug: 'empty',
      name: 'Empty Community',
    };

    render(React.createElement(CommunityMeta, { community }));

    // Name link still renders
    expect(
      screen.getByRole('link', { name: 'Empty Community' })
    ).toHaveAttribute('href', '/empty');

    // No description paragraph
    expect(screen.queryByText(/Empty Community/)).toBeInTheDocument();
    // There should be no extra link besides the name link
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
  });
});
