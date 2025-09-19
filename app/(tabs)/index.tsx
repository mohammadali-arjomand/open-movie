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

    const {titles, isWatchedCompletely} = useContinueWatching()
    const [continueWatchingTitles, setContinueWatchingTitles] = useState<Movie[]>([])
    const [justMovies, setJustMovies] = useState<Movie[]>([])
    useEffect(() => {
        const newTitles: Movie[] = []
        const newJustMovies: Movie[] = []
        for (var title in titles) {
            // if ("0" in titles[title]) {
            //     delete titles[title]["0"]
            // }
            
            if (!continueWatchingTitles.includes({title}) && !newTitles.includes({title}) && Object.keys(titles[title]).length > 0) {
                newTitles.push({title})
            }
            if (Object.keys(titles[title]).length === 1 && Object.keys(titles[title])[0] === "0") {
                newJustMovies.push({title})
            }
        }
        setContinueWatchingTitles(newTitles)
        setJustMovies(newJustMovies)
        console.log(newTitles);
        console.log(newJustMovies);
        
        
    }, [titles])

    const [watchedCompletelyMap, setWatchedCompletelyMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
    if (continueWatchingTitles.length === 0) return;

    const checkAllTitles = async () => {
        const results = await Promise.all(
            continueWatchingTitles.map(async ({ title }) => {
                const complete = await isWatchedCompletely(title)
                return [title, complete] as const
            })
        )

        setWatchedCompletelyMap(Object.fromEntries(results))
        
    }

    checkAllTitles()
    }, [continueWatchingTitles])

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
                        <Ionicons name="heart-circle" size={25} color={styles.link.color} />{" "}
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
                    {continueWatchingTitles.length - Object.values(watchedCompletelyMap).filter(Boolean).length === 0 ? null : (
                        <View>
                            <Text style={{...styles.header, textAlign:'left',marginLeft:10}}>
                                <Ionicons name="play-forward-circle" size={25} color={styles.link.color} />{" "}
                                Continue Watching
                            </Text>
                            <FlatList
                                data={continueWatchingTitles.toReversed()}
                                keyExtractor={(item) => item.title}
                                horizontal={true}
                                renderItem={({item}) => (
                                    watchedCompletelyMap[item.title] ? null :
                                    <MovieCard title={item.title} horizontal={true} />
                                )}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}
                    {Object.values(watchedCompletelyMap).filter(Boolean).length === 0 ? null : (
                        <View>
                            <Text style={{...styles.header, textAlign:'left',marginLeft:10}}>
                                <Ionicons name="refresh-circle" size={25} color={styles.link.color} />{" "}
                                Watch Again
                            </Text>
                            <FlatList
                                data={continueWatchingTitles.toReversed()}
                                keyExtractor={(item) => item.title}
                                horizontal={true}
                                renderItem={({item}) => (
                                    !watchedCompletelyMap[item.title] && !justMovies.find(value => value.title === item.title) ? null :
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