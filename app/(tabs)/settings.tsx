import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
export default function Settings() {
    const router = useRouter();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background")
        },
        listItem: {
            fontSize: 24,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: useThemeColor("border"),
            paddingHorizontal: 8,
            color: useThemeColor("text")

        },
    })

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.push("/settings/databases")}>
                <Text style={styles.listItem}>Databases</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => router.push("/settings/downloads")}>
                <Text style={styles.listItem}>Downloads</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => router.push("/settings/appearance")}>
                <Text style={styles.listItem}>Appearance</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => router.push("/settings/information")}>
                <Text style={styles.listItem}>Information</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}