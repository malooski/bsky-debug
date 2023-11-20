import { RootRoute, Route, Router, redirect } from "@tanstack/react-router";
import { LoginPage } from "./pages/login";
import RootLayout from "./layouts/root";
import { HomePage } from "./pages/home";
import { AUTH_MODEL } from "./models/auth";
import { ProfilePage } from "./pages/profile";
import { LogoutPage } from "./pages/logout";
import { PostPage } from "./pages/post";
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
    path: "/login",
    component: LoginPage,
});

const logoutRoute = new Route({
    id: "logout",
    getParentRoute: () => rootRoute,
    path: "/logout",
    component: LogoutPage,
});

// Create an index route
const profileByDidRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/profile/$did",
    id: "profileById",
    parseParams: params => {
        return {
            did: params.did,
        };
    },
    component: ProfilePage,
    beforeLoad: async () => {
        await requireLogin();
    },
});

const postRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/post/$cid",
    id: "post",
    parseParams: params => {
        return {
            cid: params.cid,
        };
    },
    component: PostPage,
    beforeLoad: async () => {
        await requireLogin();
    },
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    profileByDidRoute,
    logoutRoute,
    postRoute,
]);

// Create the router using your route tree
export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
