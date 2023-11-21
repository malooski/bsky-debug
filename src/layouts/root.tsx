import { Outlet } from "@tanstack/react-router";
import { Navbar } from "../partials/Navbar";

export default function RootLayout() {
    return (
        <div>
            <div className="flex flex-row gap-2">
                <Navbar />
            </div>
            <hr />
            <Outlet />
        </div>
    );
}
