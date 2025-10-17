import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Alert, Pressable, Text, View } from "react-native";

import { styles } from "./styles/imagePicker.styles";

interface ImagePickerProps {
    readonly label: string;
    readonly imageUri?: string;
    readonly onImageSelected: (uri: string) => void;
}

export default function ImagePickerComponent({ label, imageUri, onImageSelected }: ImagePickerProps) {
    const pickImage = async () => {
        // Demander la permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission refusée", "Nous avons besoin de votre permission pour accéder aux photos");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        Alert.alert("Supprimer l'image", "Voulez-vous retirer l'image de cet événement ?", [
            { text: "Annuler", style: "cancel" },
            { text: "Supprimer", style: "destructive", onPress: () => onImageSelected("") },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            {imageUri ? (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
                    <Pressable onPress={removeImage} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>✕ Retirer</Text>
                    </Pressable>
                    <Pressable onPress={pickImage} style={styles.changeButton}>
                        <Text style={styles.changeButtonText}>Changer l image</Text>
                    </Pressable>
                </View>
            ) : (
                <Pressable onPress={pickImage} style={styles.uploadButton}>
                    <Text style={styles.uploadIcon}>📷</Text>
                    <Text style={styles.uploadText}>Ajouter une image</Text>
                </Pressable>
            )}
        </View>
    );
}
