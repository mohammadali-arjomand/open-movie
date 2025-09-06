import { useThemeColor } from "@/theme/useThemeColor";
import { openURL } from "expo-linking";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Home() {
    const router = useRouter();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background")
        },
        header: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
            color: useThemeColor("text")
        },
        body: {
            padding: 8,
            fontSize: 16,
            color: useThemeColor("text")
        },
        link: {
            padding: 8,
            fontSize: 16,
            paddingVertical: 12,
            color: useThemeColor("primary")
        }
    })

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Welcome to Open Movie!</Text>

            <Text style={styles.body}>Download full database from our Telegram channel and import it!</Text>
            <TouchableOpacity onPress={() => openURL("https://t.me/OpenMovieApp")}>
                <Text style={styles.link}>- Telegram Channel?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/settings/databases")}>
                <Text style={styles.link}>- How to import?</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Quick Access</Text>

            <TouchableOpacity onPress={() => router.push("/movie/Breaking Bad")}>
                <Text style={styles.link}>Breaking Bad</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/movie/Twin Peaks")}>
                <Text style={styles.link}>Twin Peaks</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}