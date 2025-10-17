import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, Pressable, Text, View } from "react-native";

import { useSwipeCard } from "../../../animations/animations";
import { calculateDistance, formatDistance } from "../../../services/api/locationService";
import type { EventWithParticipation } from "../hooks/useEvents";
import { styles } from "../styles/eventCard.styles";

interface EventCardProps {
    readonly event: EventWithParticipation;
    readonly onPress: () => void;
    readonly onToggleParticipation: () => void;
    readonly onToggleLike: () => void;
    readonly onDelete: () => void;
    readonly userLatitude?: number | null;
    readonly userLongitude?: number | null;
    readonly onSwipeStart?: () => void;
    readonly onSwipeEnd?: () => void;
    readonly canDelete?: boolean;
}

export default function EventCard({
    event,
    onPress,
    onToggleParticipation,
    onToggleLike,
    onDelete,
    userLatitude,
    userLongitude,
    onSwipeStart,
    onSwipeEnd,
    canDelete = false,
}: EventCardProps) {
    const { translateX, panResponder, animatedBackgroundColor } = useSwipeCard({
        onToggleParticipation,
        onDelete,
        onSwipeStart,
        onSwipeEnd,
        canDelete,
    });

    const getDistanceText = () => {
        if (userLatitude != null && userLongitude != null && event.latitude != null && event.longitude != null) {
            const distance = calculateDistance(userLatitude, userLongitude, event.latitude, event.longitude);
            return formatDistance(distance);
        }
        return null;
    };

    const distanceText = getDistanceText();

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                {
                    marginBottom: 16,
                    transform: [{ translateX }],
                },
            ]}
        >
            <View style={styles.container}>
                <Pressable onPress={onPress} style={({ pressed }) => [styles.pressableContainer, pressed && styles.pressed]}>
                    {event.imageUri && (
                        <Image source={{ uri: event.imageUri }} style={styles.backgroundImage} contentFit="cover" />
                    )}
                    <Pressable onPress={onToggleLike} style={styles.likeButton}>
                        {event.liked ? <Text style={styles.heartFull}>♥</Text> : <Text style={styles.heartEmpty}>♡</Text>}
                    </Pressable>
                    <Animated.View style={[styles.swipeOverlay, { backgroundColor: animatedBackgroundColor }]} />
                    <View style={styles.header}>
                        <Text style={styles.title} numberOfLines={1}>
                            {event.title}
                        </Text>
                    </View>

                    {event.participated && (
                        <View style={styles.participationBadge}>
                            <Text style={styles.participationText}>
                                {new Date(event.date) < new Date() ? "Participé" : "Participe"}
                            </Text>
                        </View>
                    )}
                    <LinearGradient
                        colors={
                            event.imageUri
                                ? ["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.3)"]
                                : ["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.1)"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <View style={styles.contentContainer}>
                            <View style={styles.content}>
                                <Text style={styles.description} numberOfLines={1}>
                                    {event.description}
                                </Text>

                                <View style={styles.bottomSection}>
                                    <View style={styles.locationContainer}>
                                        {event.location && (
                                            <Text style={styles.location} numberOfLines={2}>
                                                {event.location}
                                                {distanceText && `\n${distanceText}`}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.dateContainer}>
                                        <Text style={styles.day}>{new Date(event.date).getDate()}</Text>
                                        <Text style={styles.month}>
                                            {new Date(event.date).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Pressable>
            </View>
        </Animated.View>
    );
}
