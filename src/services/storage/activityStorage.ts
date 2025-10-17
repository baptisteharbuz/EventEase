import AsyncStorage from "@react-native-async-storage/async-storage";

import { ENV } from "../../config/env";

// Interface pour les participations d'un utilisateur
export interface UserParticipation {
  userId: string;
  eventId: string;
  participatedAt: string; // Date ISO
}

// Interface pour l'activité complète d'un utilisateur
export interface UserActivity {
  userId: string;
  participations: string[]; // Array d'eventIds
  createdEvents: string[]; // Array d'eventIds créés par cet utilisateur
}

// Structure optimisée pour les participations: { eventId: { userId: true } }
type ParticipationsData = Record<string, Record<string, boolean>>;

// Récupérer toutes les activités
const getActivities = async (): Promise<Record<string, UserActivity>> => {
  try {
    const data = await AsyncStorage.getItem(ENV.activitiesStorageKey);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error);
    return {};
  }
};

// Sauvegarder toutes les activités
const saveActivities = async (activities: Record<string, UserActivity>): Promise<void> => {
  try {
    await AsyncStorage.setItem(ENV.activitiesStorageKey, JSON.stringify(activities));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des activités:", error);
  }
};

// Récupérer les données de participations (structure optimisée)
const getParticipationsData = async (): Promise<ParticipationsData> => {
  try {
    const data = await AsyncStorage.getItem(ENV.participationsStorageKey);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Erreur lors de la récupération des participations:", error);
    return {};
  }
};

// Sauvegarder les données de participations
const saveParticipationsData = async (participationsData: ParticipationsData): Promise<void> => {
  try {
    await AsyncStorage.setItem(ENV.participationsStorageKey, JSON.stringify(participationsData));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des participations:", error);
  }
};

// Récupérer l'activité d'un utilisateur spécifique
export const getUserActivity = async (userId: string): Promise<UserActivity> => {
  const activities = await getActivities();
  return activities[userId] || {
    userId,
    participations: [],
    createdEvents: [],
  };
};

// Ajouter une participation pour un utilisateur
export const addParticipation = async (userId: string, eventId: string): Promise<void> => {
  const activities = await getActivities();
  const participationsData = await getParticipationsData();

  if (!activities[userId]) {
    activities[userId] = {
      userId,
      participations: [],
      createdEvents: [],
    };
  }

  // Vérifier si l'utilisateur ne participe pas déjà
  if (!activities[userId].participations.includes(eventId)) {
    activities[userId].participations.push(eventId);
    await saveActivities(activities);
  }

  // Ajouter à la structure optimisée
  if (!participationsData[eventId]) {
    participationsData[eventId] = {};
  }
  participationsData[eventId][userId] = true;
  await saveParticipationsData(participationsData);
};

// Supprimer une participation pour un utilisateur
export const removeParticipation = async (userId: string, eventId: string): Promise<void> => {
  const activities = await getActivities();
  const participationsData = await getParticipationsData();

  if (activities[userId]) {
    activities[userId].participations = activities[userId].participations.filter(
      id => id !== eventId
    );
    await saveActivities(activities);
  }

  // Supprimer de la structure optimisée
  if (participationsData[eventId]?.[userId]) {
    delete participationsData[eventId][userId];

    // Nettoyer si l'événement n'a plus de participants
    if (Object.keys(participationsData[eventId]).length === 0) {
      delete participationsData[eventId];
    }
    await saveParticipationsData(participationsData);
  }
};

// Vérifier si un utilisateur participe à un événement
export const isUserParticipating = async (userId: string, eventId: string): Promise<boolean> => {
  const userActivity = await getUserActivity(userId);
  return userActivity.participations.includes(eventId);
};

// Toggle participation (participer/annuler)
export const toggleUserParticipation = async (userId: string, eventId: string): Promise<boolean> => {
  const isParticipating = await isUserParticipating(userId, eventId);

  if (isParticipating) {
    await removeParticipation(userId, eventId);
    return false; // Plus de participation
  } else {
    await addParticipation(userId, eventId);
    return true; // Maintenant participant
  }
};

// Ajouter un événement créé par un utilisateur
export const addCreatedEvent = async (userId: string, eventId: string): Promise<void> => {
  const activities = await getActivities();

  if (!activities[userId]) {
    activities[userId] = {
      userId,
      participations: [],
      createdEvents: [],
    };
  }

  if (!activities[userId].createdEvents.includes(eventId)) {
    activities[userId].createdEvents.push(eventId);
    await saveActivities(activities);
  }
};

// Supprimer un événement créé par un utilisateur (quand il le supprime)
export const removeCreatedEvent = async (userId: string, eventId: string): Promise<void> => {
  const activities = await getActivities();
  const participationsData = await getParticipationsData();

  if (activities[userId]) {
    activities[userId].createdEvents = activities[userId].createdEvents.filter(
      id => id !== eventId
    );
    await saveActivities(activities);
  }

  // Supprimer aussi toutes les participations à cet événement de tous les utilisateurs
  for (const user of Object.values(activities)) {
    user.participations = user.participations.filter(id => id !== eventId);
  }
  await saveActivities(activities);

  // Supprimer de la structure optimisée (O(1) au lieu de O(n×m))
  if (participationsData[eventId]) {
    delete participationsData[eventId];
    await saveParticipationsData(participationsData);
  }
};

// Vérifier si un utilisateur a créé un événement
export const isUserOwner = async (userId: string, eventId: string): Promise<boolean> => {
  const userActivity = await getUserActivity(userId);
  return userActivity.createdEvents.includes(eventId);
};

// Récupérer tous les événements auxquels un utilisateur participe
export const getUserParticipatedEvents = async (userId: string): Promise<string[]> => {
  const userActivity = await getUserActivity(userId);
  return userActivity.participations;
};

// Récupérer tous les événements créés par un utilisateur
export const getUserCreatedEvents = async (userId: string): Promise<string[]> => {
  const userActivity = await getUserActivity(userId);
  return userActivity.createdEvents;
};
