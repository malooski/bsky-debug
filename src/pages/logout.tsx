import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react";
import { AUTH_MODEL } from "../models/auth";
import { useEffect } from "react";
export const LogoutPage = observer(() => {
    const navigate = useNavigate();

    useEffect(() => {
        AUTH_MODEL.logout();

        setTimeout(() => {
            navigate({
                to: "/",
            });
        }, 3000);
    }, []);

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
});
