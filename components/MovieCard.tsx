import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MovieCardProps = {
    title: string,
    // navigation: any
}

const MovieCard: React.FC<MovieCardProps> = ({title}) => {
    const router = useRouter();
    return (
        <View style={styles.movieView}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={() => { router.push(`/movie/${title}`) }}>
                <Text style={{ color: "#007BFF", textAlign: "center" }}>View Details</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    movieView: {
        paddingVertical: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
    },
    title: {
        fontSize: 18,
        marginVertical: 10,
        textAlign: 'center',
        paddingBottom: 5,
        fontWeight: 'bold',
        color: '#333',
    }
})

export default MovieCard;