import { Callout } from "@radix-ui/themes";
import { observer } from "mobx-react";
import styled from "styled-components";

interface JsonViewerProps {
    json: unknown;
}

const MyCallout = styled(Callout.Root)`
    font-size: 0.75rem;
    overflow: hidden;
`;

const MyPre = styled.pre`
    overflow: auto;
    margin: 0;
    padding: 0;
`;

export const JsonViewer = observer((props: JsonViewerProps) => {
    const { json } = props;

    if (json === undefined) {
        return <div>undefined</div>;
    }

    let jsonText: string;
    try {
        jsonText = JSON.stringify(json, null, 2) ?? "";
    } catch (e) {
        return <div>Invalid JSON</div>;
    }

    return (
        <MyCallout>
            <MyPre>{jsonText}</MyPre>
        </MyCallout>
    );
});
