import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

import Background from "../../components/Background";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import { useAuth } from "../../contexts/AuthContext";
import { isValidEmail, signup, validatePassword } from "../../services/storage/authStorage";
import { styles } from "./styles/auth.styles";

interface SignupScreenProps {
    readonly onSignupSuccess: () => void;
    readonly onNavigateToLogin: () => void;
}

export default function SignupScreen({ onSignupSuccess, onNavigateToLogin }: SignupScreenProps) {
    const { login: authLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !name || !password || !confirmPassword) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        if (name.trim().length < 2) {
            Alert.alert("Erreur", "Le nom doit contenir au moins 2 caractères");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Erreur", "Veuillez saisir un email valide");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            Alert.alert("Erreur", "Le mot de passe ne respecte pas les exigences de sécurité");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        const user = await signup(email, name, password);
        setLoading(false);

        if (user) {
            authLogin(user);
            onSignupSuccess();
        } else {
            Alert.alert("Erreur", "Cet email est déjà utilisé. Veuillez en choisir un autre ou vous connecter.");
        }
    };

    return (
        <Background showNavbar={false}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <Text style={styles.title}>Inscription</Text>
                            <Text style={styles.subtitle}>Créez votre compte EventEase</Text>

                            <View style={styles.form}>
                                <Input label="Nom" value={name} onChangeText={setName} placeholder="Votre nom" />

                                <Input label="Email" value={email} onChangeText={setEmail} placeholder="votre@email.com" />

                                <PasswordInput
                                    label="Mot de passe"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    showValidation={true}
                                />

                                <PasswordInput
                                    label="Confirmer le mot de passe"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="••••••••"
                                    confirmPassword={password}
                                />

                                <Button title="S'inscrire" onPress={handleSignup} loading={loading} />

                                <Button title="Déjà un compte ?" onPress={onNavigateToLogin} variant="secondary" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Background>
    );
}
