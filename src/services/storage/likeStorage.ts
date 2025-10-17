import AsyncStorage from "@react-native-async-storage/async-storage";

import { ENV } from "../../config/env";

// Structure optimisée: { eventId: { userId: true } }
type LikesData = Record<string, Record<string, boolean>>;

// Récupérer toutes les données de likes
const getLikesData = async (): Promise<LikesData> => {
  try {
    const data = await AsyncStorage.getItem(ENV.likesStorageKey);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Erreur lors de la récupération des likes:", error);
    return {};
  }
};

// Sauvegarder les données de likes
const saveLikesData = async (data: LikesData): Promise<void> => {
  try {
    await AsyncStorage.setItem(ENV.likesStorageKey, JSON.stringify(data));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des likes:", error);
  }
};

// Vérifier si un utilisateur a liké un événement
export const isUserLiking = async (userId: string, eventId: string): Promise<boolean> => {
  const data = await getLikesData();
  return data[eventId]?.[userId] === true;
};

// Ajouter un like
export const addLike = async (userId: string, eventId: string): Promise<void> => {
  const data = await getLikesData();

  if (!data[eventId]) {
    data[eventId] = {};
  }

  data[eventId][userId] = true;
  await saveLikesData(data);
};

// Supprimer un like
export const removeLike = async (userId: string, eventId: string): Promise<void> => {
  const data = await getLikesData();

  if (data[eventId]?.[userId]) {
    delete data[eventId][userId];

    // Nettoyer si l'événement n'a plus de likes
    if (Object.keys(data[eventId]).length === 0) {
      delete data[eventId];
    }

    await saveLikesData(data);
  }
};

// Toggle like (ajouter ou supprimer)
export const toggleUserLike = async (userId: string, eventId: string): Promise<boolean> => {
  const isLiking = await isUserLiking(userId, eventId);

  if (isLiking) {
    await removeLike(userId, eventId);
    return false;
  } else {
    await addLike(userId, eventId);
    return true;
  }
};

// Supprimer tous les likes liés à un événement (quand l'événement est supprimé)
export const deleteEventLikes = async (eventId: string): Promise<void> => {
  const data = await getLikesData();

  if (data[eventId]) {
    delete data[eventId];
    await saveLikesData(data);
  }
};
