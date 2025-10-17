import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

import Background from "../../components/Background";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import { useAuth } from "../../contexts/AuthContext";
import { isValidEmail, login } from "../../services/storage/authStorage";
import { styles } from "./styles/auth.styles";

interface LoginScreenProps {
    readonly onLoginSuccess: () => void;
    readonly onNavigateToSignup: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToSignup }: LoginScreenProps) {
    const { login: authLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Erreur", "Veuillez saisir un email valide");
            return;
        }

        setLoading(true);
        const user = await login(email, password);
        setLoading(false);

        if (user) {
            authLogin(user);
            onLoginSuccess();
        } else {
            Alert.alert("Erreur", "Email ou mot de passe incorrect. Vérifiez vos identifiants ou créez un compte.");
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
                            <Text style={styles.title}>Connexion</Text>
                            <Text style={styles.subtitle}>Bienvenue sur EventEase</Text>

                            <View style={styles.form}>
                                <Input label="Email" value={email} onChangeText={setEmail} placeholder="votre@email.com" />

                                <PasswordInput
                                    label="Mot de passe"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                />

                                <Button title="Se connecter" onPress={handleLogin} loading={loading} />

                                <Button title="Créer un compte" onPress={onNavigateToSignup} variant="secondary" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Background>
    );
}
