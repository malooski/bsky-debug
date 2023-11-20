import { Button, InputGroup } from "@blueprintjs/core";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { AUTH_MODEL } from "../models/auth";
export const LoginPage = observer(() => {
    const navigate = useNavigate();

    async function onLogin() {
        await AUTH_MODEL.checkLogin();

        return navigate({
            to: "/",
        });
    }

    return (
        <div>
            <InputGroup type="text" placeholder="Username" value={AUTH_MODEL.username.value} />
            <InputGroup type="password" placeholder="Password" value={AUTH_MODEL.password.value} />
            <Button onClick={onLogin} />
        </div>
    );
});
