import { useParams } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { AUTH_MODEL } from "../models/auth";
import JsonViewer from "../components/JsonViewer";

export const ProfilePage = observer(() => {
    const params = useParams({ from: "/profileById" });

    const profileQuery = useQuery(["repoData", params.did], () => {
        console.log("params.did", params.did);
        return AUTH_MODEL.bskyAgent?.getProfile({
            actor: params.did,
        });
    });

    const feedQuery = useQuery(["feedData", params.did], () =>
        AUTH_MODEL.bskyAgent?.getAuthorFeed({ actor: params.did }),
    );

    return (
        <div className="flex-col">
            <div>
                <h3>Profile</h3>
                <JsonViewer json={profileQuery.data} />
            </div>
            <div>
                <h3>Feed</h3>
                <JsonViewer json={feedQuery.data} />
            </div>
        </div>
    );
});
