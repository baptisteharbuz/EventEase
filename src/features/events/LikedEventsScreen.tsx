import { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";

import Background from "../../components/Background";
import type { Event } from "../../services/storage/eventStorage";
import EventCard from "./components/EventCard";
import { useEvents } from "./hooks/useEvents";
import { useUserLocation } from "./hooks/useUserLocation";
import { styles } from "./styles/events.styles";

interface LikedEventsScreenProps {
    readonly onNavigateToDetail: (event: Event) => void;
}

export default function LikedEventsScreen({ onNavigateToDetail }: LikedEventsScreenProps) {
    const { events, loading, refreshEvents, handleToggleParticipation, handleToggleLike, handleDeleteEvent, canDeleteEvent } =
        useEvents();
    const { userLatitude, userLongitude } = useUserLocation();
    const flatListRef = useRef<FlatList>(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [eventPermissions, setEventPermissions] = useState<Record<string, boolean>>({});

    // Filtrer seulement les événements likés
    const likedEvents = events.filter((event) => event.liked);

    // Fonctions pour gérer l'activation/désactivation du scroll
    const handleSwipeStart = () => {
        setScrollEnabled(false);
    };

    const handleSwipeEnd = () => {
        setScrollEnabled(true);
    };

    // Charger les permissions pour chaque événement
    useEffect(() => {
        const loadPermissions = async () => {
            const permissions: Record<string, boolean> = {};
            for (const event of likedEvents) {
                permissions[event.id] = await canDeleteEvent(event.id);
            }
            setEventPermissions(permissions);
        };

        if (likedEvents.length > 0) {
            loadPermissions();
        }
    }, [likedEvents, canDeleteEvent]);

    return (
        <Background showNavbar={true}>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={likedEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <EventCard
                            event={item}
                            onPress={() => onNavigateToDetail(item)}
                            onToggleParticipation={() => handleToggleParticipation(item.id)}
                            onToggleLike={() => handleToggleLike(item.id)}
                            onDelete={() => handleDeleteEvent(item.id)}
                            userLatitude={userLatitude}
                            userLongitude={userLongitude}
                            onSwipeStart={handleSwipeStart}
                            onSwipeEnd={handleSwipeEnd}
                            canDelete={eventPermissions[item.id] || false}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Aucun événement liké</Text>
                            <Text style={styles.emptySubtext}>Likez des événements pour les retrouver ici !</Text>
                        </View>
                    }
                    refreshing={loading}
                    onRefresh={refreshEvents}
                    scrollEnabled={scrollEnabled}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </Background>
    );
}
