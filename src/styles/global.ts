import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

    body {
        margin: 0;
        padding: 0;
        background-color: ${props => props.theme.colors.background};
        color: ${props => props.theme.colors.text};
    }
    
    a {
        color: ${props => props.theme.colors.link};
        text-decoration: none;

        &:hover {
            color: ${props => props.theme.colors.linkHover};
            text-decoration: underline;
        }

        &:visited {
            color: ${props => props.theme.colors.linkVisited};
        }
    }


    h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0%;
    }


`;
