import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react";
import { ToggleGroupItem, ToggleGroupRoot } from "../components/ToggleGroup";
import { THEME_STORE, ThemeSetting } from "../models/theme";

export const ThemeSelect = observer(() => {
    return (
        <ToggleGroupRoot
            type="single"
            value={THEME_STORE.setting.value}
            onValueChange={v => THEME_STORE.setSetting(v as ThemeSetting)}
        >
            <ToggleGroupItem value={ThemeSetting.SYSTEM}>
                <DesktopIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value={ThemeSetting.LIGHT}>
                <SunIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value={ThemeSetting.DARK}>
                <MoonIcon />
            </ToggleGroupItem>
        </ToggleGroupRoot>
    );
});
