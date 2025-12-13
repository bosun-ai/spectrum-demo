const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the component from source
const {
  ChannelCommunityMeta,
} = require('../src/components/entities/profileCards/components/channelCommunityMeta.js');

// Minimal shape that satisfies the component's usage
const makeChannel = () => ({
  id: 'channel-1',
  slug: 'general',
  name: 'General',
  community: {
    id: 'community-1',
    slug: 'my-community',
    name: 'My Community',
    photoUrl: null,
  },
});

test('ChannelCommunityMeta renders community name and link', () => {
  const channel = makeChannel();
  const element = React.createElement(ChannelCommunityMeta, { channel });
  const { getByText } = render(
    React.createElement(MemoryRouter, null, element)
  );

  // Assert the community name appears
  const nameEl = getByText('My Community');
  expect(nameEl).toBeInTheDocument();

  // The clickable wrapper should link to the community slug
  const linkEl = nameEl.closest('a');
  expect(linkEl).toBeTruthy();
  expect(linkEl.getAttribute('href')).toBe('/my-community');
});
