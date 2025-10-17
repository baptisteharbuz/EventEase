import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Background from "../../components/Background";
import { NAVBAR_GRADIENT_COLORS } from "../../components/style/navbar.styles";
import type { Event } from "../../services/storage/eventStorage";
import EventCard from "./components/EventCard";
import { useEvents } from "./hooks/useEvents";
import { useUserLocation } from "./hooks/useUserLocation";
import { styles } from "./styles/calendar.styles";

interface CalendarScreenProps {
    readonly onNavigateToDetail: (event: Event) => void;
}

export default function CalendarScreen({ onNavigateToDetail }: CalendarScreenProps) {
    const { events, handleToggleParticipation, handleToggleLike, handleDeleteEvent, canDeleteEvent } = useEvents();
    const { userLatitude, userLongitude } = useUserLocation();
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const scrollViewRef = useRef<ScrollView>(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [eventPermissions, setEventPermissions] = useState<Record<string, boolean>>({});

    const calendarTheme = useMemo(() => {
        const baseTheme: Record<string, unknown> = {
            backgroundColor: "transparent",
            calendarBackground: "rgba(0, 0, 0, 0.15)",
            textSectionTitleColor: "#fff",
            selectedDayBackgroundColor: NAVBAR_GRADIENT_COLORS[0],
            selectedDayTextColor: "#fff",
            todayTextColor: "#FFD700",
            dayTextColor: "#fff",
            textDisabledColor: "rgba(255, 255, 255, 0.3)",
            monthTextColor: "#fff",
            arrowColor: "#fff",
        };

        (baseTheme as Record<string, unknown>)["stylesheet.day.multiDot"] = {
            dot: {
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 1,
            },
            selectedDot: {
                width: 10,
                height: 10,
                borderRadius: 5,
            },
        };

        return baseTheme;
    }, []);

    // Marquer les dates avec des événements (multi-dot)
    const markedDates = useMemo(() => {
        const marked: Record<string, { dots: { color: string; selectedDotColor?: string }[]; selected?: boolean }> = {};
        events.forEach((event) => {
            const date = new Date(event.date);
            const dateKey = date.toISOString().split("T")[0];

            const dot = {
                color: event.participated ? "#4CAF50" : "#FF3B30",
                selectedDotColor: event.participated ? "#4CAF50" : "#FF3B30",
            };

            if (!marked[dateKey]) {
                marked[dateKey] = {
                    dots: [dot],
                    selected: dateKey === selectedDate,
                };
            } else {
                marked[dateKey].dots.push(dot);
            }
        });
        if (selectedDate) {
            if (!marked[selectedDate]) marked[selectedDate] = { dots: [], selected: true };
            else marked[selectedDate].selected = true;
        }
        return marked;
    }, [events, selectedDate]);

    // Événements du jour sélectionné
    const eventsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return events.filter((event) => {
            const date = new Date(event.date);
            const dateKey = date.toISOString().split("T")[0];
            return dateKey === selectedDate;
        });
    }, [events, selectedDate]);

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

    const handleSwipeStart = () => {
        setScrollEnabled(false);
    };

    const handleSwipeEnd = () => {
        setScrollEnabled(true);
    };

    // Fonction pour formater la date sélectionnée
    const formatSelectedDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();

        const isToday = date.toISOString().split("T")[0] === today.toISOString().split("T")[0];

        // Formater la date en français
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };

        const formattedDate = date.toLocaleDateString("fr-FR", options);

        return isToday ? `${formattedDate} (aujourd'hui)` : formattedDate;
    };

    return (
        <Background showNavbar={true}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContainer}
                    scrollEnabled={scrollEnabled}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <View style={styles.calendarContainer}>
                            <Calendar
                                markedDates={markedDates}
                                onDayPress={(day) => setSelectedDate(day.dateString)}
                                markingType="multi-dot"
                                theme={calendarTheme}
                            />
                        </View>

                        <View style={styles.eventsContainer}>
                            <Text style={styles.subtitle}>Événements du {formatSelectedDate(selectedDate)}</Text>
                            {eventsForSelectedDate.length > 0 ? (
                                eventsForSelectedDate.map((event) => {
                                    const canDelete = eventPermissions[event.id] || false;
                                    return (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            onPress={() => onNavigateToDetail(event)}
                                            onToggleParticipation={() => handleToggleParticipation(event.id)}
                                            onToggleLike={() => handleToggleLike(event.id)}
                                            onDelete={() => handleDeleteEvent(event.id)}
                                            userLatitude={userLatitude}
                                            userLongitude={userLongitude}
                                            onSwipeStart={handleSwipeStart}
                                            onSwipeEnd={handleSwipeEnd}
                                            canDelete={canDelete}
                                        />
                                    );
                                })
                            ) : (
                                <View style={styles.emptyStateContainer}>
                                    <Text style={styles.emptyStateText}>Pas d&apos;événements organisés pour ce jour.</Text>
                                    <Text style={styles.emptyStateSubtext}>
                                        Vous pouvez en ajouter un nouveau directement ici
                                    </Text>
                                    <Text style={styles.arrowText}>↓</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Background>
    );
}
