import DownloadCard from "@/components/DownloadCard"
import { useDownload } from "@/contexts/DownloadContext"
import { useThemeColor } from "@/hooks/useThemeColor"
import { deleteAsync } from "expo-file-system/legacy"
import { Stack } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export default function downloadsSettings() {
    const {downloads, pauseDownload, resumeDownload, setDownloads, addDownload} = useDownload()
    const styles = StyleSheet.create({
        message: {
            textAlign: 'center',
            marginTop: 30,
            marginHorizontal: 'auto',
            maxWidth: "80%",
            color: useThemeColor("text")
        },
    })

    const removeFromList = (id: string, uri: string) => {
        setDownloads(prev => prev.filter(d => d.id !== id))
        deleteAsync(uri)
    }

    return (
        <View style={{height: "100%", backgroundColor: useThemeColor("background")}}>
            <Stack.Screen options={{headerTitle:"Downloads"}}/>
            <ScrollView>
                {downloads.toReversed().map(dl => (
                    <DownloadCard key={dl.id} size={dl.size} downloadedSize={dl.downloadedSize} fileUri={dl.fileUri} title={dl.fileUri.split("/").at(-1) || ""} removeFromList={removeFromList} progress={dl.progress} id={dl.id} status={dl.status} speed={dl.speed} pauseDownload={pauseDownload} resumeDownload={resumeDownload} />
                ))}
                {downloads.length === 0 ? <Text style={styles.message}>No downloads!</Text> : null} 
            </ScrollView>
            {/* <Button onPress={() => addDownload("https://s34.picofile.com/file/8486872134/poster_placeholder.png", "poster.png")}>
                <Text>Add Download</Text>
            </Button> */}
        </View>
    )
}