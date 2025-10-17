import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Pressable, ScrollView, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSwipeNavigation } from "../../animations/animations";
import Background from "../../components/Background";
import Button from "../../components/common/Button";
import { useCurrentUserId } from "../../contexts/AuthContext";
import { clearAddressCache, geocodeAddress } from "../../services/api/locationService";
import { isUserOwner, isUserParticipating, toggleUserParticipation } from "../../services/storage/activityStorage";
import type { Event } from "../../services/storage/eventStorage";
import { deleteEvent } from "../../services/storage/eventStorage";
import { isUserLiking, toggleUserLike } from "../../services/storage/likeStorage";
import WeatherWidget from "./components/WeatherWidget";
import { styles } from "./styles/eventDetail.styles";

interface EventDetailScreenProps {
    readonly event: Event;
    readonly onNavigateBack: () => void;
    readonly onNavigateToEdit: (event: Event) => void;
    readonly onSwipeProgress?: (progress: number) => void;
}

export default function EventDetailScreen({ event, onNavigateBack, onNavigateToEdit, onSwipeProgress }: EventDetailScreenProps) {
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
        event.latitude != null && event.longitude != null ? { latitude: event.latitude, longitude: event.longitude } : null
    );

    const currentUserId = useCurrentUserId();
    const [isOwner, setIsOwner] = useState(false);
    const [isParticipating, setIsParticipating] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollEnabled = true;
    const { translateX, panResponder } = useSwipeNavigation({ onNavigateBack, scrollEnabled, onSwipeProgress });

    // Vérifier les permissions, participations et likes
    useEffect(() => {
        const checkPermissions = async () => {
            if (!currentUserId) return;

            const ownerStatus = await isUserOwner(currentUserId, event.id);
            const participationStatus = await isUserParticipating(currentUserId, event.id);
            const likeStatus = await isUserLiking(currentUserId, event.id);

            setIsOwner(ownerStatus);
            setIsParticipating(participationStatus);
            setIsLiked(likeStatus);
        };

        checkPermissions();
    }, [currentUserId, event.id]);

    // Forcer le recalcul du géocodage
    useEffect(() => {
        let isMounted = true;
        const run = async () => {
            if (event.location) {
                clearAddressCache();
                setCoords(null);
                const result = await geocodeAddress(event.location);
                if (isMounted && result) {
                    setCoords(result);
                }
            }
        };
        run();
        return () => {
            isMounted = false;
        };
    }, [event.location]);
    const handleDelete = () => {
        Alert.alert("Supprimer", "Voulez-vous vraiment supprimer cet événement ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: () => {
                    if (currentUserId) {
                        deleteEvent(event.id, currentUserId)
                            .then(() => {
                                Alert.alert("Succès", "Événement supprimé", [{ text: "OK", onPress: onNavigateBack }]);
                            })
                            .catch(() => {
                                Alert.alert("Erreur", "La suppression a échoué");
                            });
                    }
                },
            },
        ]);
    };

    const handleEdit = () => {
        onNavigateToEdit(event);
    };

    const handleToggleParticipation = async () => {
        if (!currentUserId) {
            Alert.alert("Erreur", "Vous devez être connecté pour participer");
            return;
        }

        const newParticipationStatus = await toggleUserParticipation(currentUserId, event.id);
        setIsParticipating(newParticipationStatus);

        Alert.alert("Succès", newParticipationStatus ? "Vous participez à cet événement !" : "Participation annulée", [
            { text: "OK" },
        ]);
    };

    const handleToggleLike = async () => {
        if (!currentUserId) {
            Alert.alert("Erreur", "Vous devez être connecté pour liker");
            return;
        }

        const newLikeStatus = await toggleUserLike(currentUserId, event.id);
        setIsLiked(newLikeStatus);
    };

    const getParticipationText = () => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const isEventPassed = eventDate < now;

        return isEventPassed ? "Participé" : "Participe";
    };

    return (
        <Animated.View style={[{ flex: 1 }, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
            <Background showNavbar={false}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContainer}
                    scrollEnabled={scrollEnabled}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <View style={styles.imageContainer}>
                                {event.imageUri && (
                                    <Image source={{ uri: event.imageUri }} style={styles.headerImage} contentFit="cover" />
                                )}
                                <Pressable onPress={handleToggleLike} style={styles.likeButton}>
                                    {isLiked ? <Text style={styles.heartFull}>♥</Text> : <Text style={styles.heartEmpty}>♡</Text>}
                                </Pressable>
                                {isParticipating && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>✓ {getParticipationText()}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.header}>
                                <Text style={styles.title}>{event.title}</Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>📅 Date</Text>
                                <Text style={styles.value}>
                                    {(() => {
                                        const date = new Date(event.date);
                                        const dateStr = date.toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        });
                                        const timeStr = date.toLocaleTimeString("fr-FR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        });
                                        return `${dateStr} à ${timeStr}`;
                                    })()}
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>📝 Description</Text>
                                <Text style={styles.description}>{event.description}</Text>
                            </View>
                            {isOwner && (
                                <View style={styles.section}>
                                    <Text style={styles.label}>👤 Organisateur</Text>
                                    <Text style={styles.value}>Vous êtes l&apos;organisateur de cet événement</Text>
                                </View>
                            )}
                            {event.location && (
                                <View style={styles.section}>
                                    <Text style={styles.label}>📍 Lieu</Text>
                                    <Text style={styles.value}>{event.location}</Text>
                                </View>
                            )}

                            {coords && (
                                <View style={styles.section}>
                                    <View style={styles.mapPreview}>
                                        <MapView
                                            style={styles.map}
                                            pointerEvents="none"
                                            initialRegion={{
                                                latitude: coords.latitude,
                                                longitude: coords.longitude,
                                                latitudeDelta: 0.01,
                                                longitudeDelta: 0.01,
                                            }}
                                        >
                                            <Marker coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} />
                                        </MapView>
                                    </View>
                                </View>
                            )}

                            <WeatherWidget location={event.location} date={event.date} />

                            <View style={styles.actions}>
                                <Button
                                    title={isParticipating ? "Annuler ma participation" : "Participer"}
                                    onPress={handleToggleParticipation}
                                />
                                {isOwner && (
                                    <>
                                        <Button title="Modifier" onPress={handleEdit} variant="secondary" />
                                        <Button title="Supprimer" onPress={handleDelete} variant="secondary" />
                                    </>
                                )}
                                <Button title="Retour" onPress={onNavigateBack} variant="secondary" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Background>
        </Animated.View>
    );
}
