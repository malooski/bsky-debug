import { Link } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { ThemeSelect } from "./ThemeSelect";
import styled from "styled-components";

const RootDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
`;

const LeftSideDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 1rem;
`;

const NavLink = styled(Link)`
    padding: 0.5rem 1rem;

    border: 1px solid ${p => p.theme.colors.accent};
    border-radius: 0.25rem;

    &[data-status="active"] {
        background-color: ${p => p.theme.colors.primary};
        color: ${p => p.theme.colors.text};
    }
`;

export const Navbar = observer(() => {
    return (
        <RootDiv>
            <LeftSideDiv>
                <NavLink to="/">Home</NavLink>

                <NavLink to="/profile">Profile</NavLink>
            </LeftSideDiv>

            <ThemeSelect />
        </RootDiv>
    );
});
