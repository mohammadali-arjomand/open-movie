import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function Home() {
    const router = useRouter();
    return (
        <View>
            <Text style={styles.header}>Open Movie</Text>

            <TouchableOpacity onPress={() => router.push("/movie/Breaking Bad")}>
                <Text>Open Breaking Bad</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
    },
})