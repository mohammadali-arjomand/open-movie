import { useThemeColor } from "@/theme/useThemeColor";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Bookmarks() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background")
        }
    })

    return (
        <ScrollView style={styles.container}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: useThemeColor("text"), textAlign: 'center', marginVertical: 20}}>This feature will be released in upcoming versions!</Text>
            </View>
        </ScrollView>
    )
}