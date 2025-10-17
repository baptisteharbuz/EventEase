import { useCallback, useEffect, useState } from "react";

import { useCurrentUserId } from "../../../contexts/AuthContext";
import { isUserOwner, isUserParticipating, toggleUserParticipation } from "../../../services/storage/activityStorage";
import type { Event as BaseEvent } from "../../../services/storage/eventStorage";
import {
  deleteEvent,
  getEvents,
} from "../../../services/storage/eventStorage";
import { isUserLiking, toggleUserLike } from "../../../services/storage/likeStorage";

export interface EventWithParticipation extends BaseEvent {
  participated: boolean;
  liked: boolean;
}

export const useEvents = () => {
  const [events, setEvents] = useState<EventWithParticipation[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUserId = useCurrentUserId();

  const loadEvents = useCallback(async () => {
    if (!currentUserId) return;

    setLoading(true);
    const data = await getEvents();

    // Enrichir chaque événement avec les informations de participation et likes de l'utilisateur actuel
    const eventsWithParticipation = await Promise.all(
      data.map(async (event) => ({
        ...event,
        participated: await isUserParticipating(currentUserId, event.id),
        liked: await isUserLiking(currentUserId, event.id),
      }))
    );

    const sortedEvents = [...eventsWithParticipation].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(sortedEvents);
    setLoading(false);
  }, [currentUserId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const refreshEvents = useCallback(async () => {
    await loadEvents();
  }, [loadEvents]);

  const handleToggleParticipation = useCallback(
    async (eventId: string) => {
      if (!currentUserId) return;

      // Mise à jour locale immédiate
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, participated: !event.participated } : event
        )
      );

      // Mise à jour du storage en arrière-plan
      await toggleUserParticipation(currentUserId, eventId);
    },
    [currentUserId]
  );

  const handleToggleLike = useCallback(
    async (eventId: string) => {
      if (!currentUserId) return;

      // Mise à jour locale immédiate
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, liked: !event.liked } : event
        )
      );

      // Mise à jour du storage en arrière-plan
      await toggleUserLike(currentUserId, eventId);
    },
    [currentUserId]
  );

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      if (!currentUserId) return;

      // Suppression locale immédiate
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));

      // Suppression du storage en arrière-plan avec l'utilisateur
      await deleteEvent(eventId, currentUserId);
    },
    [currentUserId]
  );

  // vérifier si l'utilisateur peut supprimer un événement
  const canDeleteEvent = useCallback(
    async (eventId: string) => {
      if (!currentUserId) return false;
      return await isUserOwner(currentUserId, eventId);
    },
    [currentUserId]
  );

  return {
    events,
    loading,
    refreshEvents,
    handleToggleParticipation,
    handleToggleLike,
    handleDeleteEvent,
    canDeleteEvent,
  };
};

