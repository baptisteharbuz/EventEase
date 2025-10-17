import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import { ENV } from "../../config/env";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface StoredUser extends User {
  password: string; // Hash sécurisé
}

// Sauvegarder l'utilisateur connecté
export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(ENV.userStorageKey, JSON.stringify(user));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'utilisateur:", error);
  }
};

// Récupérer l'utilisateur connecté
export const getUser = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(ENV.userStorageKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

// Déconnexion
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ENV.userStorageKey);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};

// Récupérer la base de données des utilisateurs
const getUsersDB = async (): Promise<StoredUser[]> => {
  try {
    const data = await AsyncStorage.getItem(ENV.usersDbKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération de la DB utilisateurs:", error);
    return [];
  }
};

// Sauvegarder la base de données des utilisateurs
const saveUsersDB = async (users: StoredUser[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(ENV.usersDbKey, JSON.stringify(users));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la DB utilisateurs:", error);
  }
};

// Validation d'email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Hasher le mot de passe avec expo-crypto (SHA-256 + salt)
const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltedPassword = `${password}${ENV.passwordSalt}`;
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      saltedPassword
    );
  } catch (error) {
    console.error("Erreur lors du hashage du mot de passe:", error);
    throw error;
  }
};

// Validation du mot de passe
export interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export const validatePassword = (password: string): PasswordValidation => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    hasMinLength,
    hasUppercase,
    hasSpecialChar,
    isValid: hasMinLength && hasUppercase && hasSpecialChar,
  };
};

// Connexion
export const login = async (email: string, password: string): Promise<User | null> => {
  if (!email || !password) {
    return null;
  }

  if (!isValidEmail(email)) {
    return null;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return null;
  }

  const users = await getUsersDB();
  const hashedPassword = await hashPassword(password);
  const foundUser = users.find(user =>
    user.email.toLowerCase() === email.toLowerCase() &&
    user.password === hashedPassword
  );

  if (foundUser) {
    const user: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
    };
    await saveUser(user);
    return user;
  }

  return null;
};

// Inscription
export const signup = async (email: string, name: string, password: string): Promise<User | null> => {
  if (!email || !name || !password) {
    return null;
  }

  if (!isValidEmail(email)) {
    return null;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return null;
  }

  if (name.trim().length < 2) {
    return null;
  }

  const users = await getUsersDB();

  // Vérifier si l'email existe déjà
  const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return null;
  }

  // Hasher le mot de passe
  const hashedPassword = await hashPassword(password);

  // Créer le nouvel utilisateur
  const newUser: StoredUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name: name.trim(),
    password: hashedPassword,
  };

  users.push(newUser);
  await saveUsersDB(users);

  const user: User = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
  await saveUser(user);
  return user;
};
