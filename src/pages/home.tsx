import { Link } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { AUTH_MODEL } from "../models/auth";

export const HomePage = observer(() => {
    return (
        <div>
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
