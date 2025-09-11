import MovieCard from "@/components/MovieCard";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Bookmarks() {
    const {bookmarks} = useBookmarks()

    const showBookmarks = () => {
        if (bookmarks.length === 0) {
            return (
            <ScrollView>
                <Text style={styles.message}>Bookmarks list is empty. Add a movie or series to bookmarks list using <Ionicons size={12} name="bookmark-outline"/> button.</Text>
            </ScrollView>
        )
        }
        return (
            <View style={styles.scrollView}>
                <FlatList
                    data={bookmarks.toReversed()}
                    keyExtractor={(item,index) => index.toString()}
                    numColumns={2}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    renderItem={({item}) => (
                        <MovieCard title={item} />
                    )}
                />
            </View>
        )
    }

    const styles = StyleSheet.create({
        container: {
            backgroundColor: useThemeColor("background"),
            height: "100%"
        },
        scrollView: {
            margin: 16,
            borderColor: useThemeColor("border"),
            borderWidth: 0.5,
            backgroundColor: useThemeColor("background2"),
            padding: 8,
            borderRadius: 26,
            height: "96%"
        },
        message: {
            textAlign: 'center',
            marginTop: 30,
            marginHorizontal: 'auto',
            maxWidth: "80%",
            color: useThemeColor("text")
        },
    })

    return (
        <View style={styles.container}>
            {showBookmarks()}
        </View>
    )
}