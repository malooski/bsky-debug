import { Link, Outlet } from "@tanstack/react-router";
import { AUTH_MODEL } from "../models/auth";

export default function RootLayout() {
    return (
        <div>
            <div className="flex flex-row gap-2">
                <Link className="" to="/">
                    Home
                </Link>
                {AUTH_MODEL.loggedIn ? (
                    <Link to="/logout">Logout</Link>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
            <hr />
            <Outlet />
        </div>
    );
}
