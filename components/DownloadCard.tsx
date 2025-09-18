import { useThemeColor } from "@/hooks/useThemeColor";
import { shareFile } from "@/services/share-file";
import { Ionicons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";

export default function DownloadCard({title, id, progress, speed, fileUri, size, downloadedSize, pauseDownload, resumeDownload, removeFromList, status="downloading"}: {title: string, id: string, progress: number, speed: number, pauseDownload: (id: string) => void, resumeDownload: (id: string) => void, status?: string, removeFromList: (id: string, uri: string) => void, fileUri: string, size: number, downloadedSize: number}) {
    const colors = {
        success: useThemeColor("success"),
        warning: useThemeColor("warning"),
        danger: useThemeColor("danger"),
        primary: useThemeColor("primary")
    }

    var icon : "play-outline" | "pause-outline" | "checkbox-outline" | "close-outline" = "pause-outline"
    var color = colors.primary
    var text = "Downloading..."
    if (status == "paused") {
        icon = "play-outline"
        color = colors.warning
        text = "Paused"
    }
    else if (status == "completed") {
        icon = "checkbox-outline"
        color = colors.success
        text = "Completed"
    }
    else if (status == "canceled") {
        icon = "close-outline"
        color = colors.danger
        text = "Canceled"
    }

    const styles = StyleSheet.create({
        container: {
            padding: 8,
            margin: 8,
            marginBottom: 0,
            borderRadius: 8,
            borderColor: useThemeColor("border"),
            borderWidth: 1,
            paddingBottom: 10,
        },
        label: {
            fontSize: 18,
            marginBottom: 5,
            color: useThemeColor("text")
        },
        sublabel: {
            marginBottom: 5,
            color: useThemeColor("text2")
        }
    })

    const handlePress = () => {
        if (status === "downloading") {
            pauseDownload(id)
        }
        else if (status === "paused") {
            resumeDownload(id)
        }
        else if (status === "completed") {
            shareFile(fileUri)
        }
    }

    const handleLongPress = () => {
        if (status !== "downloading") {
             Alert.alert(
                'Confirm Remove',
                'Are you sure that you want to remove ' + title + '?',
                [
                    {
                        text: "Cancel",
                        style: 'cancel'
                    },
                    {
                        text: "Remove",
                        style: "destructive",
                        onPress: async () => {
                            removeFromList(id, fileUri)
                        }
                    }
                ]
            )
        }
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress}>
                <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
                    <Ionicons name={icon} color={color} size={18} />{" "}
                    {title.length > 0 ? title : "Untitled"}
                </Text>
                <Text style={styles.sublabel}>
                    {status === "downloading" ? <Text>{(downloadedSize / (1024 * 1024)).toFixed(2)} of {(size / (1024*1024)).toFixed(2)}MB - {(speed/1024).toFixed(1)}KB/s - </Text> : status === "paused" ? <Text>{(downloadedSize / (1024*1024)).toFixed(2)} of {(size / (1024*1024)).toFixed(2)} - </Text> : <Text>{(size/(1024*1024)).toFixed(2)}MB - </Text>}
                    {text}
                </Text>
                <ProgressBar progress={progress} color={color} style={{backgroundColor: useThemeColor("border"), borderRadius: 2}} />
            </TouchableOpacity>
        </View>
    )
}
