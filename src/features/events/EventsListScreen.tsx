import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import Background from "../../components/Background";
import type { Event } from "../../services/storage/eventStorage";
import EventCard from "./components/EventCard";
import { useEvents } from "./hooks/useEvents";
import { useUserLocation } from "./hooks/useUserLocation";
import { styles } from "./styles/events.styles";

interface EventsListScreenProps {
    readonly onNavigateToDetail: (event: Event) => void;
    readonly forceRefresh?: boolean;
    readonly onRefreshComplete?: () => void;
}

export default function EventsListScreen({ onNavigateToDetail, forceRefresh, onRefreshComplete }: EventsListScreenProps) {
    const { events, loading, refreshEvents, handleToggleParticipation, handleToggleLike, handleDeleteEvent, canDeleteEvent } =
        useEvents();
    const { userLatitude, userLongitude } = useUserLocation();
    const [filter, setFilter] = useState<"all" | "participated">("all");
    const flatListRef = useRef<FlatList>(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [eventPermissions, setEventPermissions] = useState<Record<string, boolean>>({});

    const filteredEvents = filter === "all" ? events : events.filter((e) => e.participated);

    // Fonctions pour gérer l'activation/désactivation du scroll
    const handleSwipeStart = () => {
        setScrollEnabled(false);
    };

    const handleSwipeEnd = () => {
        setScrollEnabled(true);
    };

    // Gérer le refresh forcé depuis la navigation
    useEffect(() => {
        if (forceRefresh) {
            refreshEvents().then(() => {
                onRefreshComplete?.();
            });
        }
    }, [forceRefresh, refreshEvents, onRefreshComplete]);

    // Charger les permissions pour chaque événement
    useEffect(() => {
        const loadPermissions = async () => {
            const permissions: Record<string, boolean> = {};
            for (const event of events) {
                const canDelete = await canDeleteEvent(event.id);
                permissions[event.id] = canDelete;
            }
            setEventPermissions(permissions);
        };

        if (events.length > 0) {
            loadPermissions();
        }
    }, [events, canDeleteEvent]);

    return (
        <Background showNavbar={true}>
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <Pressable
                        style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
                        onPress={() => setFilter("all")}
                    >
                        <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
                            Tous ({events.length})
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.filterButton, filter === "participated" && styles.filterButtonActive]}
                        onPress={() => setFilter("participated")}
                    >
                        <Text style={[styles.filterText, filter === "participated" && styles.filterTextActive]}>
                            Participés ({events.filter((e) => e.participated).length})
                        </Text>
                    </Pressable>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const canDelete = eventPermissions[item.id] || false;
                        return (
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
                                canDelete={canDelete}
                            />
                        );
                    }}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {filter === "all" ? "Aucun événement" : "Aucun événement participé"}
                            </Text>
                            <Text style={styles.emptySubtext}>Commencez par créer votre premier événement !</Text>
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
