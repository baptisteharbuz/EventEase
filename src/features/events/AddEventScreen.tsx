import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Background from "../../components/Background";
import Button from "../../components/common/Button";
import DateTimePickerComponent from "../../components/common/DateTimePicker";
import ImagePickerComponent from "../../components/common/ImagePicker";
import Input from "../../components/common/Input";
import { useCurrentUserId } from "../../contexts/AuthContext";
import { geocodeAddress, getCurrentLocation } from "../../services/api/locationService";
import type { Event } from "../../services/storage/eventStorage";
import { saveEvent, updateEvent } from "../../services/storage/eventStorage";
import { styles } from "./styles/addEvent.styles";

interface AddEventScreenProps {
    readonly onNavigateBack: () => void;
    readonly eventToEdit?: Event;
}

export default function AddEventScreen({ onNavigateBack, eventToEdit }: AddEventScreenProps) {
    const currentUserId = useCurrentUserId();
    const [title, setTitle] = useState(eventToEdit?.title || "");
    const [description, setDescription] = useState(eventToEdit?.description || "");

    // Initialiser la date à partir de l'événement ou aujourd'hui
    const initialDate = eventToEdit?.date ? new Date(eventToEdit.date) : new Date();
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [selectedTime, setSelectedTime] = useState(initialDate);

    const [location, setLocation] = useState(eventToEdit?.location || "");
    const [latitude, setLatitude] = useState<number | undefined>(eventToEdit?.latitude);
    const [longitude, setLongitude] = useState<number | undefined>(eventToEdit?.longitude);
    const [imageUri, setImageUri] = useState<string>(eventToEdit?.imageUri || "");
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // État pour les coordonnées geocodées à partir de l'adresse
    const [previewCoords, setPreviewCoords] = useState<{ latitude: number; longitude: number } | null>(
        eventToEdit?.latitude != null && eventToEdit?.longitude != null
            ? { latitude: eventToEdit.latitude, longitude: eventToEdit.longitude }
            : null
    );

    // Géocoder automatiquement l'adresse quand elle change
    useEffect(() => {
        let isMounted = true;
        const debounceTimer = setTimeout(async () => {
            if (location && location.trim().length > 3) {
                const coords = await geocodeAddress(location);
                if (isMounted && coords) {
                    setPreviewCoords(coords);
                    setLatitude(coords.latitude);
                    setLongitude(coords.longitude);
                }
            } else if (location.trim().length === 0) {
                if (isMounted && !locationLoading) {
                    setPreviewCoords(null);
                    setLatitude(undefined);
                    setLongitude(undefined);
                }
            }
        }, 1000);

        return () => {
            isMounted = false;
            clearTimeout(debounceTimer);
        };
    }, [location, locationLoading]);

    const handleSave = async () => {
        if (!title || !description) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
            return;
        }

        if (!currentUserId) {
            Alert.alert("Erreur", "Vous devez être connecté pour créer un événement");
            return;
        }

        setLoading(true);

        try {
            const combinedDateTime = new Date(selectedDate);
            combinedDateTime.setHours(selectedTime.getHours());
            combinedDateTime.setMinutes(selectedTime.getMinutes());

            const dateString = combinedDateTime.toISOString();

            if (eventToEdit) {
                // Modification
                const updatedEvent: Event = {
                    ...eventToEdit,
                    title,
                    description,
                    date: dateString,
                    location: location || undefined,
                    latitude,
                    longitude,
                    imageUri: imageUri || undefined,
                };
                await updateEvent(updatedEvent);
            } else {
                // Création
                const newEvent: Event = {
                    id: Date.now().toString(),
                    title,
                    description,
                    date: dateString,
                    location: location || undefined,
                    latitude,
                    longitude,
                    imageUri: imageUri || undefined,
                    createdBy: currentUserId,
                };
                await saveEvent(newEvent);
            }

            Alert.alert("Succès", eventToEdit ? "Événement modifié !" : "Événement créé !", [
                { text: "OK", onPress: () => {} },
            ]);

            onNavigateBack();
        } catch {
            Alert.alert("Erreur", "Impossible de sauvegarder l'événement");
        } finally {
            setLoading(false);
        }
    };

    const handleGetCurrentLocation = async () => {
        setLocationLoading(true);
        const locationData = await getCurrentLocation();
        setLocationLoading(false);

        if (locationData) {
            setLocation(locationData.address || "Localisation actuelle");
            setLatitude(locationData.latitude);
            setLongitude(locationData.longitude);
            setPreviewCoords({ latitude: locationData.latitude, longitude: locationData.longitude });
        } else {
            Alert.alert("Erreur", "Impossible de récupérer votre position");
        }
    };

    return (
        <Background showNavbar={false}>
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Pressable
                            style={styles.container}
                            onPress={() => {
                                setShowDatePicker(false);
                                setShowTimePicker(false);
                            }}
                        >
                            <View style={styles.card}>
                                <Text style={styles.title}>{eventToEdit ? "Modifier l'événement" : "Nouvel événement"}</Text>

                                <View style={styles.form}>
                                    <Input
                                        label="Titre *"
                                        value={title}
                                        onChangeText={setTitle}
                                        placeholder="Nom de l'événement"
                                        onFocus={() => {
                                            setShowDatePicker(false);
                                            setShowTimePicker(false);
                                        }}
                                    />

                                    <Input
                                        label="Description *"
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholder="Décrivez votre événement"
                                        multiline
                                        numberOfLines={4}
                                        onFocus={() => {
                                            setShowDatePicker(false);
                                            setShowTimePicker(false);
                                        }}
                                    />

                                    <DateTimePickerComponent
                                        label="Date *"
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        show={showDatePicker}
                                        mode="date"
                                        onToggle={() => {
                                            setShowTimePicker(false);
                                            setShowDatePicker(!showDatePicker);
                                        }}
                                    />

                                    <DateTimePickerComponent
                                        label="Heure *"
                                        value={selectedTime}
                                        onChange={setSelectedTime}
                                        show={showTimePicker}
                                        mode="time"
                                        onToggle={() => {
                                            setShowDatePicker(false);
                                            setShowTimePicker(!showTimePicker);
                                        }}
                                    />

                                    <Input
                                        label="Lieu (optionnel)"
                                        value={location}
                                        onChangeText={setLocation}
                                        placeholder="Paris, France"
                                        onFocus={() => {
                                            setShowDatePicker(false);
                                            setShowTimePicker(false);
                                        }}
                                    />

                                    {/* Aperçu de la carte si des coordonnées sont disponibles */}
                                    {previewCoords && (
                                        <View style={styles.mapPreview}>
                                            <Text style={styles.mapLabel}>📍 Aperçu du lieu</Text>
                                            <MapView
                                                key={`${previewCoords.latitude}-${previewCoords.longitude}`}
                                                style={styles.map}
                                                pointerEvents="none"
                                                initialRegion={{
                                                    latitude: previewCoords.latitude,
                                                    longitude: previewCoords.longitude,
                                                    latitudeDelta: 0.01,
                                                    longitudeDelta: 0.01,
                                                }}
                                            >
                                                <Marker
                                                    coordinate={{
                                                        latitude: previewCoords.latitude,
                                                        longitude: previewCoords.longitude,
                                                    }}
                                                />
                                            </MapView>
                                        </View>
                                    )}

                                    <Button
                                        title="📍 Utiliser ma position actuelle"
                                        onPress={() => {
                                            setShowDatePicker(false);
                                            setShowTimePicker(false);
                                            handleGetCurrentLocation();
                                        }}
                                        loading={locationLoading}
                                        variant="secondary"
                                    />

                                    <ImagePickerComponent
                                        label="Image (optionnel)"
                                        imageUri={imageUri}
                                        onImageSelected={setImageUri}
                                    />

                                    <Button
                                        title={eventToEdit ? "Modifier" : "Créer"}
                                        onPress={() => {
                                            setShowDatePicker(false);
                                            setShowTimePicker(false);
                                            handleSave();
                                        }}
                                        loading={loading}
                                    />

                                    <Button
                                        title="Annuler"
                                        onPress={() => {
                                            setShowDatePicker(false);
                                            setShowTimePicker(false);
                                            onNavigateBack();
                                        }}
                                        variant="secondary"
                                    />
                                </View>
                            </View>
                        </Pressable>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Background>
    );
}
