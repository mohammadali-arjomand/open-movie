import MovieCard from "@/components/MovieCard";
import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { search } from "../../services/search";

type Movie = {
    title: string;
}

export default function Index() {
    // const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);

    function showResults() {
        console.log(results);
        if (results.length === 0) {
            return null;
        }
        return <ScrollView style={styles.resultContainer}>
            {results.map(movie => (
                <MovieCard key={movie.title} title={movie.title} />
            ))}
        </ScrollView>
    }



    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerTitle: "Search" }} />
            <TextInput style={styles.searchInput} placeholder="Search ..." onChangeText={setSearchQuery} />
            <TouchableOpacity style={styles.searchBtn} onPress={() => search(searchQuery).then(movies => setResults(movies || []))}>
                <Text style={{ color: "#fff", fontSize: 16 }}>Search</Text>
            </TouchableOpacity>
            {showResults()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        padding: 16,
    },
    searchInput: {
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchBtn: {
        marginTop: 16,
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resultContainer: {
        borderRadius: 8,
        marginTop: 16,
        backgroundColor: "#fff",
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        maxHeight: "79%",
    }
})