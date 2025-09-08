import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useColorScheme } from "react-native";
import { ThemeKey, ThemeName, themes } from "./themes";

export function useThemeColor(key: ThemeKey) {
    const [color, setColor] = useState<string>("#00000000")

    async function loadColor() {
        if (key == "primary") {
            const savedPrimary = await AsyncStorage.getItem("primary")                  
            if (savedPrimary == null) {
                AsyncStorage.setItem("primary", themes.light.primary)
                return themes.light.primary
            }
            else {                
                return savedPrimary
            }

        }
        const scheme = useColorScheme() as ThemeName | null
        const theme = themes[scheme || "light"]

        const data = await AsyncStorage.getItem("theme")
        if (data == "light") {
            return themes.light[key]
        }
        else if (data == "dark") {
            return themes.dark[key]
        }
        else {
            return theme[key]
        }
    }
    loadColor().then(data => setColor(data))

    return color    
}