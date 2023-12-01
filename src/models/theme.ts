import { autorun, makeAutoObservable } from "mobx";
import { LocalStorageModel } from "./local_storage";
import { DARK_THEME, LIGHT_THEME } from "../styles/theme";

export enum ThemeKey {
    DARK = "dark",
    LIGHT = "light",
}

export enum ThemeSetting {
    SYSTEM = "system",
    DARK = "dark",
    LIGHT = "light",
}

export class ThemeModel {
    setting = new LocalStorageModel<ThemeSetting>({
        key: "debugapp_theme",
        defaultValue: ThemeSetting.SYSTEM,
    });

    systemTheme: ThemeKey;

    constructor() {
        makeAutoObservable(this);

        const themeMq = window.matchMedia("(prefers-color-scheme: dark)");
        this.systemTheme = themeMq.matches ? ThemeKey.DARK : ThemeKey.LIGHT;

        themeMq.addEventListener("change", e => {
            this.systemTheme = e.matches ? ThemeKey.DARK : ThemeKey.LIGHT;
        });

        autorun(() => {
            const html = document.documentElement;
            if (this.themeKey === ThemeKey.LIGHT) {
                html.classList.add(ThemeKey.LIGHT);
                html.classList.remove(ThemeKey.DARK);
            } else {
                html.classList.add(ThemeKey.DARK);
                html.classList.remove(ThemeKey.LIGHT);
            }
        });
    }

    get themeKey(): ThemeKey {
        if (this.setting.value === ThemeSetting.SYSTEM) {
            return this.systemTheme;
        }

        return this.setting.value === ThemeSetting.DARK ? ThemeKey.DARK : ThemeKey.LIGHT;
    }

    get theme() {
        return this.themeKey === ThemeKey.DARK ? DARK_THEME : LIGHT_THEME;
    }

    setSetting(setting: ThemeSetting) {
        if (!Object.values(ThemeSetting).includes(setting)) {
            console.error("Invalid theme setting:", setting);
            return;
        }

        this.setting.set(setting);
    }
}

export const THEME_STORE = new ThemeModel();
