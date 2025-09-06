import { useThemeColor } from "@/theme/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: useThemeColor("primary"),
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {backgroundColor: useThemeColor("background2"), borderColor: useThemeColor("border")},
                headerStyle: {backgroundColor: useThemeColor("background2"), shadowColor: useThemeColor("shadow")},
                headerTintColor: useThemeColor("text")
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}