import { Outlet } from "@tanstack/react-router";
import { Navbar } from "../partials/Navbar";
import { RouterDevTools } from "../components/RouterDevTools";
import { QueryDevTools } from "../components/QueryDevTools";
import styled from "styled-components";

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    align-self: center;

    padding: 1rem;
`;

export default function RootLayout() {
    return (
        <RootDiv>
            <Navbar />

            <Outlet />

            <QueryDevTools />
            <RouterDevTools />
        </RootDiv>
    );
}
