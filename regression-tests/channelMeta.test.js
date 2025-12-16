const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');
// Mock style module to plain elements to avoid styled-components issues
jest.mock('../src/components/entities/profileCards/style', () => ({
  MetaContainer: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('div', rest, children);
  },
  Name: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('h1', rest, children);
  },
  Description: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('p', rest, children);
  },
  Username: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('div', rest, children);
  },
}));

// Import the component under test (default/CommonJS interop)
const channelMetaModule = require('../src/components/entities/profileCards/components/channelMeta.js');
const ChannelMeta =
  channelMetaModule.ChannelMeta ||
  channelMetaModule.default ||
  channelMetaModule;

// Helper to build a minimal channel shape
const buildChannel = ({
  name = 'general',
  slug = 'general',
  description = 'Discuss things at https://example.com',
  isArchived = false,
  communitySlug = 'acme',
} = {}) => ({
  name,
  slug,
  description,
  isArchived,
  community: { slug: communitySlug },
});

describe('ChannelMeta', () => {
  test('renders name with leading # and correct link', () => {
    const channel = buildChannel({
      name: 'random',
      slug: 'random',
      communitySlug: 'acme',
    });
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ChannelMeta, { channel })
      )
    );

    // Name prefixed with #
    expect(screen.getByText('# random')).toBeInTheDocument();

    // Link points to /community/channel
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/acme/random');
  });

  test('shows Archived badge when isArchived is true', () => {
    const channel = buildChannel({ isArchived: true });
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ChannelMeta, { channel })
      )
    );

    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  test('renders description with markdown links processed', () => {
    const channel = buildChannel({
      description: 'Check this: https://example.com/docs',
    });
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ChannelMeta, { channel })
      )
    );

    // Description text should render and include an anchor for the URL
    const descriptionText = screen.getByText(/Check this:/i);
    expect(descriptionText).toBeInTheDocument();

    // Find the link produced by renderTextWithLinks within the Description container
    const descriptionContainer = descriptionText.closest('p');
    const anchors = descriptionContainer
      ? descriptionContainer.querySelectorAll('a')
      : [];
    expect(anchors.length).toBeGreaterThan(0);
    // One of the anchors should point to example.com/docs
    const match = Array.from(anchors).find(
      a => a.getAttribute('href') === 'https://example.com/docs'
    );
    expect(match).toBeTruthy();
  });
});
