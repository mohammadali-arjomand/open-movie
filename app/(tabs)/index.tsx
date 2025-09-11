import { LastWatchContext } from "@/contexts/LastWatchContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openURL } from "expo-linking";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// type FullRow = {
//     quality: string,
//     language: string,
//     url: string,
//     title: string,
//     season: string,
//     episode: string,
// }

export default function Home() {
    const router = useRouter();

    const {lastWatchUpdater} = useContext(LastWatchContext);
    const [lastWatch, setLastWatch] = useState<any>(null)
    useEffect(() => {
        AsyncStorage.getItem("last-watch").then(value => {
            if (value !== null) {             
                setLastWatch(JSON.parse(value))
                console.log("Loading last watch ...")
            }
        })
    }, [lastWatchUpdater])

    console.log(lastWatchUpdater);
    

    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background")
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

    return (
        <View style={styles.container}>
            {
                lastWatch === null && lastWatch === undefined ?
                <View>
                    <Text style={styles.header}>Welcome to Open Movie!</Text>

                    <Text style={styles.body}>Download full database from our Telegram channel and import it!</Text>
                    <TouchableOpacity onPress={() => openURL("https://t.me/OpenMovieApp")}>
                        <Text style={styles.link}>- Telegram Channel?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/settings/databases")}>
                        <Text style={styles.link}>- How to import?</Text>
                    </TouchableOpacity>
                </View> :
                <View>
                    <Text style={styles.header}>Random Titles!</Text>
                    <ScrollView style={{height:"100%"}}>
                        <Text>Loading...</Text>
                    </ScrollView>
                </View>
            }
        </View>
    )
}