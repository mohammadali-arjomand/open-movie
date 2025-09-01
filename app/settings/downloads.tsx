import { Stack } from "expo-router"
import { Text, View } from "react-native"

export default function downloadsSettings() {
    return (
        <View>
            <Stack.Screen options={{headerTitle:"Downloads"}}/>
            <Text>Downloads</Text>
        </View>
    )
}