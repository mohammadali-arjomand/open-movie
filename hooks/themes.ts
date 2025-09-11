export const themes = {
    light: {
        name: "light",
        background: "#f9f9f9",
        background2: "#ffffff",
        text: "#000000",
        text2: "#888888",
        text3: "#FFFFFF",
        primary: "#007BFF",
        border: "#eeeeee",
        shadow: "#000000",
        warning: "#ffb300",
        success: "#1a8f00",
        danger: "#ff0000",
    },
    dark: {
        name: "dark",
        background: "#111111",
        background2: "#222222",
        text: "#FFFFFF",
        text2: "#444444",
        text3: "#000000",
        primary: "#007BFF",
        border: "#333333",
        shadow: "#eeeeee",
        warning: "#ffb300",
        success: "#1a8f00",
        danger: "#ff0000",
    },
}

export type ThemeName = keyof typeof themes;
export type ThemeKey = keyof typeof themes.light