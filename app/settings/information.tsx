import { openURL } from "expo-linking"
import { Stack } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"

export default function informationSettings() {
    return (
        <ScrollView>
            <Stack.Screen options={{headerTitle:"Information"}}/>
            <Text style={styles.title}>About App</Text>
            <Text style={styles.body}>Open Movie is an application for browsing movies and series when you're offline.</Text>
            <Text style={styles.title}>Contact Us</Text>
            <Text style={styles.body}>You can follow us in telegram. <TouchableOpacity onPress={() => openURL("https://t.me/OpenMovieApp")}><Text style={styles.link}>Click here to open telegram!</Text></TouchableOpacity></Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    body: {
        padding: 8,
        fontSize: 16   
    },
    link: {
        color: '#007BFF'
    }
})