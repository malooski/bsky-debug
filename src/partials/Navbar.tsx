import { observer } from "mobx-react";
import { ThemeSelect } from "./ThemeSelect";
import styled from "styled-components";
import { AUTH_MODEL } from "../models/auth";
import { NavLink } from "react-router-dom";

const RootDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
`;

const SideDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
`;

const MyNavLink = styled(NavLink)`
    padding: 0.25rem 0.5rem;

    border: 1px solid ${p => p.theme.colors.accent};
    border-radius: 0.25rem;

    &.active {
        background-color: ${p => p.theme.colors.primary};
        color: ${p => p.theme.colors.text};
    }
`;

export const Navbar = observer(() => {
    const authCtx = AUTH_MODEL.loggedInContext;

    return (
        <RootDiv>
            <SideDiv>
                <MyNavLink to="/">Home</MyNavLink>

                {authCtx && (
                    <>
                        <MyNavLink to="/dashboard">Dashboard</MyNavLink>
                        <MyNavLink to="/profile">Profile</MyNavLink>
                    </>
                )}
            </SideDiv>
            <SideDiv>
                {authCtx ? (
                    <>
                        <span>{authCtx.username}</span>
                        <MyNavLink to="/logout">Logout</MyNavLink>
                    </>
                ) : (
                    <>
                        <MyNavLink to="/login">Login</MyNavLink>
                    </>
                )}

                <ThemeSelect />
            </SideDiv>
        </RootDiv>
    );
});
