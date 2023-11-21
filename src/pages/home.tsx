import { Link } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { AUTH_MODEL } from "../models/auth";
import { Button, ButtonGroup, InputGroup } from "@blueprintjs/core";

export const HomePage = observer(() => {
    return (
        <div className="flex flex-col m-2">
            <div className="flex gap-1 items-center">
                <label>Profile</label>
                <InputGroup placeholder="did:plc:abcd" />
                <Button>Go</Button>
            </div>

            <div className="flex gap-1 items-center">
                <label>Feed</label>
                <InputGroup />
                <Button>Go</Button>
            </div>

            <Link
                to="/profile/$did"
                params={{
                    did: AUTH_MODEL.bskyAgent?.session?.did ?? "",
                }}
            >
                Me
            </Link>
        </div>
    );
});
