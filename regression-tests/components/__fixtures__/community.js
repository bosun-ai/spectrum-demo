const baseCommunity = {
  id: 'community-1',
  name: 'Acme',
  slug: 'acme',
  description: 'Acme community',
  profilePhoto: 'acme.png',
  website: 'https://acme.example',
  communityPermissions: {
    isMember: false,
    isOwner: false,
    isModerator: false,
  },
  redirect: false,
};

const buildCommunity = (overrides = {}) => ({
  ...baseCommunity,
  ...overrides,
  communityPermissions: {
    ...baseCommunity.communityPermissions,
    ...(overrides.communityPermissions || {}),
  },
});

module.exports = { baseCommunity, buildCommunity };
