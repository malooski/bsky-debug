import { RootRoute, Route, Router, redirect } from "@tanstack/react-router";
import { LoginPage } from "./pages/login";
import RootLayout from "./layouts/root";
import { HomePage } from "./pages/home";
import { AUTH_MODEL } from "./models/auth";
import { MyProfilePage, ProfileByDidPage, ProfilePage } from "./pages/profile";
import { LogoutPage } from "./pages/logout";
// Create a root route
const rootRoute = new RootRoute({
    component: RootLayout,
});

async function requireLogin() {
    if (!(await AUTH_MODEL.checkLogin())) {
        throw redirect({
            to: "/login",
        });
    }
}

// Create an index route
const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    id: "index",
    component: HomePage,
    beforeLoad: async () => {
        await requireLogin();
    },
});

// Create an index route
const loginRoute = new Route({
    id: "login",
    getParentRoute: () => rootRoute,
    path: "login",
    component: LoginPage,
});

const logoutRoute = new Route({
    id: "logout",
    getParentRoute: () => rootRoute,
    path: "logout",
    component: LogoutPage,
});

const profileRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "profile",
});

const myProfileRoute = new Route({
    getParentRoute: () => profileRoute,
    path: "/",
    id: "myProfile",
    component: MyProfilePage,
    beforeLoad: async () => {
        await requireLogin();
    },
});

// Create an index route
const profileByDidRoute = new Route({
    getParentRoute: () => profileRoute,
    path: "$did",
    id: "profileByDid",
    component: ProfileByDidPage,

    beforeLoad: async () => {
        await requireLogin();
    },
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    profileRoute.addChildren([myProfileRoute, profileByDidRoute]),

    logoutRoute,
]);

// Create the router using your route tree
export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
