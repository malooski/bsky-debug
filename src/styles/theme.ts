export const GLOBAL_THEME = {
    spacingPx: 8,
    spacingRem: 0.5,
};
export type GlobalTheme = typeof GLOBAL_THEME;

export interface Theme extends GlobalTheme {
    colors: {
        background: string;
        primary: string;
        accent: string;
        text: string;
        link: string;
        linkHover: string;
        linkVisited: string;
    };
}

export const DARK_THEME: Theme = {
    ...GLOBAL_THEME,
    colors: {
        background: "#121212",
        primary: "#1db954",
        accent: "#1db954",
        text: "#ffffff",
        link: "#1db954",
        linkHover: "#1db954",
        linkVisited: "#1db954",
    },
};

export const LIGHT_THEME: Theme = {
    ...GLOBAL_THEME,
    colors: {
        background: "#ffffff",
        primary: "#1db954",
        accent: "#1db954",
        text: "#000000",
        link: "#1db954",
        linkHover: "#1db954",
        linkVisited: "#1db954",
    },
};
