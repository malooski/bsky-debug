import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react";
import styled from "styled-components";
import { GITHUB_REPO_URL } from "../env";

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    align-self: center;

    padding: 1rem;
    gap: 1rem;
`;

const LinksDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    align-self: center;

    padding: 1rem;
    gap: 1rem;
`;

export const HomePage = observer(() => {
    return (
        <RootDiv>
            <h1>Welcome!</h1>

            <h3>This is my Bluesky Debug client!</h3>

            <p>
                This app is a useful way to view posts and their underlying data to get an insight
                into how to develop future applications.
            </p>

            <p>
                Feel free to login and check it out. No data is sent to me. Session data is stored
                in cookies & local storage.
            </p>

            <p>
                If you encounter any issues, feel free to make an issue on GitHub or reach out to me
                directly on BlueSky or in my Discord Server
            </p>

            <LinksDiv>
                <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
                    <GitHubLogoIcon /> View on GitHub
                </a>

                <a href="https://maloo.ski" target="_blank" rel="noreferrer">
                    Find Malooski on the web!
                </a>
            </LinksDiv>
        </RootDiv>
    );
});
