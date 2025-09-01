import { Stack } from "expo-router"
import { Text, View } from "react-native"

export default function informationSettings() {
    return (
        <View>
            <Stack.Screen options={{headerTitle:"Information"}}/>
            <Text>Information</Text>
        </View>
    )
}