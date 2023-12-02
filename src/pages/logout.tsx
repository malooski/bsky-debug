import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react";
import { AUTH_MODEL } from "../models/auth";
import { Navigate } from "react-router-dom";

export const LogoutPage = observer(() => {
    const logoutResp = useQuery({
        queryKey: ["logout"],
        queryFn: async () => {
            await AUTH_MODEL.logout();
            return true;
        },
    });

    if (logoutResp.isLoading) {
        return <h1>Logging out...</h1>;
    }

    return <Navigate to="/login" replace={true} />;
});
