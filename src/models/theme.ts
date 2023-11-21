import { autorun, makeAutoObservable } from "mobx";
import { LocalStorageModel } from "./local_storage";
import { Classes } from "@blueprintjs/core";

export enum ThemeSetting {
    SYSTEM = "system",
    LIGHT = "light",
    DARK = "dark",
}

export enum Theme {
    LIGHT = "light",
    DARK = "dark",
}

export class ThemeModel {
    systemTheme: Theme;

    themeSetting = new LocalStorageModel<ThemeSetting>({
        key: "debugapp_themesetting",
        defaultValue: ThemeSetting.SYSTEM,
    });

    constructor() {
        makeAutoObservable(this);

        const darkModeMq = window.matchMedia("(prefers-color-scheme: dark)");
        this.systemTheme = darkModeMq.matches ? Theme.DARK : Theme.LIGHT;

        darkModeMq.addEventListener("change", e => {
            this.systemTheme = e.matches ? Theme.DARK : Theme.LIGHT;
        });

        autorun(() => {
            if (this.theme == Theme.LIGHT) {
                document.documentElement.classList.remove("dark", Classes.DARK);
                document.body.classList.remove("dark", Classes.DARK);
            } else {
                document.documentElement.classList.add("dark", Classes.DARK);
                document.body.classList.add("dark", Classes.DARK);
            }
        });
    }

    get theme(): Theme {
        if (this.themeSetting.value === ThemeSetting.SYSTEM) {
            return this.systemTheme;
        }

        return this.themeSetting.value === ThemeSetting.LIGHT ? Theme.LIGHT : Theme.DARK;
    }

    setThemeSetting(setting: ThemeSetting) {
        this.themeSetting.set(setting);
    }
}

export const THEME_MODEL = new ThemeModel();
