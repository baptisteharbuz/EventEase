import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { styles } from "./style/bottomTabBar.styles";
import { NAVBAR_GRADIENT_COLORS } from "./style/navbar.styles";

interface BottomTabBarProps {
    readonly currentTab: "events" | "calendar" | "add" | "liked" | "logout";
    readonly onNavigateToEvents: () => void;
    readonly onNavigateToCalendar: () => void;
    readonly onNavigateToAdd: () => void;
    readonly onNavigateToLiked: () => void;
    readonly onLogout: () => void;
}

export default function BottomTabBar({
    currentTab,
    onNavigateToEvents,
    onNavigateToCalendar,
    onNavigateToAdd,
    onNavigateToLiked,
    onLogout,
}: BottomTabBarProps) {
    return (
        <View style={styles.container}>
            <Pressable style={[styles.tab, currentTab === "events" && styles.activeTab]} onPress={onNavigateToEvents}>
                <Ionicons
                    name="home"
                    size={28}
                    color={currentTab === "events" ? styles.iconActive.color : styles.iconInactive.color}
                />
                <Text style={[styles.tabText, currentTab === "events" && styles.activeTabText]}>Événements</Text>
            </Pressable>

            <Pressable style={[styles.tab, currentTab === "liked" && styles.activeTab]} onPress={onNavigateToLiked}>
                <Ionicons
                    name="heart"
                    size={28}
                    color={currentTab === "liked" ? styles.iconActive.color : styles.iconInactive.color}
                />
                <Text style={[styles.tabText, currentTab === "liked" && styles.activeTabText]}>Likes</Text>
            </Pressable>

            <Pressable style={styles.tab} onPress={onNavigateToAdd}>
                <LinearGradient
                    colors={
                        currentTab === "add" ? ["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.1)"] : NAVBAR_GRADIENT_COLORS
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={currentTab === "add" ? styles.addTabActive : styles.addTab}
                >
                    <Ionicons name="add-circle" size={60} color={currentTab === "add" ? styles.iconActive.color : "#FFFFFF"} />
                </LinearGradient>
            </Pressable>

            <Pressable style={[styles.tab, currentTab === "calendar" && styles.activeTab]} onPress={onNavigateToCalendar}>
                <Ionicons
                    name="calendar"
                    size={28}
                    color={currentTab === "calendar" ? styles.iconActive.color : styles.iconInactive.color}
                />
                <Text style={[styles.tabText, currentTab === "calendar" && styles.activeTabText]}>Calendrier</Text>
            </Pressable>

            <Pressable style={[styles.tab, currentTab === "logout" && styles.activeTab]} onPress={onLogout}>
                <Ionicons
                    name="log-out"
                    size={28}
                    color={currentTab === "logout" ? styles.iconActive.color : styles.iconInactive.color}
                />
                <Text style={[styles.tabText, currentTab === "logout" && styles.activeTabText]}>Sortir</Text>
            </Pressable>
        </View>
    );
}
