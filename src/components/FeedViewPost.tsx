import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { get } from "lodash";
import { observer } from "mobx-react";
import { useState } from "react";

import {
    AppBskyEmbedExternal,
    AppBskyEmbedImages,
    AppBskyEmbedRecord,
    AppBskyFeedDefs,
    AppBskyFeedPost,
} from "@atproto/api";
import { ChatBubbleIcon, HeartFilledIcon, LoopIcon } from "@radix-ui/react-icons";
import { Button, Card, Text } from "@radix-ui/themes";

import { formatDistanceToNow } from "date-fns";
import "highlight.js/styles/dark.css";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { JsonViewer } from "./JsonViewer";
import { ProfileView } from "./Profile";
import { Flex } from "./common";

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
    display: flex;
    flex-direction: column;
`;

const EmbedImg = styled.img`
    width: 100%;
    border-radius: 0.25rem;

    max-width: 500px;
    max-height: 500px;

    object-fit: contain;
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

const AvatarWithContentDiv = styled.div`
    display: grid;
    grid-template-columns: 5em 1fr;

    gap: 0.5rem;
`;

const TransparentAvatarWithContentDiv = styled(AvatarWithContentDiv)`
    opacity: 0.5;

    &:hover {
        opacity: 1;
    }

    transition: opacity 0.5s;
`;

const QuotePostDiv = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const ExternalEmbedDiv = styled(Card)`
    display: grid;
    grid:
        "title" auto
        "desc" auto
        / auto;

    gap: 0.5rem;

    img {
        grid-area: thumb;
        width: 5rem;
        height: 5rem;
        object-fit: cover;
        padding: 0.5rem;

        float: left;
    }

    a {
        grid-area: title;
    }

    span {
        grid-area: desc;
    }
`;

const ImageEmbeds2Div = styled.div`
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 0.5rem;
`;

const PostText = styled.div`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const ReplyDividerDiv = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;

    align-items: center;
`;

const AuthorName = styled.span`
    font-weight: bold;
`;

const AvatarImgRaw = styled.img`
    border-radius: 2rem;
`;

const AvatarImg = observer((props: { src?: string }) => {
    return <AvatarImgRaw width="100%" src={props.src} />;
});

function RepliedSeperator() {
    return (
        <ReplyDividerDiv>
            <hr style={{ width: "50%" }} />
            <Flex align="center" gap="1.5rem">
                <ChatBubbleIcon />
                <span>Replied</span>
            </Flex>
            <hr style={{ width: "50%" }} />
        </ReplyDividerDiv>
    );
}

interface EmbeddedImagesProps {
    images: { src: string; alt?: string; thumb?: string }[];
}

export function EmbeddedImages(props: EmbeddedImagesProps) {
    const { images } = props;

    if (images.length === 0) return null;

    if (images.length === 1) {
        const image = images[0]!;
        return <EmbedImg alt={image.alt} src={image.thumb ?? image.src} />;
    }

    return (
        <ImageEmbeds2Div>
            {images.map(image => (
                <div>
                    <EmbedImg alt={image.alt} src={image.thumb ?? image.src} />
                </div>
            ))}
        </ImageEmbeds2Div>
    );
}

export const FeedViewPostCard = observer((props: FeedViewPostProps) => {
    const { post } = props;

    const [showRaw, setShowRaw] = useState(false);

    const text = (get(post, "post.record.text") as string) ?? "N/A";

    const author = post.post.author;

    return (
        <RootCard>
            {showRaw ? (
                <>
                    <Button size="1" onClick={() => setShowRaw(v => !v)}>
                        Close JSON
                    </Button>
                    <JsonViewer json={post} />
                </>
            ) : (
                renderPost()
            )}
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

    function renderRootReply() {
        const root = post.reply?.root;

        if (post.reply?.root.cid === post.reply?.parent.cid) return null;

        if (AppBskyFeedDefs.isPostView(root)) {
            if (AppBskyFeedPost.isRecord(root.record)) {
                return (
                    <>
                        <TransparentAvatarWithContentDiv>
                            <div>
                                <AvatarImg src={root.author.avatar} />
                            </div>
                            <div>
                                <Flex align="center" gap="0.5rem">
                                    <AuthorName>{root.author.displayName}</AuthorName>
                                    <span>{root.author.handle}</span>
                                </Flex>

                                <PostText>{root.record.text}</PostText>
                            </div>
                        </TransparentAvatarWithContentDiv>
                        <RepliedSeperator />
                    </>
                );
            }
        }

        return null;
    }

    function renderParentReply() {
        const parent = post.reply?.parent;

        if (AppBskyFeedDefs.isPostView(parent)) {
            if (AppBskyFeedPost.isRecord(parent.record)) {
                return (
                    <>
                        {renderRootReply()}
                        <TransparentAvatarWithContentDiv>
                            <Flex dir="column" gap="1rem">
                                <AvatarImg src={parent.author.avatar} />
                            </Flex>
                            <Flex dir="column" gap="1rem">
                                <Flex align="center" gap="1rem">
                                    <AuthorName>{parent.author.displayName}</AuthorName>
                                    <Link to={`/profile/${parent.author.did}`}>
                                        @{parent.author.handle}
                                    </Link>
                                </Flex>
                                <PostText>{parent.record.text}</PostText>
                            </Flex>
                        </TransparentAvatarWithContentDiv>
                        <RepliedSeperator />
                    </>
                );
            }
        }

        return null;
    }

    function renderImageEmbeds() {
        if (AppBskyEmbedImages.isView(post.post.embed)) {
            const images = post.post.embed.images;
            return (
                <EmbeddedImages
                    images={images.map(i => ({
                        src: i.fullsize,
                        thumb: i.thumb,
                        alt: i.alt,
                    }))}
                />
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
                            <ProfileView
                                size="small"
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

    function renderPost() {
        return (
            <PostDiv>
                {renderParentReply()}
                <AvatarWithContentDiv>
                    <Flex dir="column" align="center" gap="1rem">
                        <AvatarImg src={author.avatar} />
                        <Button size="1" onClick={() => setShowRaw(v => !v)}>
                            Show Raw
                        </Button>
                    </Flex>

                    <div>
                        {renderRepost()}

                        <Flex dir="column" gap="1rem">
                            <Flex align="center" gap="1rem">
                                <AuthorName>{author.displayName}</AuthorName>

                                <Link to={`/profile/${author.did}`}>@{author.handle}</Link>
                            </Flex>
                            <PostText>{text}</PostText>
                            {renderImageEmbeds()}
                            {renderExternalEmbeds()}
                            {renderQuotedPost()}
                            {renderFooter()}
                        </Flex>
                    </div>
                </AvatarWithContentDiv>
            </PostDiv>
        );
    }
});
