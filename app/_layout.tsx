import { BookmarkProvider } from "@/contexts/BookmarkContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import { useState } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
    const paperTheme = useThemeColor("name") == "dark" ? MD3DarkTheme : MD3LightTheme
    const theme = {
        ...paperTheme,
        colors: {
            ...paperTheme.colors,
            primary: useThemeColor("primary"),        
            surface: useThemeColor("background"),
            onSurface: useThemeColor("text")
        }
    }

    return (
        <PaperProvider theme={theme}>
            <BookmarkProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
                    <Stack.Screen name="movie/[title]" options={{ headerTitle: "Movie Details", headerTintColor: useThemeColor("text"), headerStyle: {backgroundColor: useThemeColor("background2")}}} />
                </Stack>
            </BookmarkProvider>
        </PaperProvider>
    );
}