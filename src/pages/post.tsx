import { useParams } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { AUTH_MODEL } from "../models/auth";
import JsonViewer from "../components/JsonViewer";

export const PostPage = observer(() => {
    const params = useParams({ from: "/post" });

    const { isLoading, error, data } = useQuery(["postData", params.cid], () => {
        console.log("params.did", params.cid);

        return AUTH_MODEL.bskyAgent?.getPosts();
    });

    return (
        <div>
            <div>Loading: {isLoading}</div>
            <div>Error: {JSON.stringify(error)}</div>
            <JsonViewer json={data} />
        </div>
    );
});
