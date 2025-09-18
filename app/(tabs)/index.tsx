import MovieCard from "@/components/MovieCard";
import { useContinueWatching } from "@/contexts/ContinueWatchingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadRandomTitles } from "@/services/load-movie-data";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openURL } from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// type FullRow = {
//     quality: string,
//     language: string,
//     url: string,
//     title: string,
//     season: string,
//     episode: string,
// }

type Movie = {
    title: string,
}

export default function Home() {
    const router = useRouter();
    const [randomTitles, setRandomTitles] = useState<Movie[]>([])
    const [showHelp, setShowHelp] = useState<boolean>(true)

    useEffect(() => {
        loadRandomTitles().then(titles => {
            setRandomTitles(titles as Movie[])
        })
        AsyncStorage.getItem("remove-help").then(value => setShowHelp(value === null ? true : !(value as unknown as boolean)))
    }, [])

    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background"),
            height: "100%",
        },
        header: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
            color: useThemeColor("text")
        },
        body: {
            padding: 8,
            fontSize: 16,
            color: useThemeColor("text")
        },
        link: {
            padding: 8,
            fontSize: 16,
            paddingVertical: 12,
            color: useThemeColor("primary")
        }
    })

    const {titles} = useContinueWatching()
    const [continueWatchingTitles, setContinueWatchingTitles] = useState<Movie[]>([])
    useEffect(() => {
        const newTitles: Movie[] = []
        for (var title in titles) {
            if (!continueWatchingTitles.includes({title}) && !newTitles.includes({title})) {
                newTitles.push({title})
            }
        }
        setContinueWatchingTitles(newTitles)
    }, [titles])

    return (
        <View style={styles.container}>
            {
                showHelp ?
                <ScrollView>
                    <Text style={styles.header}>Welcome to Open Movie!</Text>

                    <Text style={styles.body}>Download full database from our Telegram channel and import it!</Text>
                    <TouchableOpacity onPress={() => openURL("https://t.me/OpenMovieApp")}>
                        <Text style={styles.link}>- Telegram Channel?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/settings/databases")}>
                        <Text style={styles.link}>- How to import?</Text>
                    </TouchableOpacity>
                </ScrollView> :
                <ScrollView>
                    <Text style={{...styles.header, textAlign:'left',marginLeft:10}}>
                        <Ionicons name="heart" size={25} color={styles.link.color} />{" "}
                        For you
                    </Text>
                    <FlatList
                        data={randomTitles}
                        keyExtractor={(item) => item.title}
                        horizontal={true}
                        renderItem={({item}) => (
                            <MovieCard title={item.title} horizontal={true} />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                    {continueWatchingTitles.length === 0 ? null : (
                        <View>
                            <Text style={{...styles.header, textAlign:'left',marginLeft:10}}>
                                <Ionicons name="eye" size={25} color={styles.link.color} />{" "}
                                Continue Watching
                            </Text>
                            <FlatList
                                data={continueWatchingTitles.toReversed()}
                                keyExtractor={(item) => item.title}
                                horizontal={true}
                                renderItem={({item}) => (
                                    <MovieCard title={item.title} horizontal={true} />
                                )}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}
                </ScrollView>
            }
        </View>
    )
}