import DropOption from "@/components/DropOption"
import { useThemeColor } from "@/hooks/useThemeColor"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export default function informationSettings() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background"),
            // padding: 16,
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

    const primaryColorOptions = [
        { label: "Blue (Default)", value: "#007BFF"},
        { label: "Green", value: "green"},
        { label: "Red", value: "red"},
        { label: "Tomato", value: "tomato"},
        { label: "Orange", value: "#EF7722"},
        { label: "Light-Green", value: "#A8BBA3"},
        { label: "Light-Blue", value: "#476EAE"},
    ]

    const [theme, setTheme] = useState<string>("system")
    const [primaryColor, setPrimaryColor] = useState<string>("#007BFF")

    useEffect(() => {
        AsyncStorage.getItem("theme").then((data) => {
            if (data !== null) {
                setTheme(data as unknown as string)
            }
        })
    }, [])

    useEffect(() => {
        AsyncStorage.getItem("primary").then((data) => {
            if (data !== null) {
                setPrimaryColor(data as unknown as string)
            }
        })
    }, [])

    function changeTheme(t: string) {
        setTheme(t)
        AsyncStorage.setItem("theme", t)
    }

    function changePrimaryColor(t: string) {
        setPrimaryColor(t)
        AsyncStorage.setItem("primary", t)
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{headerTitle:"Appearance", headerBackTitle: "Settings", headerStyle: styles.header, headerTintColor: useThemeColor("text")}}/>
            <DropOption
                label="Theme"
                options={themeOptions}
                value={theme}
                onSelect={t => changeTheme(t)}
            />
            <DropOption
                label="Primary Color"
                options={primaryColorOptions}
                value={primaryColor}
                onSelect={t => changePrimaryColor(t)}
            />

            <View style={{padding: 30}}>
                <Text style={{textAlign: 'justify', color: useThemeColor("primary")}}>This is a preview of your theme. The primary color will be applied to buttons, headers, and interactive elements</Text>
            </View>
        </ScrollView>
    )
}