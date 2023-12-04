import { Box, Button, Tabs } from "@radix-ui/themes";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react";
import { FeedViewPostCard } from "../components/FeedViewPost";
import { UserCard } from "../components/Profile";
import { AUTH_MODEL } from "../models/auth";
import styled from "styled-components";
import { Navigate, useParams } from "react-router-dom";
import { Fragment } from "react";

const RootDiv = styled.div({
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    gap: "1rem",
});

const ContentListDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const ProfilePage = observer(() => {
    const params = useParams();
    const did = params.did ?? AUTH_MODEL.loggedInContext?.did;

    if (!did) {
        return <Navigate to="/dashboard" />;
    }

    const userQuery = useQuery({
        queryKey: ["getUserProfile", did],
        queryFn: async () =>
            AUTH_MODEL.bskyAgent.getProfile({
                actor: did,
            }),
    });

    return (
        <RootDiv>
            {userQuery.isLoading && <span>Loading</span>}

            {userQuery.data && (
                <UserCard
                    did={userQuery.data.data.did}
                    avatar={userQuery.data.data.avatar}
                    handle={userQuery.data.data.handle}
                    displayName={userQuery.data.data.displayName}
                    json={userQuery.data.data}
                />
            )}

            <Tabs.Root defaultValue="feed">
                <Tabs.List>
                    <Tabs.Trigger value="feed">Feed</Tabs.Trigger>
                    <Tabs.Trigger value="following">Following</Tabs.Trigger>
                    <Tabs.Trigger value="followers">Followers</Tabs.Trigger>
                </Tabs.List>

                <Box px="4" pt="3" pb="2">
                    <Tabs.Content value="feed">
                        <AuthorFeedContent did={did} />
                    </Tabs.Content>

                    <Tabs.Content value="following">
                        <FollowingContent did={did} />
                    </Tabs.Content>

                    <Tabs.Content value="followers">
                        <FollowersContent did={did} />
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </RootDiv>
    );
});

const AuthorFeedContent = observer((props: { did: string }) => {
    const { did } = props;

    const feedQuery = useInfiniteQuery({
        queryKey: ["authorFeedData", did],
        initialPageParam: undefined as string | undefined,
        queryFn: async ({ pageParam }) =>
            AUTH_MODEL.bskyAgent.getAuthorFeed({ actor: did, cursor: pageParam, limit: 100 }),
        getNextPageParam: lastPage => lastPage.data.cursor,
    });

    return (
        <ContentListDiv>
            {feedQuery.data?.pages?.map?.((group, groupIdx) => (
                <Fragment key={groupIdx}>
                    {group.data.feed.map((post, postIdx) => (
                        <FeedViewPostCard key={`${groupIdx}_${postIdx}`} post={post} />
                    ))}
                </Fragment>
            ))}

            <Button
                disabled={feedQuery.isFetching || !feedQuery.hasNextPage}
                onClick={() => feedQuery.fetchNextPage()}
            >
                {feedQuery.isFetching ? "Loading more..." : "Load more"}
            </Button>
        </ContentListDiv>
    );
});

const FollowingContent = observer((props: { did: string }) => {
    const { did } = props;

    const followingQuery = useQuery({
        queryKey: ["authorFollowing", did],
        queryFn: async () => AUTH_MODEL.bskyAgent?.getFollows({ actor: did, limit: 100 }),
    });
    return (
        <ContentListDiv>
            {followingQuery.data?.data?.follows?.map?.(profile => (
                <UserCard
                    key={profile.did}
                    did={profile.did}
                    handle={profile.handle}
                    avatar={profile.avatar}
                    displayName={profile.displayName}
                    json={profile}
                />
            ))}
        </ContentListDiv>
    );
});

const FollowersContent = observer((props: { did: string }) => {
    const { did } = props;

    const followersQuery = useQuery({
        queryKey: ["authorFollowers", did],
        queryFn: async () => AUTH_MODEL.bskyAgent?.getFollowers({ actor: did, limit: 100 }),
    });
    return (
        <ContentListDiv>
            {followersQuery.data?.data?.followers?.map?.(profile => (
                <UserCard
                    key={profile.did}
                    did={profile.did}
                    handle={profile.handle}
                    avatar={profile.avatar}
                    displayName={profile.displayName}
                    json={profile}
                />
            ))}
        </ContentListDiv>
    );
});
