import { useThemeColor } from "@/hooks/useThemeColor";
import { DownloadItem } from "@/types";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import EpisodesList from "./EpisodesList";
export default function SeasonAccordian({ addDownload, season, title, downloads }: { addDownload: (url: string, filename: string) => void, season: string, title: string,downloads: DownloadItem[] }) {
    const [expanded, setExpanded] = useState(false);

    const handlePress = () => setExpanded(!expanded);

    const styles = StyleSheet.create({
        accordion: {
            backgroundColor: useThemeColor("background"),
            tintColor: useThemeColor("primary"),
            // marginBottom: 8,
            // borderRadius: 8,
            color: useThemeColor("primary"),
        },
        title: { color: useThemeColor("primary"), fontWeight: "bold" },
        container: {
            backgroundColor: "black"
        }
    })    

    return (
        <List.Accordion
            style={styles.accordion}
            title={"Season " + season}
            expanded={expanded}
            titleStyle={styles.title}
            descriptionStyle={styles.container}
            theme={{colors: {primary: styles.accordion.color}}}
            onPress={handlePress}
            left={props => <List.Icon {...props} color={styles.title.color} icon="folder" />}
        >
            <EpisodesList downloads={downloads} addDownload={addDownload} season={season as string} title={title as string} />
        </List.Accordion>
    )
}