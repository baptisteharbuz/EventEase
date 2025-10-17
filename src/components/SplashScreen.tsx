import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, useWindowDimensions, View } from "react-native";
import { createRotateInterpolation, createSplashAnimation, defaultSplashConfig } from "../animations/splashAnimation";
import { BACKGROUND_GRADIENT_COLORS, BACKGROUND_GRADIENT_LOCATIONS } from "./style/background.styles";
import { styles } from "./style/splash.styles";

const LOGO = require("../../assets/EventEase.png");

interface SplashScreenProps {
    readonly onAnimationComplete?: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
    const { width } = useWindowDimensions();
    const logoSize = width * 0.4;
    const rotateValue = useRef(new Animated.Value(0)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = createSplashAnimation(rotateValue, scaleValue, defaultSplashConfig);
        animation.start();

        const timer = setTimeout(() => {
            onAnimationComplete?.();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [rotateValue, scaleValue, onAnimationComplete]);

    const rotate = createRotateInterpolation(rotateValue);
    const scale = scaleValue;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={BACKGROUND_GRADIENT_COLORS}
                locations={BACKGROUND_GRADIENT_LOCATIONS}
                start={{ x: 0, y: 0.7 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientFill}
            />

            <View style={styles.logoContainer}>
                <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
                    <Image source={LOGO} style={[styles.logo, { width: logoSize, height: logoSize }]} contentFit="contain" />
                </Animated.View>
            </View>
        </View>
    );
}
