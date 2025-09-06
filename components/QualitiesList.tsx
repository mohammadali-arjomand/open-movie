import { loadQualities } from "@/services/load-movie-data";
import { useThemeColor } from "@/theme/useThemeColor";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QualitiesList({title, season, episode, setSelectedItem}: {title: string, season: string, episode: string, setSelectedItem: any}) {
  const router = useRouter()

  const [qualities, setQualities] = useState<{quality: string, language: string, url: string}[]>([]);
  useEffect(() => {
    loadQualities(title, season, episode).then(qualities => setQualities(qualities || []));
  }, [])
  
  const openUrl = (url: string) => {
    setSelectedItem('')
    Linking.canOpenURL(`vlc://${url}`)
      .then((supported) => {
        if (supported) {
          Linking.openURL(`vlc://${url}`)
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
        }
    })

  return (
    <View>
        {qualities.length > 0 ? qualities.map(quality => (
            <TouchableOpacity key={quality.url} onPress={() => openUrl(quality.url)}>
               <Text style={styles.listItem}>{quality.quality} ({quality.language == 'sub' ? 'Subtitle' : (quality.language == 'dub' ? 'Dubbed' : 'Trailer')})</Text>
            </TouchableOpacity>
        )) : <Text>Loading...</Text>}
    </View>
  );
}