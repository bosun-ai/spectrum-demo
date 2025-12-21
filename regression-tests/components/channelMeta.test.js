const React = require('react');
const { MemoryRouter } = require('react-router-dom');
const { render } = require('@testing-library/react');
const {
  ChannelMeta,
} = require('../../src/components/entities/profileCards/components/channelMeta');
const { buildChannel } = require('./__fixtures__/channel');

const renderChannelMeta = (overrides = {}) =>
  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ChannelMeta, { channel: buildChannel(overrides) })
    )
  );

describe('ChannelMeta', () => {
  it('links to the channel and displays its name', () => {
    const { getByRole } = renderChannelMeta();
    const nameLink = getByRole('link', { name: /#\s+general/i });

    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', '/spectrum/general');
  });

  it('renders archived label when channel is archived', () => {
    const { getByText } = renderChannelMeta({ isArchived: true });

    expect(getByText('Archived')).toBeInTheDocument();
  });

  it('renders markdown links inside the description', () => {
    const description = 'See [docs](https://example.com/docs) for details';
    const { getByRole } = renderChannelMeta({ description });

    const markdownLink = getByRole('link', { name: 'docs' });
    expect(markdownLink).toBeInTheDocument();
    expect(markdownLink).toHaveAttribute('href', 'https://example.com/docs');
  });
});
