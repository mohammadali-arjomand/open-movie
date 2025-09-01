import { useState } from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import EpisodesList from "./EpisodesList";
export default function SeasonAccordian({ season, title }: { season: string, title: string }) {
    const [expanded, setExpanded] = useState(false);

    const handlePress = () => setExpanded(!expanded);

    // console.log(season);
    

    return (
        <List.Accordion
            style={styles.accordion}
            title={"Season " + season}
            expanded={expanded}
            titleStyle={{ color: "#007BFF", fontWeight: "bold" }}
            onPress={handlePress}
            left={props => <List.Icon {...props} color="#007BFF" icon="folder" />}
        >
            <EpisodesList season={season as string} title={title as string} />
        </List.Accordion>
    )
}

const styles = StyleSheet.create({
    accordion: {
        backgroundColor: "#fff",
        marginBottom: 8,
        borderRadius: 8,
        color: "#007BFF",
    }
})