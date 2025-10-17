// Service pour récupérer la météo via Open-Meteo API
// API 100% gratuite, sans inscription, sans carte bancaire !
// Documentation: https://open-meteo.com/

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
}

// Convertir le code météo en description française
const getWeatherDescription = (weatherCode: number): string => {
  const weatherCodes: Record<number, string> = {
    0: "Ciel dégagé",
    1: "Plutôt dégagé",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard",
    48: "Brouillard givrant",
    51: "Bruine légère",
    53: "Bruine modérée",
    55: "Bruine dense",
    61: "Pluie légère",
    63: "Pluie modérée",
    65: "Pluie forte",
    71: "Neige légère",
    73: "Neige modérée",
    75: "Neige forte",
    80: "Averses légères",
    81: "Averses modérées",
    82: "Averses violentes",
    95: "Orage",
    96: "Orage avec grêle",
  };
  return weatherCodes[weatherCode] || "Temps variable";
};

export const getWeatherForDate = async (
  date: string,
  location: string = "Paris"
): Promise<WeatherData | null> => {
  try {
    // 1. Géocoder la ville pour obtenir lat/lon
    const geoResponse = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(location)}&count=1&language=fr`);

    if (!geoResponse.ok) {
      console.error("Erreur géocodage:", geoResponse.status);
      return null;
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      console.error("Ville non trouvée");
      return null;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Récupérer la météo pour cette date
    const eventDate = new Date(date);
    const dateString = eventDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

    // Vérifier si la date est dans les limites de l'API (16 jours max dans le futur)
    const today = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setDate(today.getDate() + 16);

    const minPastDate = new Date();
    minPastDate.setDate(today.getDate() - 90); // 3 mois dans le passé

    if (eventDate > maxFutureDate) {
      console.warn("⚠️ Date trop loin dans le futur pour les prévisions météo (max 16 jours)");
      return null;
    }

    if (eventDate < minPastDate) {
      console.warn("⚠️ Date trop ancienne pour les données météo historiques");
      return null;
    }

    const weatherUrl = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,windspeed_10m_max&timezone=Europe/Paris&start_date=${dateString}&end_date=${dateString}`;

    console.log("🌤️ Weather URL:", weatherUrl);
    console.log("📅 Date string:", dateString);
    console.log("📍 Coordinates:", { latitude, longitude });

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      console.error("Erreur API météo:", weatherResponse.status);
      const errorText = await weatherResponse.text();
      console.error("Erreur détails:", errorText);
      return null;
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.daily) {
      return null;
    }

    const tempMax = Math.round(weatherData.daily.temperature_2m_max[0]);
    const tempMin = Math.round(weatherData.daily.temperature_2m_min[0]);
    const avgTemp = Math.round((tempMax + tempMin) / 2);

    return {
      temperature: avgTemp,
      description: getWeatherDescription(weatherData.daily.weathercode[0]),
      humidity: 0, // Non disponible dans cette API gratuite
      windSpeed: Math.round(weatherData.daily.windspeed_10m_max[0]),
      precipitationProbability: weatherData.daily.precipitation_probability_max[0] || 0,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de la météo:", error);
    return null;
  }
};

