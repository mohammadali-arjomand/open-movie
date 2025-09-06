import QualitiesList from "@/components/QualitiesList";
import SeasonAccordian from "@/components/SeasonAccordian";
import { loadSeasons } from "@/services/load-movie-data";
import { useThemeColor } from "@/theme/useThemeColor";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Season = {
    season: string,
}

export default function MovieDetailsScreen() {
    const {title} = useLocalSearchParams();

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
        }
    })

    const [seasons, setSeasons] = useState<Season[]>([]);

    useEffect(() => {
        loadSeasons(title as string).then(seasons => setSeasons(seasons || []));
    }, [])

    const loadMovieData = () => {
        if (seasons.length === 0) {
            return <Text>Nothing to show</Text>;
        }
        
        if (seasons.length == 1 && seasons[0].season == "0") {
            return (<ScrollView style={styles.seasonView}><QualitiesList title={title as string} season="0" episode="0" setSelectedItem={(a: string) => { return a }} /></ScrollView>);
        }
        return (<ScrollView style={styles.seasonView}>{seasons.map(season => <SeasonAccordian key={`${title}-s${season.season}`} title={title as string} season={season.season} />)}</ScrollView>)
    }    

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerTitle: title as string }} />
            {loadMovieData()}
        </View>
    )
}