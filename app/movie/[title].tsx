import QualitiesList from "@/components/QualitiesList";
import SeasonAccordian from "@/components/SeasonAccordian";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { useContinueWatching } from "@/contexts/ContinueWatchingContext";
import { useDownload } from "@/contexts/DownloadContext";
import usePoster from "@/hooks/usePoster";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadNumberOfEpisodes, loadSeasons } from "@/services/load-movie-data";
import { Ionicons } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal, Portal } from "react-native-paper";

type Season = {
    season: string,
}

type EpisodeCount = Record<number, number>

export default function MovieDetailsScreen() {
    const {title} = useLocalSearchParams()
    const {isBookmarked, toggleBookmark} = useBookmarks()

    const [forcedToLoadData, setForcedToLoadData] = useState<boolean>(false)

    const {imageUrl, score, genres, id} = usePoster(title as string, forcedToLoadData)

    const colors = {
        text3: useThemeColor("text3")
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: useThemeColor("background"),
        },  
        continueWatching: {
            backgroundColor: useThemeColor("primary"),
            marginHorizontal: 16,
            padding: 12,
            borderRadius: 18,
        },
        watchedCompletelyView: {
            backgroundColor: useThemeColor("success"),
            marginHorizontal: 16,
            padding: 12,
            borderRadius: 18,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
        },
        seasonView: {
            margin: 16,
            backgroundColor: useThemeColor("background2"),
            borderRadius: 18,
            borderColor: useThemeColor("border"),
            borderWidth: 0.5,
            shadowColor: useThemeColor("shadow"),
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            maxHeight: "61%",   
        },
        headerView: {
            flex: 1,
            flexDirection: 'row',
            margin: 16,
            padding: 8,
            borderColor: useThemeColor("border"),
            borderWidth: 1,
            borderRadius: 18,
            marginTop: 60,
            flexShrink: 1,
            minHeight: 220,
            maxHeight: 220,
        },
        headerNestedView: {
            flex:1,
            justifyContent: 'flex-end',
            paddingVertical: 20,
            maxHeight: 200,
        },
        message: {
            textAlign: 'center',
            marginTop: 30,
            marginHorizontal: 'auto',
            maxWidth: "80%",
            color: useThemeColor("text")
        },
        genresItem: {
            backgroundColor: useThemeColor("primary"),
            color: useThemeColor("text3"),
            borderRadius: 7,
            padding: 3,
            margin: 2,
        },
        modal: {
            backgroundColor: useThemeColor("background2"),
            padding: 20,
            margin: 20,
            borderRadius: 8
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            color: useThemeColor("text")
        },
        loadDataBtn: {
            marginHorizontal: 5,
            padding: 3,
            marginBottom: -10,
            backgroundColor: useThemeColor("background2"),
            borderRadius: 7,
        },
        loadDataText: {
            textAlign: "center",
            color: useThemeColor("text")
        }
    })

    const [seasons, setSeasons] = useState<Season[]>([]);
    const [episodeCount, setEpisodeCount] = useState<EpisodeCount>({})
    const [selectedItem, setSelectedItem] = useState<string>("")

    useEffect(() => {
        loadSeasons(title as string).then(seasons => setSeasons(seasons || []));
    }, [])

    useEffect(() => {
        if (!seasons || seasons.length === 0) return

        const loadAllEpisodes = async () => {
            const results = await Promise.all(
                seasons.map(season => (
                    loadNumberOfEpisodes(title as string, Number(season.season))
                        .then(num => [Number(season.season), num ?? 0] as const)
                ))
            )

            const counts = Object.fromEntries(results)
            setEpisodeCount(counts)
        }
        loadAllEpisodes()
    }, [seasons])

    const {addDownload, downloads} = useDownload()
    const {markAsWatched, markAsUnwatched, isWatched, getFirstUnwatched, isWatchedCompletely} = useContinueWatching()

    const loadMovieData = () => {
        if (seasons.length === 0) {
            return <Text style={styles.message}>We are not able to find '{title}'. Make sure that you are using complete database.</Text>;
        }
        
        if (seasons.length == 1 && seasons[0].season == "0") {
            return (<ScrollView style={styles.seasonView}><QualitiesList markAsWatched={markAsWatched} downloads={downloads} addDownload={addDownload} title={title as string} season="0" episode="0" setSelectedItem={(a: string) => { return a }} /></ScrollView>);
        }
        return (<ScrollView style={styles.seasonView}>{seasons.map(season => <SeasonAccordian setWatchedCompletely={setWatchedCompletely} markAsUnwatched={markAsUnwatched} markAsWatched={markAsWatched} isWatched={isWatched} downloads={downloads} addDownload={addDownload} key={`${title}-s${season.season}`} title={title as string} season={season.season} />)}</ScrollView>)
    }

    if ("0" in episodeCount) {
        delete episodeCount["0"]
    }
    const continueWatching = getFirstUnwatched(title as string, episodeCount)
    const [watchedCompletely, setWatchedCompletely] = useState<boolean>(false)

    useEffect(() => {
        isWatchedCompletely(title as string).then(value => setWatchedCompletely(value))
    }, [continueWatching])

    function changeToUnwatched() {
        if (seasons.length === 1 && seasons[0].season == "0") {
            Alert.alert("Mark as unwatched", "Do you want to mark this movie as unwatched?", [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    style: "default",
                    onPress: () => {
                        setWatchedCompletely(false)
                        markAsUnwatched(title as string, 0, 0)
                    }
                }
            ])
        }
    }

    function forceLoadData() {
        setForcedToLoadData(true)   
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{headerShown: false}} />
            <View style={styles.headerView}>
                <Image source={{ uri: imageUrl}} style={{width: 130, height: 200, resizeMode: "cover", borderRadius: 8, maxHeight: 200}} />
                <View style={styles.headerNestedView}>
                    <View style={{flex:1,flexDirection:'row', maxHeight:60, marginLeft: 8, marginBottom: 8}}>
                        <TouchableOpacity onPress={() => { toggleBookmark(title as string) }} style={{width: 75}}>
                            <Ionicons name={isBookmarked(title as string) ? "bookmark" : "bookmark-outline"} size={23} color={useThemeColor("text")} style={{margin:'auto'}} />
                            <Text style={{textAlign: 'center', color: useThemeColor("text")}}>Bookmark</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {id.length > 0 ? openURL("https://imdb.com/title/" + id) : null}} style={{width: 75}}>
                            <Ionicons name="star" size={23} color={useThemeColor("text")} style={{margin:'auto'}} />
                            <Text style={{textAlign: 'center', color: useThemeColor("text")}}>{score} / 10</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontWeight: 'bold', fontSize: 30, marginHorizontal: 5, textAlign: 'left', color: useThemeColor("text")}} ellipsizeMode="tail" numberOfLines={2}>{title}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight: 30, marginHorizontal: 5}}>
                        {genres.split(", ").map((genre, index) => {
                            if (genre.length > 0) return (
                                <View key={index} style={{maxHeight: 30}}>
                                    <Text style={styles.genresItem}>{genre}</Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                    {genres.length === 0 ? (
                        forcedToLoadData ? (
                            <Text style={styles.loadDataText}>LOADING...</Text>
                        ) : (
                            <TouchableOpacity style={styles.loadDataBtn} onPress={forceLoadData}>
                                <Text style={styles.loadDataText}>LOAD DATA</Text>
                            </TouchableOpacity>
                        )
                    ) : null}
                </View>
            </View>
            {Object.keys(episodeCount).length === 0 || watchedCompletely || (continueWatching && continueWatching?.season <= 1 && continueWatching?.episode <= 1) ? null : (
                <View>
                    <TouchableOpacity style={styles.continueWatching} onPress={() => setSelectedItem("continue")}>
                        <Text style={{color: colors.text3, textAlign: 'center'}}>Continue watching from Season {continueWatching?.season} Episode {continueWatching?.episode}</Text>
                    </TouchableOpacity>
                    <Portal key={`${title}-continue-watching-modal`}>
                        <Modal contentContainerStyle={styles.modal} visible={selectedItem === "continue"} onDismiss={() => setSelectedItem("")}>
                            <Text style={styles.modalTitle}>Season {continueWatching?.season} - Episode {continueWatching?.episode}</Text>
                            <ScrollView>
                                <QualitiesList downloads={downloads} addDownload={addDownload} markAsWatched={markAsWatched} title={title as string} season={continueWatching?.season.toString() ?? "1"} episode={continueWatching?.episode.toString() ?? "1"} setSelectedItem={setSelectedItem} />
                            </ScrollView>
                        </Modal>
                    </Portal>
                </View>
            )}
            {!watchedCompletely ? null :
                <TouchableOpacity style={styles.watchedCompletelyView} onLongPress={changeToUnwatched}>
                    <Text style={{color: colors.text3, textAlign: 'center'}}>
                        You've watched this
                        {seasons.length === 1 && seasons[0].season == "0" ? <Text> movie </Text> : <Text> series </Text>}
                        completely
                    </Text>
                </TouchableOpacity>
            }
            {loadMovieData()}
        </View>
    )
}