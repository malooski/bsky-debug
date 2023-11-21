import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Button, Card } from "@blueprintjs/core";
import { get } from "lodash";
import { observer } from "mobx-react";
import { useState } from "react";

import hljs from "highlight.js";
import "highlight.js/styles/dark.css";

interface FeedViewPostProps {
    post: FeedViewPost;
}

export const FeedViewPostCard = observer((props: FeedViewPostProps) => {
    const { post } = props;

    const [showRaw, setShowRaw] = useState(false);

    const text = get(post, "post.record.text") ?? "N/A";

    const highlightedCode = hljs.highlightAuto(JSON.stringify(post, null, 2));

    return (
        <Card className="relative">
            <Button
                className="absolute top-1 right-1"
                icon="search-template"
                minimal
                onClick={() => setShowRaw(v => !v)}
            />
            {showRaw ? (
                <pre
                    className="text-xs p-4 font-mono overflow-auto bg-black/25 rounded-md"
                    dangerouslySetInnerHTML={{ __html: highlightedCode.value }}
                ></pre>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <img src={post.post.author.avatar} className="w-10 h-10 rounded-md" />
                        <div className="flex flex-col text-xs">
                            <div>{post.post.author.displayName}</div>
                            <div>{post.post.author.did}</div>
                            <div>@{post.post.author.handle}</div>
                        </div>
                    </div>
                    <div>{text}</div>
                </div>
            )}
        </Card>
    );
});
