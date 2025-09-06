import { useThemeColor } from "@/theme/useThemeColor";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const scheme = useColorScheme()
  const paperTheme = scheme == "dark" ? MD3DarkTheme : MD3LightTheme
  return (
    <PaperProvider theme={paperTheme}>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
            <Stack.Screen name="movie/[title]" options={{ headerTitle: "Movie Details", headerTintColor: useThemeColor("text"), headerStyle: {backgroundColor: useThemeColor("background2")}}} />
        </Stack>
    </PaperProvider>
  );
}