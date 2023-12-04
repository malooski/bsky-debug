import { Button, Callout } from "@radix-ui/themes";
import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import styled, { css } from "styled-components";

interface JsonViewerProps {
    json: unknown;
}

const MyCallout = styled(Callout.Root)`
    font-size: 0.75rem;
    overflow: auto;
`;

const MyPre = styled.pre`
    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;
`;

const CollapsibleCss = css`
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);
    font-weight: bold;
`;

const MyLine = styled.span<{
    collapsible?: boolean;
    hovered?: boolean;
}>`
    ${p => p.collapsible && CollapsibleCss}
`;

export const JsonViewer = observer((props: JsonViewerProps) => {
    const { json } = props;

    const [collapsed, setCollapsed] = useState(new Set<number>());
    const [hovered, setHovered] = useState<number | undefined>(undefined);

    function toggleLine(idx: number) {
        setCollapsed(c => {
            if (c.has(idx)) {
                c.delete(idx);
            } else {
                c.add(idx);
            }

            return new Set(c);
        });
    }

    if (json === undefined) {
        return <div>undefined</div>;
    }

    let jsonText: string;
    try {
        jsonText = JSON.stringify(json, null, 2) ?? "";
    } catch (e) {
        return <div>Invalid JSON</div>;
    }

    const jsonLines = jsonText.split("\n");

    const lines = useMemo(() => parseLines(), [jsonText, collapsed, hovered]);

    return (
        <MyCallout>
            <div>
                <Button size="1" onClick={() => setCollapsed(new Set())}>
                    Expand All
                </Button>
            </div>
            <MyPre>{lines}</MyPre>
        </MyCallout>
    );

    function parseLines() {
        const result: JSX.Element[] = [];

        let depth = 0;
        let collapsedDepth = -1;

        for (let i = 0; i < jsonLines.length; i++) {
            const line = jsonLines[i]!;
            const isCurrCollapsed = collapsedDepth > 0 && depth >= collapsedDepth;

            const isBlockStart = line.trim().endsWith("{") || line.trim().endsWith("[");
            const isBlockEnd = line.trim().startsWith("}") || line.trim().startsWith("]");

            if (isBlockStart) {
                depth++;

                if (!isCurrCollapsed) {
                    if (collapsed.has(i)) {
                        collapsedDepth = depth;

                        const endingChar = line.trim().endsWith("{") ? "}" : "]";

                        result.push(
                            <MyLine
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(undefined)}
                                key={i}
                                collapsible
                                onClick={() => toggleLine(i)}
                            >
                                {line} ... {endingChar},
                            </MyLine>,
                        );
                    } else {
                        result.push(
                            <MyLine
                                key={i}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(undefined)}
                                collapsible
                                onClick={() => toggleLine(i)}
                            >
                                {line}
                            </MyLine>,
                        );
                    }
                }
            } else if (isBlockEnd) {
                // Got to the end of a collapsed section
                if (collapsedDepth === depth) {
                    collapsedDepth = -1;
                } else if (!isCurrCollapsed) {
                    if (collapsedDepth < depth) {
                        result.push(
                            <MyLine
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(undefined)}
                                key={i}
                            >
                                {line}
                            </MyLine>,
                        );
                    }
                }

                depth--;
            } else {
                if (!isCurrCollapsed) {
                    result.push(
                        <MyLine
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(undefined)}
                            key={i}
                        >
                            {line}
                        </MyLine>,
                    );
                }
            }
        }

        return result;
    }
});
