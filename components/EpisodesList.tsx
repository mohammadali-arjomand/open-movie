import { loadEpisodes } from "@/services/load-movie-data";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import QualitiesList from "./QualitiesList";

export default function EpisodesList({title, season}: {title: string, season: string}) {
    const [episodes, setEpisodes] = useState<{episode: string}[]>([]);
    useEffect(() => {
        loadEpisodes(title, season).then(episodes => setEpisodes(episodes || []));
    }, [])

    const [selectedItem, setSelectedItem] = useState<string>('');

    return (
        <View>
            {episodes.map(episode => (
                <View key={episode.episode}>
                    <TouchableOpacity onPress={() => setSelectedItem(episode.episode)} key={episode.episode} style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
                       <Text style={styles.listItem}>Episode {episode.episode}</Text>
                    </TouchableOpacity>
                    <Portal key={season + episode.episode}>
                        <Modal visible={selectedItem == episode.episode} onDismiss={() => setSelectedItem('')} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8}}>
                            <Text style={styles.modalTitle}>Season {season} - Episode {episode.episode}</Text>
                            <ScrollView>
                                <QualitiesList title={title} season={season} episode={episode.episode} />
                            </ScrollView>
                        </Modal>
                    </Portal>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        fontSize: 16,
        color: "#333",
        paddingVertical: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    }
})