import { openURL } from "expo-linking";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
export default function Home() {
    const router = useRouter();
    return (
        <ScrollView>
            <Text style={styles.header}>Welcome to Open Movie!</Text>

            <Text style={styles.body}>Download full database from our Telegram channel and import it!</Text>
            <TouchableOpacity onPress={() => openURL("https://t.me/OpenMovieApp")}>
                <Text style={styles.link}>- Telegram Channel?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/settings/databases")}>
                <Text style={styles.link}>- How to import?</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
    },
    body: {
        padding: 8,
        fontSize: 16   
    },
    link: {
        padding: 8,
        fontSize: 16,
        paddingVertical: 12,
        color: '#007BFF'
    }
})