import { LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button, TextField } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { observer } from "mobx-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { AUTH_MODEL } from "../models/auth";

const RootDiv = styled.div`
    align-self: center;

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const LoginPage = observer(() => {
    const [search] = useSearchParams();
    const from = search.get("from") || "/dashboard";
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginMut = useMutation({
        mutationFn: async () => {
            await AUTH_MODEL.login(username, password);

            console.log("navigating to", from);
            return navigate(from);
        },
    });

    const canSubmit = username.length > 0 && password.length > 0 && !loginMut.isPending;

    return (
        <RootDiv>
            <TextField.Root>
                <TextField.Slot>
                    <PersonIcon />
                </TextField.Slot>
                <TextField.Input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                />
            </TextField.Root>
            <TextField.Root>
                <TextField.Slot>
                    <LockClosedIcon />
                </TextField.Slot>
                <TextField.Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />
            </TextField.Root>
            <Button disabled={!canSubmit} onClick={() => loginMut.mutate()}>
                Login
            </Button>
        </RootDiv>
    );
});
