import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { AUTH_MODEL } from "../models/auth";
import { Button, TextField } from "@radix-ui/themes";
import { LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
export const LoginPage = observer(() => {
    const navigate = useNavigate();

    async function onLogin() {
        await AUTH_MODEL.checkLogin();

        return navigate({
            to: "/",
        });
    }

    return (
        <div className="max-w-xl">
            <TextField.Root>
                <TextField.Slot>
                    <PersonIcon />
                </TextField.Slot>
                <TextField.Input placeholder="Username" value={AUTH_MODEL.username.value} />
            </TextField.Root>
            <TextField.Root>
                <TextField.Slot>
                    <LockClosedIcon />
                </TextField.Slot>
                <TextField.Input placeholder="Password" value={AUTH_MODEL.password.value} />
            </TextField.Root>
            <Button onClick={onLogin}>Login</Button>
        </div>
    );
});
