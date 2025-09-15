import DownloadCard from "@/components/DownloadCard"
import { useDownload } from "@/contexts/DownloadContext"
import { useThemeColor } from "@/hooks/useThemeColor"
import { Stack } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export default function downloadsSettings() {
    const {downloads, pauseDownload, resumeDownload, setDownloads} = useDownload()
    const styles = StyleSheet.create({
        message: {
            textAlign: 'center',
            marginTop: 30,
            marginHorizontal: 'auto',
            maxWidth: "80%",
            color: useThemeColor("text")
        },
    })

    const removeFromList = (id: string) => {
        setDownloads(prev => prev.filter(d => d.id !== id))
    }

    return (
        <View style={{height: "100%", backgroundColor: useThemeColor("background")}}>
            <Stack.Screen options={{headerTitle:"Downloads"}}/>
            <ScrollView>
                {downloads.toReversed().map(dl => (
                    <DownloadCard key={dl.id} title={dl.fileUri.split("/").at(-1) || ""} removeFromList={removeFromList} progress={dl.progress} id={dl.id} status={dl.status} speed={dl.speed} pauseDownload={pauseDownload} resumeDownload={resumeDownload} />
                ))}
                {downloads.length === 0 ? <Text style={styles.message}>No downloads!</Text> : null} 
            </ScrollView>
        </View>
    )
}