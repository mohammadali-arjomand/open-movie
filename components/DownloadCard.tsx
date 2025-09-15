import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";

export default function DownloadCard({title, progress, speed, status="downloading"}: {title: string, progress: number, speed: number, status?: string}) {
    var icon : "play-outline" | "pause-outline" | "checkbox-outline" | "close-outline" = "pause-outline"
    var color = useThemeColor("primary")
    var text = "Downloading..."
    if (status == "paused") {
        icon = "play-outline"
        color = useThemeColor("warning")
        text = "Paused"
    }
    else if (status == "completed") {
        icon = "checkbox-outline"
        color = useThemeColor("success")
        text = "Completed"
    }
    else if (status == "canceled") {
        icon = "close-outline"
        color = useThemeColor("danger")
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
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Text style={styles.label}>
                    <Ionicons name={icon} color={color} size={18} />{" "}
                    {title}
                </Text>
                <Text style={styles.sublabel}>
                    {status === "downloading" ? <Text>{progress*100}% - {speed} Mbps - </Text> : null}
                    {text}
                </Text>
                <ProgressBar progress={progress} color={color} style={{backgroundColor: useThemeColor("border"), borderRadius: 2}} />
            </TouchableOpacity>
        </View>
    )
}