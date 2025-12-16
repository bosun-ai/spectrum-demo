const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the component from the project source
const {
  ChannelCommunityMeta,
} = require('../src/components/entities/profileCards/components/channelCommunityMeta.js');

// Minimal mock of ChannelInfoType with required nested community fields
function getMockChannel() {
  return {
    id: 'channel-1',
    name: 'General',
    slug: 'general',
    description: 'A place for general discussion',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    isArchived: false,
    channelPermissions: {
      isMember: true,
      isPending: false,
      isBlocked: false,
      isOwner: false,
      isModerator: false,
      receiveNotifications: true,
    },
    community: {
      id: 'community-1',
      name: 'Spectrum',
      slug: 'spectrum',
      description: 'Community description',
      website: 'https://example.com',
      createdAt: new Date().toISOString(),
      memberCount: 123,
      metaData: {
        members: 123,
        channels: 5,
        threads: 10,
      },
      profilePhoto: null,
      coverPhoto: null,
      isPrivate: false,
    },
  };
}

test('renders community name and link to community slug', () => {
  const channel = getMockChannel();
  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ChannelCommunityMeta, { channel })
    )
  );

  // The component shows the community name and wraps in a Link to `/${community.slug}`
  expect(screen.getByText(channel.community.name)).toBeInTheDocument();

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', `/${channel.community.slug}`);
});
