# EventEase

Application mobile React Native de gestion d'événements avec authentification locale, CRUD complet, calendrier, météo et géolocalisation.

## Architecture

```
app/                     # Point d'entrée Expo Router

src/
├── components/          # Composants réutilisables
│   ├── common/          # Composants UI génériques
│   │   └── styles/      # Styles des composants communs
│   └── style/           # Styles globaux de l'application
├── features/            # Features par domaine métier
│   └── {featureName}/   # auth, events, eventDetail
│       ├── components/  # Composants spécifiques à la feature
│       ├── hooks/       # Hooks métier de la feature
│       └── styles/      # Styles de la feature
├── services/
│   ├── storage/         # Gestion AsyncStorage
│   └── api/            # Services API externes
├── navigation/
│   ├── flows/          # Flux de navigation (Auth, Main)
│   └── hooks/          # Hooks de navigation
├── contexts/           # Contexts React (état global)
├── animations/         # Animations et transitions
└── config/            # Configuration et variables d'environnement
```

## Variables d'environnement

Créer un fichier `.env` :
```bash
EXPO_PUBLIC_PASSWORD_SALT=your_secure_salt_here_min_16_chars
```

Le salt est utilisé pour hasher les mots de passe via expo-crypto.

## Technologies

- **React Native** (Expo SDK 54) + TypeScript
- **AsyncStorage** pour la persistance locale
- **expo-crypto** pour le hashage des mots de passe
- **react-native-calendars** pour la vue calendrier
- **expo-location** pour la géolocalisation
- **Open-Meteo API** pour la météo (gratuite, sans clé)
- **expo-linear-gradient** pour les effets visuels

## Installation

```bash
npm install
npm start
```

