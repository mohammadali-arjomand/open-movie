import MovieCard from "@/components/MovieCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { search } from "../../services/search";

type Movie = {
    title: string;
}

export default function Index() {
    const styles = StyleSheet.create({
        container: { 
            padding: 16,
            backgroundColor: useThemeColor("background"),
            height: "100%",
        },
        searchInput: {
            marginTop: 16,
            borderWidth: 1,
            borderColor: useThemeColor("border"),
            borderRadius: 8,
            padding: 8,
            fontSize: 16,
            backgroundColor: useThemeColor("background"),
            shadowColor: useThemeColor("shadow"),
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            color: useThemeColor("text")
        },
        searchBtn: {
            marginTop: 16,
            backgroundColor: useThemeColor("primary"),
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: useThemeColor("shadow"),
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        resultContainer: {
            borderRadius: 34,
            marginTop: 16,
            backgroundColor: useThemeColor("background2"),
            padding: 16,
            shadowColor: useThemeColor("shadow"),
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            maxHeight: "78%",
        }
    })

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);

    function showResults() {
        if (results.length === 0) {
            return null
        }
        return  (
            <View style={styles.resultContainer}>
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.title}
                    numColumns={2}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    renderItem={({item}) => (
                        <MovieCard key={item.title} title={item.title} />
                    )}
                    contentContainerStyle={{}}
                />
            </View>
        )
    }



    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerTitle: "Search" }} />
            <TextInput style={styles.searchInput} placeholderTextColor={useThemeColor("text2")} placeholder="Search ..." onChangeText={q => setSearchQuery(q)} />
            <TouchableOpacity style={styles.searchBtn} onPress={() => search(searchQuery).then(movies => setResults(movies || []))}>
                <Text style={{ color: "#fff", fontSize: 16 }}>Search</Text>
            </TouchableOpacity>
            {showResults()}
        </View>
    );
}