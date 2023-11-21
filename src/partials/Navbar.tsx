import { Alignment, Navbar as BpNavbar, Classes } from "@blueprintjs/core";
import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { observer } from "mobx-react";
import { ThemeToggle } from "./ThemeToggle";

const navButtonClass = classNames(Classes.BUTTON, Classes.MINIMAL);

export const Navbar = observer(() => {
    return (
        <BpNavbar>
            <BpNavbar.Group align={Alignment.LEFT}>
                <BpNavbar.Heading>Bsky Debug</BpNavbar.Heading>
                <BpNavbar.Divider />
                <Link to="/" className={navButtonClass}>
                    Home
                </Link>
            </BpNavbar.Group>

            <BpNavbar.Group align={Alignment.RIGHT}>
                <ThemeToggle />
            </BpNavbar.Group>
        </BpNavbar>
    );
});
