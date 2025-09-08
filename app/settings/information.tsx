import { useThemeColor } from "@/hooks/useThemeColor"
import { openURL } from "expo-linking"
import { Stack } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"

export default function informationSettings() {
    const styles = StyleSheet.create({
        title: {
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 10,
            color: useThemeColor("text"),
        },
        body: {
            padding: 8,
            fontSize: 16,
            color: useThemeColor("text"),
        },
        link: {
            color: useThemeColor("primary"),
            padding: 8
        },
        container: {
            backgroundColor: useThemeColor("background")
        },
        header: {
            backgroundColor: useThemeColor("background2")
        }
    })

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{headerTitle:"Information", headerStyle: styles.header, headerTintColor: useThemeColor("text")}}/>
            <Text style={styles.title}>About App</Text>
            <Text style={styles.body}>Open Movie is an application for browsing movies and series when you're offline.</Text>
            <Text style={styles.title}>Contact Us</Text>
            <Text style={styles.body}>You can follow us in Telegram. In our channel you can send private messages directly to the developer</Text>
            <TouchableOpacity onPress={() => openURL("https://t.me/OpenMovieApp")}><Text style={styles.link}>- Click here to open Telegram!</Text></TouchableOpacity>
        </ScrollView>
    )
}