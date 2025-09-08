import { BookmarkProvider } from "@/contexts/BookmarkContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { DefaultTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const scheme = useColorScheme()
  const paperTheme = useThemeColor("name") == "dark" ? MD3DarkTheme : MD3LightTheme
  return (
    <PaperProvider theme={{...paperTheme, colors: {...DefaultTheme.colors, primary: useThemeColor("primary")}}}>
        <BookmarkProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
              <Stack.Screen name="movie/[title]" options={{ headerTitle: "Movie Details", headerTintColor: useThemeColor("text"), headerStyle: {backgroundColor: useThemeColor("background2")}}} />
            </Stack>
        </BookmarkProvider>
    </PaperProvider>
  );
}