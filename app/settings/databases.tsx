import { Stack } from "expo-router"
import { Text, View } from "react-native"
export default function databasesSettings() {
    return (
        <View>
            <Stack.Screen options={{headerTitle:"Databases"}}/>
            <Text>Databases</Text>
        </View>
    )
}