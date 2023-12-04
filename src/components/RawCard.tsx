import { Button, Card } from "@radix-ui/themes";
import { observer } from "mobx-react";
import { useState } from "react";
import styled from "styled-components";
import { JsonViewer } from "./JsonViewer";

export const CardHeaderDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
`;

const RootCard = styled(Card)`
    display: flex;
    flex-direction: column;
`;

interface RawCardProps {
    json: unknown;
    children: () => React.ReactNode;
}

export const RawCard = observer((props: RawCardProps) => {
    const { json, children: Children } = props;

    const [showRaw, setShowRaw] = useState(false);

    return (
        <RootCard>
            <CardHeaderDiv>
                <Button size="1" onClick={() => setShowRaw(v => !v)}>
                    Show Raw
                </Button>
            </CardHeaderDiv>

            {showRaw ? <JsonViewer json={json} /> : <Children />}
        </RootCard>
    );
});
