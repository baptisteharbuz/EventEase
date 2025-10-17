import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";

import Navbar from "./Navbar";
import { BACKGROUND_GRADIENT_COLORS, BACKGROUND_GRADIENT_LOCATIONS, styles } from "./style/background.styles";

const LOGO = require("../../assets/EventEase.png");

interface BackgroundProps {
    readonly children?: ReactNode;
    readonly showNavbar?: boolean;
}

export default function Background({ children, showNavbar = true }: BackgroundProps) {
    const { width } = useWindowDimensions();
    const backgroundLogoSize = width * 0.9;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={BACKGROUND_GRADIENT_COLORS}
                locations={BACKGROUND_GRADIENT_LOCATIONS}
                start={{ x: 0, y: 0.7 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientFill}
            />

            <Image
                source={LOGO}
                style={[styles.backgroundLogo, { width: backgroundLogoSize, height: backgroundLogoSize }]}
                contentFit="contain"
            />

            {showNavbar && (
                <View style={styles.safeArea}>
                    <Navbar />
                </View>
            )}

            <View style={styles.contentContainer}>{children}</View>
        </View>
    );
}
