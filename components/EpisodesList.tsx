import { loadEpisodes } from "@/services/load-movie-data";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import QualitiesList from "./QualitiesList";

export default function EpisodesList({title, season}: {title: string, season: string}) {
    const [episodes, setEpisodes] = useState<{episode: string}[]>([]);
    loadEpisodes(title, season).then(episodes => setEpisodes(episodes || []));

    const [visible, setVisible] = useState(false);

    return (
        <View>
            {episodes.map(episode => (
                <View>
                    <TouchableOpacity onPress={() => setVisible(true)} key={episode.episode} style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
                       <Text style={styles.listItem}>Episode {episode.episode}</Text>
                    </TouchableOpacity>
                    <Portal>
                        <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8}}>
                            <QualitiesList/>
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
    }
})