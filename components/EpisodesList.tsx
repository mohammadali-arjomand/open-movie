import { useThemeColor } from "@/hooks/useThemeColor";
import { loadEpisodes } from "@/services/load-movie-data";
import { DownloadItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import QualitiesList from "./QualitiesList";

type EpisodeListProps = {
    title: string,
    season: string,
    addDownload: (url: string, filename: string) => void,
    downloads: DownloadItem[],
    markAsWatched: (title: string, season: number, episode: number) => void,
    markAsUnwatched: (title: string, season: number, episode: number) => void,
    isWatched: (title: string, season: number, episode: number) => boolean,
    setWatchedCompletely: (newValue: boolean) => void
}

export default function EpisodesList({title, season, addDownload, downloads, markAsWatched, markAsUnwatched, isWatched, setWatchedCompletely}: EpisodeListProps) {
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

    function changeToUnwatched(episode: number): void {
        Alert.alert("Mark as unwatched", "Do you want to mark this episode as unwatched?", [
            {
                text: "No",
                style: "cancel"
            },
            {
                text: "Yes",
                style: "default",
                onPress: () => {
                    setWatchedCompletely(false)
                    markAsUnwatched(title as string, Number(season), episode)
                }
            }
        ])
    }

    return (
        <View>
            {episodes.map(episode => (
                <View key={`${title}-s${season}-e${episode.episode}`}>
                    <TouchableOpacity onLongPress={() => changeToUnwatched(Number(episode.episode))} onPress={() => setSelectedItem(`${season}-${episode.episode}`)} key={`${title}-s${season}-e${episode.episode}-button`} style={styles.listTouchableItem}>
                        <Text style={styles.listItem}>
                            {isWatched(title, Number(season), Number(episode.episode)) ? <Ionicons name="checkmark-circle-outline" size={16} /> : null}{" "}
                            {Number(episode.episode) > 0 ? null : "Special"} Episode {Number(episode.episode) > 0 ? episode.episode : null}
                        </Text>
                    </TouchableOpacity>
                    <Portal key={`${title}-s${season}-e${episode.episode}-modal`}>
                        <Modal contentContainerStyle={styles.modal} visible={selectedItem == `${season}-${episode.episode}`} onDismiss={() => setSelectedItem('')}>
                            <Text style={styles.modalTitle}>Season {season} - Episode {episode.episode}</Text>
                            <ScrollView>
                                <QualitiesList downloads={downloads} addDownload={addDownload} markAsWatched={markAsWatched} title={title} season={season} episode={episode.episode} setSelectedItem={setSelectedItem} />
                            </ScrollView>
                        </Modal>
                    </Portal>
                </View>
            ))}
        </View>
    )
}