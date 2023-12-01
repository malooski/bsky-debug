import { Box, Tabs } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { FeedViewPostCard } from "../components/FeedViewPost";
import { UserCard } from "../components/UserCard";
import { AUTH_MODEL } from "../models/auth";
import styled from "styled-components";

const RootDiv = styled.div({
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    gap: "1rem",
});

export const ProfileByDidPage = observer(() => {
    const params = useParams({ from: "/profile/profileByDid" });
    return <BaseProfilePage did={params.did} />;
});

export const MyProfilePage = observer(() => {
    if (!AUTH_MODEL.myDid) {
        return <Navigate to="/login" />;
    }

    return <BaseProfilePage did={AUTH_MODEL.myDid} />;
});

export const BaseProfilePage = observer((props: { did: string }) => {
    const { did } = props;

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

    const feedQuery = useQuery({
        queryKey: ["authorFeedData", did],
        queryFn: async () => AUTH_MODEL.bskyAgent.getAuthorFeed({ actor: did }),
    });

    return (
        <div className="flex flex-col gap-1">
            {feedQuery.data?.data?.feed?.map?.(post => (
                <FeedViewPostCard key={post.post.cid} post={post} />
            ))}
        </div>
    );
});

const FollowingContent = observer((props: { did: string }) => {
    const { did } = props;

    const followingQuery = useQuery({
        queryKey: ["authorFollowing", did],
        queryFn: async () => AUTH_MODEL.bskyAgent?.getFollows({ actor: did, limit: 100 }),
    });
    return (
        <div className="flex flex-col gap-1">
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
        </div>
    );
});

const FollowersContent = observer((props: { did: string }) => {
    const { did } = props;

    const followersQuery = useQuery({
        queryKey: ["authorFollowers", did],
        queryFn: async () => AUTH_MODEL.bskyAgent?.getFollowers({ actor: did, limit: 100 }),
    });
    return (
        <div className="flex flex-col gap-1">
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
        </div>
    );
});
