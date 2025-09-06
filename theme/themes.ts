export const themes = {
    light: {
        background: "#f9f9f9",
        background2: "#ffffff",
        text: "#000000",
        text2: "#888888",
        // primary: "tomato",
        primary: "#007BFF",
        border: "#eeeeee",
        shadow: "#000000",
        warning: "#ffb300",
        success: "#1a8f00",
        danger: "#ff0000",
    },
    dark: {
        background: "#111111",
        background2: "#222222",
        text: "#FFFFFF",
        text2: "#444444",
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