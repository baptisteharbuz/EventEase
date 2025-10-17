import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/contexts/AuthContext";

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                    <Stack screenOptions={{ headerShown: false }} />
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
