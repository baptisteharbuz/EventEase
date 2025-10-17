import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { styles } from "./styles/button.styles";

interface ButtonProps {
    readonly title: string;
    readonly onPress: () => void;
    readonly loading?: boolean;
    readonly variant?: "primary" | "secondary";
}

export default function Button({ title, onPress, loading = false, variant = "primary" }: ButtonProps) {
    const gradientColors =
        variant === "primary"
            ? (["rgba(253, 29, 29, 0.9)", "rgba(252, 176, 69, 0.9)"] as const)
            : (["rgba(100, 100, 100, 0.7)", "rgba(150, 150, 150, 0.7)"] as const);

    return (
        <Pressable onPress={onPress} disabled={loading} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
            <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
            </LinearGradient>
        </Pressable>
    );
}
