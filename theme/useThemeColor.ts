import { useColorScheme } from "react-native";
import { ThemeKey, ThemeName, themes } from "./themes";

export function useThemeColor(key: ThemeKey) {
    const scheme = useColorScheme() as ThemeName | null
    const theme = themes[scheme || "light"]
    return theme[key]
}