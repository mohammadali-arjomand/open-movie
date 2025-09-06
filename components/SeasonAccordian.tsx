import { useThemeColor } from "@/theme/useThemeColor";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import EpisodesList from "./EpisodesList";
export default function SeasonAccordian({ season, title }: { season: string, title: string }) {
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
            <EpisodesList season={season as string} title={title as string} />
        </List.Accordion>
    )
}