import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommunityFeeds } from '../src/views/community/components/communityFeeds';
import { MemoryRouter } from 'react-router-dom';

// Minimal mocks for child components used inside CommunityFeeds
jest.mock('../src/views/thread/components/messagesSubscriber', () => ({
  __esModule: true,
  default: () => <div>Watercooler Chat</div>,
}));

jest.mock('../src/views/community/components/postsFeeds', () => ({
  __esModule: true,
  PostsFeeds: ({ community }) => <div>Posts for {community.slug}</div>,
}));

jest.mock('../src/views/community/components/membersList', () => ({
  __esModule: true,
  default: () => <div>Members List</div>,
}));

jest.mock('../src/views/community/components/teamMembersList', () => ({
  __esModule: true,
  TeamMembersList: () => <div>Team Members</div>,
}));

jest.mock('../src/views/community/components/channelsList', () => ({
  __esModule: true,
  ChannelsList: () => <div>Channels List</div>,
}));

jest.mock(
  '../src/views/community/components/mobileCommunityInfoActions',
  () => ({
    __esModule: true,
    MobileCommunityInfoActions: () => <div>Mobile Actions</div>,
  })
);

jest.mock(
  '../src/components/entities/profileCards/components/communityMeta',
  () => ({
    __esModule: true,
    CommunityMeta: () => <div>Community Meta</div>,
  })
);

// withCurrentUser HOC returns the same component; keep behavior minimal
jest.mock('../src/components/withCurrentUser', () => ({
  __esModule: true,
  withCurrentUser: Comp => Comp,
}));

// Helper to render with router and initial search params
const renderWithRouter = (ui, { route = '/' } = {}) => {
  // Use MemoryRouter with initialEntries; avoid touching window.history directly
  const entry = route.startsWith('/') ? route : `/${route}`;
  return render(<MemoryRouter initialEntries={[entry]}>{ui}</MemoryRouter>);
};

describe('CommunityFeeds regression', () => {
  const baseCommunity = {
    id: 'c1',
    slug: 'alpha',
    pinnedThreadId: null,
    watercoolerId: null,
  };

  it('defaults to posts tab and renders PostsFeeds when no tab specified', async () => {
    renderWithRouter(<CommunityFeeds community={baseCommunity} />, {
      route: '/community',
    });
    // CommunityFeeds should redirect to posts and render PostsFeeds
    expect(await screen.findByText(/Posts for alpha/i)).toBeInTheDocument();
    // Segmented control should show Posts segment active
    const postsSegment = screen.getByRole('button', { name: /Posts/i });
    expect(postsSegment).toBeInTheDocument();
  });

  it('includes chat segment only when watercoolerId exists and renders it', async () => {
    const communityWithChat = { ...baseCommunity, watercoolerId: 'w123' };
    renderWithRouter(<CommunityFeeds community={communityWithChat} />, {
      route: '/community?tab=chat',
    });
    // Chat feed rendered via mocked MessagesSubscriber
    expect(await screen.findByText(/Watercooler Chat/i)).toBeInTheDocument();
    // Chat segment should be present
    expect(screen.getByRole('button', { name: /Chat/i })).toBeInTheDocument();
  });

  it('renders members list when members tab is active', async () => {
    renderWithRouter(<CommunityFeeds community={baseCommunity} />, {
      route: '/community?tab=members',
    });
    expect(await screen.findByText(/Members List/i)).toBeInTheDocument();
  });

  it('renders info view with meta and lists when info tab is active', async () => {
    renderWithRouter(<CommunityFeeds community={baseCommunity} />, {
      route: '/community?tab=info',
    });
    // Check presence of key sections in info view
    expect(await screen.findByText(/Community Meta/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Members/i)).toBeInTheDocument();
    expect(screen.getByText(/Channels List/i)).toBeInTheDocument();
    expect(screen.getByText(/Mobile Actions/i)).toBeInTheDocument();
  });

  it('clicking segments switches the tab and updates rendered feed', async () => {
    // user-event v12 used in this repo exposes fireEvent-like API without setup
    const user = userEvent;
    renderWithRouter(<CommunityFeeds community={baseCommunity} />, {
      route: '/community?tab=members',
    });
    // Ensure members is initially rendered
    expect(await screen.findByText(/Members List/i)).toBeInTheDocument();
    // Switch to Posts by clicking segment button
    await user.click(screen.getByRole('button', { name: /Posts/i }));
    expect(await screen.findByText(/Posts for alpha/i)).toBeInTheDocument();
  });
});
