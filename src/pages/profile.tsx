import { useParams } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { AUTH_MODEL } from "../models/auth";
import JsonViewer from "../components/JsonViewer";
import { FeedViewPost, FeedViewPostCard } from "../components/FeedViewPost";

export const ProfilePage = observer(() => {
    const params = useParams({ from: "/profileById" });

    const profileQuery = useQuery(
        ["repoData", params.did],
        async () =>
            AUTH_MODEL.bskyAgent?.getProfile({
                actor: params.did,
            }),

        {
            enabled: !!params.did,
        },
    );

    const likesQuery = useQuery(
        ["likesQuery", params.did],
        async () =>
            AUTH_MODEL.bskyAgent?.getActorLikes({
                actor: params.did,
            }),
        {
            enabled: !!params.did,
        },
    );

    const feedQuery = useQuery(
        ["feedData", params.did],
        async () => AUTH_MODEL.bskyAgent?.getAuthorFeed({ actor: params.did }),
        { enabled: !!params.did },
    );

    const followersQuery = useQuery(
        ["feedData", params.did],
        async () => AUTH_MODEL.bskyAgent?.getFollowers({ actor: params.did, limit: 100 }),
        { enabled: !!params.did },
    );

    const followsQuery = useQuery(
        ["feedData", params.did],
        async () => AUTH_MODEL.bskyAgent?.getFollows({ actor: params.did, limit: 100 }),
        { enabled: !!params.did },
    );

    return (
        <div className="flex flex-col m-4">
            <h1>Profile {params.did}</h1>

            <div className="flex flex-col">
                <h3>Profile</h3>
                <JsonViewer json={profileQuery.data} />
            </div>

            <div className="flex flex-col">
                <h3>Feed</h3>
                <div className="flex flex-col gap-1">
                    {feedQuery.data?.data?.feed?.map?.(post => (
                        <FeedViewPostCard post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
});
