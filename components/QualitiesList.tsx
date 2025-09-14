import { useThemeColor } from "@/hooks/useThemeColor";
import { loadQualities } from "@/services/load-movie-data";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setStringAsync } from 'expo-clipboard';
import { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QualitiesList({title, season, episode, setSelectedItem, nextEpisode}: {title: string, season: string, episode: string, setSelectedItem: any, nextEpisode: boolean}) {
    const [copiedItem, setCopiedItem] = useState<string>("")
    const [qualities, setQualities] = useState<{quality: string, language: string, url: string}[]>([]);
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

    return (
        <View>
            {qualities.length > 0 ? qualities.map(quality => (
                <TouchableOpacity style={styles.listItem} key={quality.url} onPress={() => openUrl(quality)}>
                    <Text>
                        {quality.quality} ({quality.language == 'sub' ? 'Subtitle' : (quality.language == 'dub' ? 'Dubbed' : 'Trailer')})
                    </Text>
                    <TouchableOpacity onPress={() => copyUrl(quality.url)} style={{borderColor: styles.listItem.borderBottomColor, borderWidth:0.5, borderRadius: 8, padding: 5}}>
                        <Ionicons name={copiedItem === quality.url ? "copy" : "copy-outline"} size={20}/>
                    </TouchableOpacity>
                </TouchableOpacity>
            )) : <Text>Loading...</Text>}
        </View>
    );
}