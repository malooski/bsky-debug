import { Card, IconButton } from "@radix-ui/themes";
import { observer } from "mobx-react";
import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Link1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { JsonViewer } from "./JsonViewer";

interface UserCardProps {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
    json?: unknown;

    minimal?: boolean;
}

const AvatarImg = styled.img`
    height: 4rem;
    width: 4rem;
    border-radius: 0.25rem;

    grid-area: avatar;
`;

const RootCard = styled(Card)`
    position: relative;
`;

const LinkDiv = styled.div`
    position: absolute;
    right: 1rem;
    top: 1rem;
`;

const ShowRawDiv = styled.div`
    position: absolute;
    right: 1rem;
    bottom: 1rem;
`;

const RootDiv = styled.div`
    display: grid;

    grid:
        "avatar name" auto
        "avatar handle" auto
        "avatar did" auto /
        auto 1fr;

    font-size: 0.8rem;
    gap: 0.25rem;
`;

const NameSpan = styled.span`
    font-weight: bold;
    grid-area: name;
`;

const HandleSpan = styled.span`
    color: #666;
    grid-area: handle;
`;

const DidLink = styled(Link)`
    grid-area: did;
`;

export const UserCard = observer((props: UserCardProps) => {
    const navigate = useNavigate();
    const [showRaw, setShowRaw] = useState(false);

    const { did, handle, displayName, avatar } = props;

    const innerPost = (
        <RootDiv>
            <AvatarImg src={avatar ?? "#"} />
            <NameSpan>{displayName}</NameSpan>
            <DidLink to={`/profile/${encodeURIComponent(did)}`}>{did}</DidLink>
            <HandleSpan>@{handle}</HandleSpan>
        </RootDiv>
    );

    if (props.minimal) {
        return innerPost;
    }

    return (
        <RootCard>
            <LinkDiv>
                <IconButton
                    size="1"
                    variant="ghost"
                    title="Navigate to profile."
                    onClick={() => navigate(`/profile/${encodeURIComponent(did)}`)}
                >
                    <Link1Icon />
                </IconButton>
            </LinkDiv>

            <ShowRawDiv>
                <IconButton size="1" variant="ghost" onClick={() => setShowRaw(v => !v)}>
                    <MagnifyingGlassIcon />
                </IconButton>
            </ShowRawDiv>
            {showRaw ? <JsonViewer json={props.json} /> : innerPost}
        </RootCard>
    );
});
