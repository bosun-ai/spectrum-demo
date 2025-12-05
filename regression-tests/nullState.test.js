/*
 * Regression test for src/components/threadFeed/nullState.js
 * Ensures the NullState component renders expected heading and icon
 * across different view contexts and id props.
 */

import React from 'react';
import { render } from '@testing-library/react';
import NullState from '../src/components/threadFeed/nullState';

describe('NullState component', () => {
  it('renders community profile heading when viewContext=communityProfile', () => {
    const { getByText } = render(
      <NullState
        viewContext="communityProfile"
        communityId={null}
        channelId={null}
      />
    );
    expect(getByText('There’s nothing in this community')).toBeTruthy();
  });

  it('renders channel profile heading when viewContext=channelProfile', () => {
    const { getByText } = render(
      <NullState
        viewContext="channelProfile"
        communityId={null}
        channelId={null}
      />
    );
    expect(getByText('There’s nothing in this channel')).toBeTruthy();
  });

  it('renders user profile heading when viewContext=userProfile', () => {
    const { getByText } = render(
      <NullState
        viewContext="userProfile"
        communityId={null}
        channelId={null}
      />
    );
    expect(getByText('This user hasn’t posted yet')).toBeTruthy();
  });

  it('does not render a heading for inbox contexts', () => {
    const { container } = render(
      <NullState
        viewContext="communityInbox"
        communityId={null}
        channelId={null}
      />
    );
    // No heading text should be present
    expect(container.querySelector('h2')).toBeNull();
  });

  it('renders post icon when communityId is provided', () => {
    const { container } = render(
      <NullState
        viewContext="communityProfile"
        communityId={'community-1'}
        channelId={null}
      />
    );
    // Icon component renders an svg element under the hood
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders post icon when channelId is provided', () => {
    const { container } = render(
      <NullState
        viewContext="channelProfile"
        communityId={null}
        channelId={'channel-1'}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
