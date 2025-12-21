// @flow
const baseChannel = {
  id: 'channel-1',
  name: 'general',
  slug: 'general',
  description: 'General channel',
  isArchived: false,
  community: {
    id: 'community-1',
    name: 'Spectrum',
    slug: 'spectrum',
  },
};

const buildChannel = (overrides: Object = {}) => ({
  ...baseChannel,
  ...overrides,
  community: {
    ...baseChannel.community,
    ...(overrides.community || {}),
  },
});

module.exports = { baseChannel, buildChannel };
