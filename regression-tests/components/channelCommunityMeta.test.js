const React = require('react');
const { MemoryRouter } = require('react-router-dom');
const { render } = require('@testing-library/react');
const {
  ChannelCommunityMeta,
} = require('../../src/components/entities/profileCards/components/channelCommunityMeta');
const { buildChannel } = require('./__fixtures__/channel');

const renderChannelCommunityMeta = (overrides = {}) =>
  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ChannelCommunityMeta, {
        channel: buildChannel(overrides),
      })
    )
  );

describe('ChannelCommunityMeta', () => {
  it('links to the parent community and shows its name', () => {
    const { getByRole, getByText } = renderChannelCommunityMeta();

    const communityLink = getByRole('link', { name: /spectrum/i });
    expect(communityLink).toBeInTheDocument();
    expect(communityLink).toHaveAttribute('href', '/spectrum');

    expect(getByText('Spectrum')).toBeInTheDocument();
  });

  it('renders a community avatar with the community name as alt text', () => {
    const communityName = 'Design Systems';
    const { getByAltText } = renderChannelCommunityMeta({
      community: {
        name: communityName,
        slug: 'design-systems',
        profilePhoto: 'https://images.example/ds.png',
      },
    });

    const avatar = getByAltText(communityName);
    expect(avatar.tagName).toBe('IMG');
  });

  it('uses the community slug inside the outer link', () => {
    const { getByRole } = renderChannelCommunityMeta({
      community: {
        name: 'Design Systems',
        slug: 'design-systems',
      },
    });

    const communityLink = getByRole('link', { name: /design systems/i });
    expect(communityLink).toHaveAttribute('href', '/design-systems');
  });
});
