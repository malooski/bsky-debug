import { createHashRouter as createRouter, redirect } from "react-router-dom";
import RootLayout from "./layouts/root";
import { AUTH_MODEL } from "./models/auth";
import { DashboardPage } from "./pages/dashboard";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/login";
import { LogoutPage } from "./pages/logout";
import { ProfilePage } from "./pages/profile";

export const router = createRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/logout",
                element: <LogoutPage />,
            },

            {
                path: "/dashboard",
                element: <DashboardPage />,
                loader: requireAuthLoader,
            },

            {
                path: "/profile",
                element: <ProfilePage />,
                loader: requireAuthLoader,
            },
            {
                path: "/profile/:did",
                element: <ProfilePage />,
                loader: requireAuthLoader,
            },
        ],
    },
]);

async function requireAuthLoader() {
    if (!AUTH_MODEL.loggedInContext) {
        console.log("no auth context, redirecting to login");
        try {
            console.log("checking auth");
            await AUTH_MODEL.check();
            return null;
        } catch (e) {
            console.error(e);
        }

        const params = new URLSearchParams();
        params.set("from", location.pathname);
        return redirect(`/login?${params.toString()}`);
    }

    console.log("auth context exists, continuing");
    return null;
}
