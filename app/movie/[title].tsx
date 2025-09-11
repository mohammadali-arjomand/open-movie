import QualitiesList from "@/components/QualitiesList";
import SeasonAccordian from "@/components/SeasonAccordian";
import { useBookmarks } from "@/contexts/BookmarkContext";
import usePoster from "@/hooks/usePoster";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadSeasons } from "@/services/load-movie-data";
import { Ionicons } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Season = {
    season: string,
}

export default function MovieDetailsScreen() {
    const {title} = useLocalSearchParams();
    const {isBookmarked, toggleBookmark} = useBookmarks()
    const {imageUrl, score, genres, id} = usePoster(title as string)

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: useThemeColor("background"),
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
            borderRadius: 8,
            // padding: 8,
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
            borderRadius: 8,
            marginTop: 60,
            flexShrink: 1,
            maxHeight: 220
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
        }
    })

    const [seasons, setSeasons] = useState<Season[]>([]);

    useEffect(() => {
        loadSeasons(title as string).then(seasons => setSeasons(seasons || []));
    }, [])

    const loadMovieData = () => {
        if (seasons.length === 0) {
            return <Text style={styles.message}>We are not able to find '{title}'. Make sure that you are using complete database.</Text>;
        }
        
        if (seasons.length == 1 && seasons[0].season == "0") {
            return (<ScrollView style={styles.seasonView}><QualitiesList title={title as string} season="0" episode="0" setSelectedItem={(a: string) => { return a }} /></ScrollView>);
        }
        return (<ScrollView style={styles.seasonView}>{seasons.map(season => <SeasonAccordian key={`${title}-s${season.season}`} title={title as string} season={season.season} />)}</ScrollView>)
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
                    <Text style={{fontWeight: 'bold', fontSize: 30, marginHorizontal: 5, textAlign: 'left', color: useThemeColor("text")}} ellipsizeMode="tail" numberOfLines={3}>{title}</Text>
                    <Text style={{marginHorizontal: 5, textAlign: 'left', marginTop: 5}}>
                        {genres.split(", ").map((genre, index) => (
                            <View key={index}>
                                <Text style={styles.genresItem}>{genre}</Text>
                            </View>
                        ))}
                    </Text>
                </View>
            </View>
            {loadMovieData()}
        </View>
    )
}