import { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import { validatePassword } from "../../services/storage/authStorage";
import { styles } from "./styles/input.styles";

interface PasswordInputProps {
    readonly label: string;
    readonly value: string;
    readonly onChangeText: (text: string) => void;
    readonly placeholder?: string;
    readonly showValidation?: boolean;
    readonly confirmPassword?: string;
    readonly onValidationChange?: (isValid: boolean) => void;
}

export default function PasswordInput({
    label,
    value,
    onChangeText,
    placeholder = "••••••••",
    showValidation = false,
    confirmPassword,
    onValidationChange,
}: PasswordInputProps) {
    const validation = validatePassword(value);
    const passwordsMatch = confirmPassword !== undefined ? value === confirmPassword : true;
    const overallValid = validation.isValid && passwordsMatch;

    // Notifier le parent des changements de validation avec useEffect
    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(overallValid);
        }
    }, [onValidationChange, overallValid]);

    const getValidationIcon = (isValid: boolean) => (isValid ? "✅" : "❌");
    const getValidationColor = (isValid: boolean) => (isValid ? "#4CAF50" : "#F44336");

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />

            {showValidation && value.length > 0 && (
                <View style={styles.validationContainer}>
                    <Text style={styles.validationTitle}>Exigences du mot de passe :</Text>

                    <View style={styles.validationRow}>
                        <Text style={[styles.validationIcon, { color: getValidationColor(validation.hasMinLength) }]}>
                            {getValidationIcon(validation.hasMinLength)}
                        </Text>
                        <Text style={[styles.validationText, { color: getValidationColor(validation.hasMinLength) }]}>
                            Au moins 8 caractères
                        </Text>
                    </View>

                    <View style={styles.validationRow}>
                        <Text style={[styles.validationIcon, { color: getValidationColor(validation.hasUppercase) }]}>
                            {getValidationIcon(validation.hasUppercase)}
                        </Text>
                        <Text style={[styles.validationText, { color: getValidationColor(validation.hasUppercase) }]}>
                            Au moins 1 majuscule
                        </Text>
                    </View>

                    <View style={styles.validationRow}>
                        <Text style={[styles.validationIcon, { color: getValidationColor(validation.hasSpecialChar) }]}>
                            {getValidationIcon(validation.hasSpecialChar)}
                        </Text>
                        <Text style={[styles.validationText, { color: getValidationColor(validation.hasSpecialChar) }]}>
                            Au moins 1 caractère spécial (!@#$%^&*...)
                        </Text>
                    </View>

                    {confirmPassword !== undefined && (
                        <View style={styles.validationRow}>
                            <Text style={[styles.validationIcon, { color: getValidationColor(passwordsMatch) }]}>
                                {getValidationIcon(passwordsMatch)}
                            </Text>
                            <Text style={[styles.validationText, { color: getValidationColor(passwordsMatch) }]}>
                                Les mots de passe correspondent
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}
