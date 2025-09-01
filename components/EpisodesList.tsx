import { loadEpisodes } from "@/services/load-movie-data";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EpisodesList({title, season}: {title: string, season: string}) {
    const [episodes, setEpisodes] = useState<{episode: string}[]>([]);
    loadEpisodes(title, season).then(episodes => setEpisodes(episodes || []));
    return (
        <View>
            {episodes.map(episode => (
                <TouchableOpacity key={episode.episode} style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
                    <Text style={styles.listItem}>Episode {episode.episode}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        fontSize: 16,
        color: "#333",
        paddingVertical: 8,
    }
})