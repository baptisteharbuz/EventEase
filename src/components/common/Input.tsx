import { Text, TextInput, View } from "react-native";

import { styles } from "./styles/input.styles";

interface InputProps {
    readonly label: string;
    readonly value: string;
    readonly onChangeText: (text: string) => void;
    readonly placeholder?: string;
    readonly secureTextEntry?: boolean;
    readonly multiline?: boolean;
    readonly numberOfLines?: number;
    readonly onFocus?: () => void;
}

export default function Input({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    multiline = false,
    numberOfLines = 1,
    onFocus,
}: InputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && styles.multiline]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                numberOfLines={numberOfLines}
                onFocus={onFocus}
            />
        </View>
    );
}
