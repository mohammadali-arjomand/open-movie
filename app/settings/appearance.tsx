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
        AsyncStorage.getItem("theme").then((data) => {
            setTheme(data as unknown as string)
        })
    }, [])

    function changeTheme(t: string) {
        setTheme(t)
        AsyncStorage.setItem("theme", t)
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
                onSelect={(t: any) => {changeTheme(t)}}
            />
        </ScrollView>
    )
}