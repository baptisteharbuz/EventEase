export const STORAGE_KEYS = {
  USER: '@eventease_user',
  USERS_DB: '@eventease_users_db',
  EVENTS: '@eventease_events',
  LIKES: '@eventease_likes',
  ACTIVITIES: '@eventease_activities',
  PARTICIPATIONS: '@eventease_participations',
} as const;

const readPasswordSalt = (): string => {
  const value = process.env.EXPO_PUBLIC_PASSWORD_SALT;
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  throw new Error("Missing environment variable: EXPO_PUBLIC_PASSWORD_SALT");
};

export const ENV = {
  passwordSalt: readPasswordSalt(),
  userStorageKey: STORAGE_KEYS.USER,
  usersDbKey: STORAGE_KEYS.USERS_DB,
  eventsStorageKey: STORAGE_KEYS.EVENTS,
  likesStorageKey: STORAGE_KEYS.LIKES,
  activitiesStorageKey: STORAGE_KEYS.ACTIVITIES,
  participationsStorageKey: STORAGE_KEYS.PARTICIPATIONS,
} as const;
