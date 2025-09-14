import usePoster from "@/hooks/usePoster";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// type MovieCardProps = {
//     title: string,
//     horizontaol: boolean
//     // navigation: any
// }

function MovieCard({title, horizontal=false}: {title: string, horizontal?: boolean}) {
    const router = useRouter();

    const styles = StyleSheet.create({
        movieView: {
            marginBottom: 10,
            backgroundColor: useThemeColor("background"),
            borderRadius: 18,
            padding: 10,
            paddingBottom: 0,
            overflow: 'hidden',
            width: horizontal ? 160 : "49%",
            height: 270,
        },
        title: {
            fontSize: 18,
            marginVertical: 10,
            marginLeft: 5,
            textAlign: 'center',
            paddingBottom: 5,
            fontWeight: 'bold',
            minWidth: "80%",
            maxWidth: "80%",
            color: useThemeColor("text"),
        },
        grid: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }
    })

    return (
        <View style={styles.movieView}>
            <TouchableOpacity style={styles.grid} onPress={() => { router.push(`/movie/${title}`) }}>
                <Image source={{ uri: usePoster(title).imageUrl}} style={{width: 140, height: 210, marginTop: 0, resizeMode: "cover", borderRadius: 8}} />
                <View style={{flex:1,justifyContent:'center',alignItems:'center',height:"100%"}}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default MovieCard;