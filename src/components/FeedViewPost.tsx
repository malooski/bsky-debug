import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { get } from "lodash";
import { observer } from "mobx-react";
import { useState } from "react";

import {
    AppBskyFeedDefs,
    AppBskyEmbedImages,
    AppBskyEmbedRecord,
    AppBskyFeedPost,
    AppBskyEmbedExternal,
} from "@atproto/api";
import {
    ChatBubbleIcon,
    HeartFilledIcon,
    LoopIcon,
    MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Card, IconButton, Text } from "@radix-ui/themes";

import "highlight.js/styles/dark.css";
import { formatDistanceToNow } from "date-fns";
import { JsonViewer } from "./JsonViewer";
import styled from "styled-components";
import { UserCard } from "./UserCard";

interface FeedViewPostProps {
    post: FeedViewPost;
}

const FooterDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 0.75rem;
`;

const RootCard = styled(Card)`
    position: relative;
`;

const ShowRawButton = styled(IconButton)`
    position: absolute;
    right: 1rem;
    top: 1rem;
`;

const EmbedImg = styled.img`
    max-width: 500px;
    max-height: 500px;
    border-radius: 0.25rem;
`;

const PostDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const RepostInfoDiv = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
`;

const CreatedAtDiv = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
`;

const StatsDiv = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
`;

const QuotePostDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    margin: 1rem;
    border-radius: 1rem;

    border: 1px solid ${p => p.theme.colors.primary};
`;

const ExternalEmbedDiv = styled.div`
    display: grid;
    grid:
        "thumb title" auto
        "thumb desc" auto
        / auto 1fr;

    border: 1px solid ${p => p.theme.colors.primary};
    border-radius: 1rem;

    padding: 1rem;
    margin: 1rem;

    gap: 0.5rem;

    img {
        grid-area: thumb;
        width: 4rem;
        height: 4rem;
    }

    a {
        grid-area: title;
    }

    span {
        grid-area: desc;
    }
`;

const PostText = styled.div`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

export const FeedViewPostCard = observer((props: FeedViewPostProps) => {
    const { post } = props;

    const [showRaw, setShowRaw] = useState(false);

    const text = (get(post, "post.record.text") as string) ?? "N/A";

    const author = post.post.author;

    return (
        <RootCard>
            <ShowRawButton onClick={() => setShowRaw(v => !v)}>
                <MagnifyingGlassIcon />
            </ShowRawButton>
            {renderRaw()}
            {renderPost()}
        </RootCard>
    );

    function renderRepost() {
        if (AppBskyFeedDefs.isReasonRepost(post.reason)) {
            return (
                <RepostInfoDiv>
                    <LoopIcon />
                    <Text size="1">
                        Reposted by {post.reason.by.displayName ?? post.reason.by.handle}
                    </Text>
                </RepostInfoDiv>
            );
        }

        return null;
    }

    function renderImageEmbeds() {
        if (AppBskyEmbedImages.isView(post.post.embed)) {
            return (
                <div className="flex flex-row gap-2">
                    {post.post.embed.images.map(i => (
                        <EmbedImg src={i.thumb} />
                    ))}
                </div>
            );
        }

        return null;
    }

    function renderQuotedPost() {
        if (AppBskyEmbedRecord.isView(post.post.embed)) {
            const emRec = post.post.embed.record;

            if (AppBskyEmbedRecord.isViewRecord(emRec)) {
                if (AppBskyFeedPost.isRecord(emRec.value)) {
                    return (
                        <QuotePostDiv>
                            <UserCard
                                minimal
                                did={emRec.author.did}
                                handle={emRec.author.handle}
                                displayName={emRec.author.displayName}
                                avatar={emRec.author.avatar}
                                json={emRec.author}
                            />
                            <PostText>{emRec.value.text}</PostText>
                        </QuotePostDiv>
                    );
                }
            }
        }

        return null;
    }

    function renderExternalEmbeds() {
        if (AppBskyEmbedExternal.isView(post.post.embed)) {
            const ext = post.post.embed.external;
            return (
                <ExternalEmbedDiv>
                    <img src={ext.thumb}></img>
                    <a href={ext.uri}>{ext.title}</a>
                    <span>{ext.description}</span>
                </ExternalEmbedDiv>
            );
        }

        return null;
    }

    function renderFooter() {
        return (
            <FooterDiv>
                <CreatedAtDiv>
                    <Text>
                        {formatDistanceToNow(new Date(post.post.indexedAt), { addSuffix: true })}
                    </Text>
                </CreatedAtDiv>
                <StatsDiv>
                    <div>
                        {post.post.likeCount != null && (
                            <div className="flex flex-row items-center gap-1">
                                <HeartFilledIcon />
                                <span>{post.post.likeCount}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        {post.post.replyCount != null && (
                            <div className="flex flex-row items-center gap-1">
                                <ChatBubbleIcon />
                                <span>{post.post.replyCount}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        {post.post.repostCount != null && (
                            <div className="flex flex-row items-center gap-1">
                                <LoopIcon />
                                <span>{post.post.repostCount}</span>
                            </div>
                        )}
                    </div>
                </StatsDiv>
            </FooterDiv>
        );
    }

    function renderRaw() {
        if (!showRaw) return null;

        return <JsonViewer json={post} />;
    }

    function renderPost() {
        if (showRaw) return null;

        return (
            <PostDiv>
                {renderRepost()}
                <UserCard
                    minimal
                    did={author.did}
                    handle={author.handle}
                    displayName={author.displayName}
                    avatar={author.avatar}
                    json={author}
                />
                <PostText>{text}</PostText>
                {renderImageEmbeds()}
                {renderExternalEmbeds()}
                {renderQuotedPost()}
                {renderFooter()}
            </PostDiv>
        );
    }
});
