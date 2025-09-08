import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        },
        title: {
            fontSize: 18,
            marginVertical: 10,
            textAlign: 'center',
            paddingBottom: 5,
            fontWeight: 'bold',
            color: useThemeColor("text"),
        }
    })

    return (
        <View style={styles.movieView}>
            <TouchableOpacity onPress={() => { router.push(`/movie/${title}`) }}>
                <Text style={styles.title}>{title}</Text>
                <Text style={{ color: useThemeColor("primary"), textAlign: "center" }}>View Details</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MovieCard;