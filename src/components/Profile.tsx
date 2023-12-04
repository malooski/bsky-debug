import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RawCard } from "./RawCard";

type ProfileSize = "small" | "medium" | "large";

interface ProfileProps {
    size?: ProfileSize;
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
    json?: unknown;
}

interface UserCardProps extends ProfileProps {}

const AvatarImg = styled.img`
    width: 100%;

    border-radius: 0.25rem;

    object-fit: cover;
    grid-area: avatar;
`;

const ProfileViewDivLarge = styled.div`
    display: grid;

    grid:
        "avatar . name" 1fr
        "avatar . handle" 1fr
        "avatar .  did" 1fr /
        5rem 1rem 1fr;

    height: 5rem;
`;

const ProfileViewDivMed = styled.div`
    display: grid;

    grid:
        "avatar . name" 1fr
        "avatar . handle" 1fr
        3rem 1rem 1fr;

    height: 3rem;
`;

const ProfileViewDivSmall = styled.div`
    display: grid;

    grid:
        "name handle" auto /
        auto 1fr;

    gap: 0.5rem;
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

export const ProfileView = observer((props: ProfileProps) => {
    const { did, handle, displayName, avatar, size = "large" } = props;

    const smallEls = (
        <>
            <NameSpan>{displayName}</NameSpan>
            <HandleSpan>@{handle}</HandleSpan>
        </>
    );

    const medEls = (
        <>
            {smallEls}
            <DidLink to={`/profile/${encodeURIComponent(did)}`}>{did}</DidLink>
        </>
    );

    const largeEls = (
        <>
            <AvatarImg src={avatar ?? "#"} />
            {medEls}
        </>
    );

    const els = size === "small" ? smallEls : size === "medium" ? medEls : largeEls;

    const Container =
        size === "small"
            ? ProfileViewDivSmall
            : size === "medium"
            ? ProfileViewDivMed
            : ProfileViewDivLarge;

    return <Container>{els}</Container>;
});

export const UserCard = observer((props: UserCardProps) => {
    return <RawCard json={props.json}>{() => <ProfileView {...props} />}</RawCard>;
});
