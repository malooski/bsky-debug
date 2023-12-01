import { PersonIcon } from "@radix-ui/react-icons";
import { Button, TextField } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react";
import { UserCard } from "../components/UserCard";
import { AUTH_MODEL } from "../models/auth";

export const HomePage = observer(() => {
    const userQuery = useQuery({
        queryKey: ["user", AUTH_MODEL.myDid],
        queryFn: async () => {
            return AUTH_MODEL.bskyAgent.getProfile({
                actor: AUTH_MODEL.myDid!,
            });
        },
        enabled: !!AUTH_MODEL.myDid,
    });

    return (
        <div className="m-2 flex flex-col">
            {userQuery.data && (
                <UserCard
                    did={userQuery.data.data.did}
                    avatar={userQuery.data.data.avatar}
                    handle={userQuery.data.data.handle}
                    displayName={userQuery.data.data.displayName}
                    json={userQuery.data.data}
                />
            )}

            <div className="flex items-center gap-1">
                <TextField.Root>
                    <TextField.Slot>
                        <PersonIcon />
                    </TextField.Slot>
                    <TextField.Input placeholder="Enter a profile DID" />
                </TextField.Root>
                <Button>Go</Button>
            </div>
        </div>
    );
});
