import { Button, ButtonGroup, IconName } from "@blueprintjs/core";
import { THEME_MODEL, ThemeSetting } from "../models/theme";
import { observer } from "mobx-react";

export const ThemeToggle = observer(() => {
    return (
        <ButtonGroup>
            <ThemeButton setting={ThemeSetting.SYSTEM} icon="desktop" name="System" />
            <ThemeButton setting={ThemeSetting.LIGHT} icon="flash" name="Light" />
            <ThemeButton setting={ThemeSetting.DARK} icon="moon" name="Dark" />
        </ButtonGroup>
    );
});

const ThemeButton = observer((props: { setting: ThemeSetting; icon: IconName; name: string }) => {
    const { setting, icon, name } = props;

    return (
        <Button
            minimal
            active={THEME_MODEL.themeSetting.value === setting}
            onClick={() => THEME_MODEL.setThemeSetting(setting)}
            icon={icon}
            title={`${name} Theme`}
        />
    );
});
