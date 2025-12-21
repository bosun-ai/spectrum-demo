const avatarProps = { current: null };

jest.mock('src/components/avatar', () => {
  const React = require('react');

  const CommunityAvatar = props => {
    avatarProps.current = props;
    return React.createElement(
      'div',
      { 'data-testid': 'community-avatar' },
      props.community && props.community.name
    );
  };

  return { CommunityAvatar };
});

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
  beforeEach(() => {
    avatarProps.current = null;
  });

  it('links to the parent community and shows its name', () => {
    const { getByRole, getByText } = renderChannelCommunityMeta();

    const communityLink = getByRole('link', { name: /spectrum/i });
    expect(communityLink).toBeInTheDocument();
    expect(communityLink).toHaveAttribute('href', '/spectrum');

    expect(getByText('Spectrum')).toBeInTheDocument();
  });

  it('passes expected props to CommunityAvatar', () => {
    renderChannelCommunityMeta({
      community: {
        name: 'Design Systems',
        slug: 'design-systems',
        profilePhoto: 'https://images.example/ds.png',
      },
    });

    expect(avatarProps.current).not.toBeNull();
    expect(avatarProps.current.isClickable).toBe(false);
    expect(avatarProps.current.size).toBe(24);
    expect(avatarProps.current.community.slug).toBe('design-systems');
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
