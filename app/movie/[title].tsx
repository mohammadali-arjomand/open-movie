import QualitiesList from "@/components/QualitiesList";
import SeasonAccordian from "@/components/SeasonAccordian";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadSeasons } from "@/services/load-movie-data";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Season = {
    season: string,
}

export default function MovieDetailsScreen() {
    const {title} = useLocalSearchParams();
    const {isBookmarked, toggleBookmark} = useBookmarks()

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
            maxHeight: "100%",   
        },
        buttonsView: {
            margin: 16,
            padding: 8,
            borderColor: useThemeColor("border"),
            borderWidth: 1,
            borderRadius: 8,
        },
        message: {
            textAlign: 'center',
            marginTop: 30,
            marginHorizontal: 'auto',
            maxWidth: "80%",

        },
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
            <Stack.Screen options={{ headerTitle: title as string }} />
            <View style={styles.buttonsView}>
                <TouchableOpacity onPress={() => { toggleBookmark(title as string) }}>
                    <Ionicons name={isBookmarked(title as string) ? "bookmark" : "bookmark-outline"} size={23} color={useThemeColor("text")} />
                </TouchableOpacity>
            </View>
            {loadMovieData()}
        </View>
    )
}