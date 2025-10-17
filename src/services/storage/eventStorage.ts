import AsyncStorage from "@react-native-async-storage/async-storage";
import { addCreatedEvent, removeCreatedEvent } from "./activityStorage";
import { deleteEventLikes } from "./likeStorage";

import { ENV } from "../../config/env";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  imageUri?: string;
  createdBy: string;
}

type EventsData = Record<string, Event>;

// Récupérer les données d'événements
const getEventsData = async (): Promise<EventsData> => {
  try {
    const data = await AsyncStorage.getItem(ENV.eventsStorageKey);
    if (!data) return {};

    const parsed = JSON.parse(data);

    // Si c'est un tableau, convertir en objet avec les IDs comme clés
    if (Array.isArray(parsed)) {
      const objectFormat: EventsData = {};
      parsed.forEach((event: Event) => {
        if (event && event.id) {
          objectFormat[event.id] = event;
        }
      });
      // Sauvegarder le nouveau format
      await AsyncStorage.setItem(ENV.eventsStorageKey, JSON.stringify(objectFormat));
      return objectFormat;
    }

    return parsed;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return {};
  }
};

// Sauvegarder les données d'événements
const saveEventsData = async (eventsData: EventsData): Promise<void> => {
  try {
    await AsyncStorage.setItem(ENV.eventsStorageKey, JSON.stringify(eventsData));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des événements:", error);
  }
};

// Récupérer tous les événements
export const getEvents = async (): Promise<Event[]> => {
  const eventsData = await getEventsData();
  const events = Object.values(eventsData);
  return events;
};

// Sauvegarder un événement
export const saveEvent = async (event: Event): Promise<void> => {
  try {
    const eventsData = await getEventsData();
    eventsData[event.id] = event;
    await saveEventsData(eventsData);

    // Ajouter l'événement à la liste des événements créés par l'utilisateur
    await addCreatedEvent(event.createdBy, event.id);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'événement:", error);
  }
};

// Mettre à jour un événement
export const updateEvent = async (updatedEvent: Event): Promise<void> => {
  try {
    const eventsData = await getEventsData();
    if (eventsData[updatedEvent.id]) {
      eventsData[updatedEvent.id] = updatedEvent;
      await saveEventsData(eventsData);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
  }
};

// Supprimer un événement
export const deleteEvent = async (eventId: string, userId: string): Promise<void> => {
  try {
    const eventsData = await getEventsData();
    if (eventsData[eventId]) {
      delete eventsData[eventId];
      await saveEventsData(eventsData);

      // Supprimer l'événement de toutes les activités des utilisateurs
      await removeCreatedEvent(userId, eventId);
      deleteEventLikes(eventId);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
  }
};

// Récupérer un événement par ID
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const eventsData = await getEventsData();
    return eventsData[eventId] || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    return null;
  }
};
