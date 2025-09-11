import usePoster from "@/hooks/usePoster";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MovieCardProps = {
    title: string,
    // navigation: any
}

const MovieCard: React.FC<MovieCardProps> = ({title}) => {
    const router = useRouter();

    const styles = StyleSheet.create({
        movieView: {
            paddingVertical: 10,
            marginBottom: 10,
            backgroundColor: useThemeColor("background"),
            // borderColor: useThemeColor("border"),
            // borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            overflow: 'scroll'
        },
        title: {
            fontSize: 18,
            marginVertical: 10,
            marginLeft: 5,
            textAlign: 'left',
            paddingBottom: 5,
            fontWeight: 'bold',
            minWidth: "80%",
            maxWidth: "80%",
            color: useThemeColor("text"),
        },
        grid: {
            flex: 1,
            flexDirection: "row",
        }
    })

    return (
        <View style={styles.movieView}>
            <TouchableOpacity style={styles.grid} onPress={() => { router.push(`/movie/${title}`) }}>
                <Image source={{ uri: usePoster(title).imageUrl}} style={{width: 100, height: 150, resizeMode: "cover", borderRadius: 8}} />
                <View>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default MovieCard;