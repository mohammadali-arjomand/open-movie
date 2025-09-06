import { useThemeColor } from "@/theme/useThemeColor";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function Bookmarks() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background")
        }
    })

    return (
        <ScrollView style={styles.container}>
            <Text style={{color: useThemeColor("text")}}>Welcome to BOOKMARKS</Text>
        </ScrollView>
    )
}