import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import type { WeatherData } from "../../../services/api/weatherService";
import { getWeatherForDate } from "../../../services/api/weatherService";
import { styles } from "../styles/weatherWidget.styles";

interface WeatherWidgetProps {
    readonly location?: string;
    readonly date: string;
}

export default function WeatherWidget({ location, date }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!location) {
                setLoading(false);
                return;
            }

            try {
                const data = await getWeatherForDate(date, location);
                setWeather(data);
                setError(!data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [date, location]);

    if (!location) {
        return null;
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color="#fff" />
            </View>
        );
    }

    if (error || !weather) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>⚠️ Météo non disponible</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🌤️ Météo prévue</Text>
                <Text style={styles.subtitle}>({location})</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.temperature}>{weather.temperature}°C</Text>
                <Text style={styles.description}>{weather.description}</Text>
                <View style={styles.details}>
                    <Text style={styles.detailText}>🌧️ Précipitations: {weather.precipitationProbability}%</Text>
                    <Text style={styles.detailText}>💨 Vent: {weather.windSpeed} km/h</Text>
                </View>
            </View>
        </View>
    );
}
