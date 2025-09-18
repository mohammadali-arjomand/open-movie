import { DownloadProvider } from "@/contexts/DownloadContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadQualities } from "@/services/load-movie-data";
import { shareFile } from "@/services/share-file";
import { DownloadItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setStringAsync } from 'expo-clipboard';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QualitiesList({title, season, episode, setSelectedItem, nextEpisode, addDownload, downloads}: {title: string, season: string, episode: string, setSelectedItem: any, nextEpisode: boolean, addDownload: (url: string, filename: string) => void, downloads: DownloadItem[]}) {
    const [copiedItem, setCopiedItem] = useState<string>("")
    const [qualities, setQualities] = useState<{quality: string, language: string, url: string}[]>([]);

    const router = useRouter()

    useEffect(() => {
        loadQualities(title, season, episode).then(qualities => setQualities(qualities || []));
    }, [])
    
    const openUrl = (quality: any) => {
        setSelectedItem('')
        AsyncStorage.setItem("remove-help", "true")
        Linking.canOpenURL(`vlc://${quality.url}`)
        .then((supported) => {
            if (supported) {
            Linking.openURL(`vlc://${quality.url}`)
            }
            else {
            Alert.alert(
                "VLC is Required", 
                "VLC Player is not installed. Please install VLC to play this video.",
                [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Install",
                    style: "default",
                    onPress: () => {
                    Linking.openURL("https://play.google.com/store/apps/details?id=org.videolan.vlc")
                    }
                }
                ]
            )
            }
        })
        .catch((err) => {
            console.error("> " + err)
        })
    }

        const styles = StyleSheet.create({
            listItem: {
                fontSize: 16,
                borderBottomWidth: 1,
                borderBottomColor: useThemeColor("border"),
                color: useThemeColor("text"),
                paddingVertical: 16,
                paddingHorizontal: 6,
                flex: 1,
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center'
            }
        })

        const copyUrl = (url: string) => setStringAsync(url).then(() => setCopiedItem(url))

    function downloadUrl(quality: {url: string, quality: string, language: string}): void {
        const filename = `${title} S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")} ${quality.quality} ${quality.language == 'sub' ? 'Subtitle' : (quality.language == 'dub' ? 'Dubbed' : 'Trailer')}.${quality.url.split(".").at(-1)}`
        addDownload(quality.url, filename.replaceAll(" ", "."))

        setSelectedItem("")
        router.push("/(tabs)/downloads")
    }

    function checkDownloaded(url: string) {
        for (var downloadItem of downloads) {
            if (downloadItem.url == url) {
                return true
            }            
        }
        return false
    }

    function shareFileOrOpenDownloads(url: string): void {
        for (var downloadItem of downloads) {
            if (downloadItem.url == url) {
                if (downloadItem.progress < 1) {
                    router.push("/(tabs)/downloads")
                    setSelectedItem('')
                }
                else {
                    shareFile(downloadItem.fileUri)
                }
                break
            }            
        }
    }

    return (
        <DownloadProvider>
            <View>
                {qualities.length > 0 ? qualities.map(quality => (
                    <TouchableOpacity style={styles.listItem} key={quality.url} onPress={() => openUrl(quality)}>
                        <Text style={{maxWidth: "80%"}}>
                            {quality.quality} ({quality.language == 'sub' ? 'Subtitle' : (quality.language == 'dub' ? 'Dubbed' : 'Trailer')})
                        </Text>
                        <View>
                            <View style={{flex:1, flexDirection:'row'}}>
                                <TouchableOpacity onPress={() => copyUrl(quality.url)} style={{borderColor: styles.listItem.borderBottomColor, borderWidth:0.5, borderRadius: 8, padding: 5}}>
                                    <Ionicons name={copiedItem === quality.url ? "copy" : "copy-outline"} size={20}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => checkDownloaded(quality.url) ? shareFileOrOpenDownloads(quality.url) : downloadUrl(quality)} style={{borderColor: styles.listItem.borderBottomColor, borderWidth:0.5, borderRadius: 8, padding: 5, marginLeft: 2}}>
                                    <Ionicons name={checkDownloaded(quality.url) ? "checkbox-outline" : "download-outline"} size={20}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )) : <Text>Loading...</Text>}
            </View>
        </DownloadProvider>
    );
}