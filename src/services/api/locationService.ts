import * as Location from "expo-location";

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

// Cache pour éviter les appels répétés à l'API avec une durée de 5 minutes
let lastLocationCache: { data: LocationData; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

// Cache par adresse pour le géocodage direct (adresse -> coords)
const addressCache = new Map<string, { lat: number; lon: number; timestamp: number }>();

// Demander la permission et obtenir la position actuelle
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});

    // Vérifier le cache d'abord
    const now = Date.now();
    if (lastLocationCache && (now - lastLocationCache.timestamp) < CACHE_DURATION) {
      return lastLocationCache.data;
    }

    // Géocodage inverse pour obtenir l'adresse (avec gestion d'erreur)
    let addressString = "Localisation actuelle";
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const addr = address[0];
        addressString = `${addr.city || addr.subregion || ""}, ${addr.country || ""}`.trim();
      }
    } catch (geocodeError) {
      console.warn("Géocodage échoué, utilisation de l'adresse par défaut:", geocodeError);
    }

    const locationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: addressString,
    };

    // Mettre en cache
    lastLocationCache = { data: locationData, timestamp: now };

    return locationData;
  } catch (error) {
    console.error("Erreur lors de la récupération de la localisation:", error);
    return null;
  }
};

// Géocoder une adresse en coordonnées (avec cache pour limiter le rate limit)
export const geocodeAddress = async (
  address: string
): Promise<{ latitude: number; longitude: number } | null> => {
  if (!address || address.trim().length === 0) return null;

  const cached = addressCache.get(address);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return { latitude: cached.lat, longitude: cached.lon };
  }

  try {
    // Améliorer l'adresse pour favoriser la France si pas de pays spécifié
    let searchAddress = address.trim();

    // Si l'adresse ne contient pas "France" et semble être juste une ville française connue
    const frenchCities = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier', 'bordeaux', 'lille', 'rennes', 'reims', 'toulon', 'saint-étienne', 'le havre', 'grenoble', 'dijon', 'angers', 'villeurbanne', 'clermont-ferrand'];

    if (!searchAddress.toLowerCase().includes('france') &&
      !searchAddress.includes(',') &&
      frenchCities.includes(searchAddress.toLowerCase())) {
      searchAddress = `${searchAddress}, France`;
    }

    const results = await Location.geocodeAsync(searchAddress);
    if (results && results.length > 0) {
      // Filtrer les résultats pour favoriser l'Europe (approximativement)
      const europeanResults = results.filter(result =>
        result.latitude >= 35 && result.latitude <= 71 &&
        result.longitude >= -25 && result.longitude <= 45
      );

      const finalResult = europeanResults.length > 0 ? europeanResults[0] : results[0];
      const { latitude, longitude } = finalResult;

      addressCache.set(address, { lat: latitude, lon: longitude, timestamp: now });
      return { latitude, longitude };
    }
  } catch (error) {
    console.warn("Échec du géocodage de l'adresse:", address, error);
  }
  return null;
};

// Calculer la distance entre deux points (formule de Haversine)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

// Fonction pour vider le cache des adresses
export const clearAddressCache = (): void => {
  addressCache.clear();
  lastLocationCache = null;
  console.log("Cache des adresses vidé");
};

// Formater la distance pour l'affichage
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
};

