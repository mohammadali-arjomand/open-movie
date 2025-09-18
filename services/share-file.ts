import * as Sharing from 'expo-sharing'
import { Alert } from "react-native"

export const shareFile = async (uri: string) => {
    try {
    const canShare = await Sharing.isAvailableAsync()
    if (!canShare) {
        Alert.alert("Error Sharing", "Sharing is not available on this device")
        return
    }
    await Sharing.shareAsync(uri)
    }
    catch (err) {
        console.error("Share Error", err);
    }
}