import { useThemeColor } from "@/hooks/useThemeColor";
import { loadEpisodes } from "@/services/load-movie-data";
import { DownloadItem } from "@/types";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import QualitiesList from "./QualitiesList";

export default function EpisodesList({title, season, addDownload, downloads}: {title: string, season: string, addDownload: (url: string, filename: string) => void, downloads: DownloadItem[]}) {
    const [episodes, setEpisodes] = useState<{episode: string}[]>([]);
    useEffect(() => {
        loadEpisodes(title, season).then(episodes => setEpisodes(episodes || []));
    }, [])

    const styles = StyleSheet.create({
        listTouchableItem: { padding: 8, borderBottomWidth: 1, borderBottomColor: useThemeColor("border") },
        listItem: {
            fontSize: 16,
            color: useThemeColor("text"),
            borderBottomColor: useThemeColor("border"),
            paddingVertical: 8,
        },
        modal: {backgroundColor: useThemeColor("background2"), padding: 20, margin: 20, borderRadius: 8},
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            color: useThemeColor("text")
        },
    })

    const [selectedItem, setSelectedItem] = useState<string>('');

    return (
        <View>
            {episodes.map(episode => (
                <View key={`${title}-s${season}-e${episode.episode}`}>
                    <TouchableOpacity onPress={() => setSelectedItem(`${season}-${episode.episode}`)} key={`${title}-s${season}-e${episode.episode}-button`} style={styles.listTouchableItem}>
                       <Text style={styles.listItem}>Episode {episode.episode}</Text>
                    </TouchableOpacity>
                    <Portal key={`${title}-s${season}-e${episode.episode}-modal`}>
                        <Modal contentContainerStyle={styles.modal} visible={selectedItem == `${season}-${episode.episode}`} onDismiss={() => setSelectedItem('')}>
                            <Text style={styles.modalTitle}>Season {season} - Episode {episode.episode}</Text>
                            <ScrollView>
                                <QualitiesList downloads={downloads} addDownload={addDownload} nextEpisode={episodes[episode.episode as unknown as number] !== undefined} title={title} season={season} episode={episode.episode} setSelectedItem={setSelectedItem} />
                            </ScrollView>
                        </Modal>
                    </Portal>
                </View>
            ))}
        </View>
    )
}