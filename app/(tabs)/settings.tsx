import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
export default function Home() {
    const router = useRouter();
    return (
        <ScrollView>
            <TouchableOpacity onPress={() => router.push("/settings/databases")}>
                <Text style={styles.listItem}>Databases</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => router.push("/settings/downloads")}>
                <Text style={styles.listItem}>Downloads</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => router.push("/settings/information")}>
                <Text style={styles.listItem}>Information</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    listItem: {
        fontSize: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingHorizontal: 8,
    },
})