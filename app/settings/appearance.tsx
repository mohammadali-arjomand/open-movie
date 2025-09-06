import { useThemeColor } from "@/theme/useThemeColor"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { Dropdown } from "react-native-paper-dropdown"
export default function informationSettings() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background"),
            padding: 16,
        },
        header: {
            backgroundColor: useThemeColor("background2")
        }
    })

    const themeOptions = [
        { label: "System", value: "system"},
        { label: "Light", value: "light"},
        { label: "Dark", value: "dark"},
    ]

    const [theme, setTheme] = useState<string>("system")

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const value = await AsyncStorage.getItem("theme")
                if (value != null) setTheme(value)
            }
            catch (err) {
                console.error(err);
                
            }
        }
        loadTheme()
    }, [])

    function changeTheme() {
        AsyncStorage.setItem("theme", theme).then(() => alert("done"))
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{headerTitle:"Appearance", headerStyle: styles.header, headerTintColor: useThemeColor("text")}}/>
            <Dropdown
                label="Theme"
                mode="outlined"
                options={themeOptions}
                menuContentStyle={{backgroundColor: useThemeColor("background"), borderRadius: 8}}
                hideMenuHeader
                value={theme}
                onSelect={(t: any) => {setTheme(t); changeTheme()}}
            />
        </ScrollView>
    )
}