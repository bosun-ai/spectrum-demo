// Regression test for the Overview component
import React from 'react';
import { render } from '@testing-library/react';
import Overview from 'src/views/channelSettings/components/overview';

describe('Overview regression', () => {
  const baseProps = {
    community: { id: 'c1', name: 'Community' },
    communitySlug: 'community',
  };

  it('renders the Overview with a public channel', () => {
    const channel = { id: 'ch1', name: 'Public Channel', isPrivate: false };
    const { getByTestId, container } = render(
      <Overview {...baseProps} channel={channel} />
    );
    // Uses data-cy as data-testid fallback
    const wrapper = container.querySelector('[data-cy="channel-overview"]');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders the Overview with a private channel', () => {
    const channel = { id: 'ch2', name: 'Private Channel', isPrivate: true };
    const { container } = render(<Overview {...baseProps} channel={channel} />);
    // Ensures the container is present for private
    expect(
      container.querySelector('[data-cy="channel-overview"]')
    ).toBeInTheDocument();
  });
});
