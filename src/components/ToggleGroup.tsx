import * as ToggleGroup from "@radix-ui/react-toggle-group";
import styled from "styled-components";

export const ToggleGroupRoot = styled(ToggleGroup.Root)`
    display: flex;
    flex-direction: row;
`;

export const ToggleGroupItem = styled(ToggleGroup.Item)`
    background-color: unset;
    border: 1px solid ${p => p.theme.colors.accent};
    border-radius: 0;
    padding: 0.5rem;
    aspect-ratio: 1;

    color: ${p => p.theme.colors.text};

    &[data-state="on"] {
        background-color: ${p => p.theme.colors.primary};
    }

    &:hover {
        background-color: ${p => p.theme.colors.primary};
    }

    &:first-child {
        border-top-left-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
    }

    &:last-child {
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
    }
`;
