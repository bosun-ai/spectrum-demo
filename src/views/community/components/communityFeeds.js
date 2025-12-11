// @flow
import React, { useEffect, useLayoutEffect } from 'react';
import compose from 'recompose/compose';
import { withRouter, type History, type Location } from 'react-router-dom';
import querystring from 'query-string';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import MembersList from './membersList';
import { TeamMembersList } from './teamMembersList';
import { MobileCommunityInfoActions } from './mobileCommunityInfoActions';
import { ChannelsList } from './channelsList';
import { CommunityMeta } from 'src/components/entities/profileCards/components/communityMeta';
import MessagesSubscriber from 'src/views/thread/components/messagesSubscriber';
import { PostsFeeds } from './postsFeeds';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { useAppScroller } from 'src/hooks/useAppScroller';
import usePrevious from 'src/hooks/usePrevious';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { FeedsContainer, SidebarSection, InfoContainer } from '../style';

type Props = {
  community: CommunityInfoType,
  location: Location,
  history: History,
  currentUser: UserInfoType,
};

const Feeds = (props: Props) => {
  const { community, location, history } = props;
  const { search } = location;
  const { tab } = querystring.parse(search);

  const changeTab = (tab: string) => {
    return history.replace({
      ...location,
      search: querystring.stringify({ tab }),
    });
  };

  const handleTabRedirect = () => {
    const { search } = location;
    const { tab } = querystring.parse(search);

    if (!tab) {
      changeTab('posts');
    }

    if (tab === 'chat' && !community.watercoolerId) {
      changeTab('posts');
    }
  };

  useEffect(() => {
    handleTabRedirect();
  }, [tab]);

  const renderFeed = () => {
    switch (tab) {
      case 'chat': {
        if (!community.watercoolerId) return null;
        return (
          <React.Fragment>
            <MessagesSubscriber isWatercooler id={community.watercoolerId} />
          </React.Fragment>
        );
      }
      case 'posts': {
        return <PostsFeeds community={community} />;
      }
      case 'members': {
        return (
          <MembersList
            id={community.id}
            filter={{ isMember: true, isBlocked: false }}
          />
        );
      }
      case 'info': {
        return (
          <InfoContainer>
            <SidebarSection style={{ paddingBottom: '16px' }}>
              <CommunityMeta community={community} />
            </SidebarSection>

            <SidebarSection>
              <TeamMembersList
                community={community}
                id={community.id}
                first={100}
                filter={{ isModerator: true, isOwner: true }}
              />
            </SidebarSection>

            <SidebarSection>
              <ChannelsList id={community.id} communitySlug={community.slug} />
            </SidebarSection>

            <SidebarSection>
              <MobileCommunityInfoActions community={community} />
            </SidebarSection>
          </InfoContainer>
        );
      }
      default:
        return null;
    }
  };

  /*
    Segments preserve scroll position when switched by default. We dont want
    this behavior - if you change the feed (eg threads => members) you should
    always end up at the top of the list. However, if the next active segment
    is chat, we want that scrolled to the bottom by default, since the behavior
    of chat is to scroll up for older messages
  */
  const { scrollToBottom, scrollToTop, scrollTo, ref } = useAppScroller();
  const lastTab = usePrevious(tab);
  const lastScroll = ref ? ref.scrollTop : null;
  // React 17: capture values inside effects to avoid relying on
  // mutable refs during async cleanup, and useLayoutEffect for sync timing
  // when manipulating scroll before paint. Version delta: 16.8.6 -> 17.0.2
  useLayoutEffect(() => {
    if (lastTab && lastTab !== tab && lastScroll) {
      sessionStorage.setItem(`last-scroll-${lastTab}`, lastScroll.toString());
    }
    const stored =
      sessionStorage && sessionStorage.getItem(`last-scroll-${tab}`);
    if (tab === 'chat') {
      scrollToBottom();
      // If the user goes back, restore the scroll position
    } else if (stored && history.action === 'POP') {
      scrollTo(Number(stored));
    } else {
      scrollToTop();
    }
  }, [tab]);

  // Store the last scroll position on unmount
  // React 17: cleanup is async; ensure we capture element reference
  // synchronously for cleanup to avoid reading a potentially changed ref.
  // Also useLayoutEffect to guarantee cleanup runs before next paint on unmount.
  // Version delta: 16.8.6 -> 17.0.2
  useLayoutEffect(() => {
    const mainEl = document.getElementById('main');
    return () => {
      const elem = mainEl || document.getElementById('main');
      if (!elem) return;
      sessionStorage.setItem(`last-scroll-${tab}`, elem.scrollTop.toString());
    };
  }, []);

  const segments = ['posts', 'members', 'info'];
  if (community.watercoolerId) segments.splice(1, 0, 'chat');

  // if the community being viewed changes, and the previous community had
  // a watercooler but the next one doesn't, select the posts tab on the new one
  useEffect(() => {
    handleTabRedirect();
  }, [community.slug]);

  return (
    <FeedsContainer data-cy="community-view-content">
      <SegmentedControl>
        {segments.map(segment => {
          return (
            <Segment
              key={segment}
              hideOnDesktop
              isActive={segment === tab}
              onClick={() => changeTab(segment)}
            >
              {segment[0].toUpperCase() + segment.substr(1)}
            </Segment>
          );
        })}
      </SegmentedControl>
      {renderFeed()}
    </FeedsContainer>
  );
};

export const CommunityFeeds = compose(
  withRouter,
  withCurrentUser
)(Feeds);
