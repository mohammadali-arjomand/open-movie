import DownloadCard from "@/components/DownloadCard"
import { useDownload } from "@/contexts/DownloadContext"
import { useThemeColor } from "@/hooks/useThemeColor"
import { Stack } from "expo-router"
import { ScrollView, View } from "react-native"
import { Button } from "react-native-paper"

export default function downloadsSettings() {
    const {downloads, addDownload, pauseDownload, resumeDownload, cancelDownload} = useDownload()
    return (
        <View style={{height: "100%", backgroundColor: useThemeColor("background")}}>
            <Stack.Screen options={{headerTitle:"Downloads"}}/>
            <ScrollView>
                {downloads.toReversed().map(dl => (
                    <DownloadCard key={dl.id} title="Test" progress={dl.progress} status={dl.status} speed={dl.speed} />
                ))}   
            </ScrollView>
            <Button onPress={() => addDownload("https://s34.picofile.com/file/8486872134/poster_placeholder.png", "poster.png")}>Add download</Button>
        </View>
    )
}