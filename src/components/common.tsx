import styled, { CSSProperties } from "styled-components";

interface FlexProps {
    dir?: CSSProperties["flexDirection"];
    align?: CSSProperties["alignItems"];
    justify?: CSSProperties["justifyContent"];
    gap?: string | number;
}

export const Flex = styled.div<FlexProps>`
    display: flex;

    ${p => p.dir && `flex-direction: ${p.dir};`}
    ${p => p.justify && `justify-content: ${p.justify};`}
    ${p => p.align && `align-items: ${p.align};`}
    ${p => p.gap && `gap: ${p.gap};`}
`;
