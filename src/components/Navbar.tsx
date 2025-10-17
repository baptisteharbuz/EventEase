import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { NAVBAR_GRADIENT_COLORS, NAVBAR_GRADIENT_LOCATIONS, styles } from "./style/navbar.styles";

const LOGO = require("../../assets/EventEase.png");

export default function Navbar() {
    return (
        <View style={styles.shadowContainer}>
            <LinearGradient
                colors={NAVBAR_GRADIENT_COLORS}
                locations={NAVBAR_GRADIENT_LOCATIONS}
                start={{ x: 1.4, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Image source={LOGO} style={styles.logo} contentFit="contain" />
                </View>
            </LinearGradient>
        </View>
    );
}
