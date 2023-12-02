import { Navbar } from "../partials/Navbar";
import { QueryDevTools } from "../components/QueryDevTools";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    align-self: center;

    padding: 1rem;
    gap: 1rem;
`;

export default function RootLayout() {
    return (
        <>
            <RootDiv>
                <Navbar />

                <Outlet />
            </RootDiv>
            <QueryDevTools />
        </>
    );
}
