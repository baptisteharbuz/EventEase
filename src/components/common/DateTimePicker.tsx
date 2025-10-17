import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable, Text, View } from "react-native";

import { styles } from "./styles/datePicker.styles";

interface DateTimePickerProps {
    readonly label: string;
    readonly value: Date;
    readonly onChange: (date: Date) => void;
    readonly show?: boolean;
    readonly onToggle?: () => void;
    readonly mode: "date" | "time";
}

export default function DateTimePickerComponent({ label, value, onChange, show = false, onToggle, mode }: DateTimePickerProps) {
    const handleChange = (_event: any, selectedDate?: Date) => {
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDateOnly = (date: Date) => {
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const displayValue = mode === "date" ? formatDateOnly(value) : formatTime(value);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Pressable onPress={onToggle} style={styles.input}>
                <Text style={styles.text}>{displayValue}</Text>
            </Pressable>

            {show && (
                <View style={styles.pickerWrapper}>
                    <DateTimePicker
                        value={value}
                        mode={mode}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleChange}
                        locale="fr-FR"
                        is24Hour={mode === "time" ? true : undefined}
                        themeVariant="dark"
                        style={styles.picker}
                    />
                </View>
            )}
        </View>
    );
}
