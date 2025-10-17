import { Animated } from "react-native";

export const defaultSplashConfig = {
  rotationDuration: 1500,
  pauseDuration: 500,
  scaleIntensity: {
    initial: 1.1,
    compressed: 0.8,
    final: 1.1,
    bounce: 1.04,
  },
  timings: {
    initialStretch: 200,
    compression: 400,
    finalStretch: 400,
    stabilization: 500,
    bounceUp: 150,
    bounceDown: 350,
  },
};

export const createSplashAnimation = (
  rotateValue: Animated.Value,
  scaleValue: Animated.Value,
  config = defaultSplashConfig
) => {
  return Animated.loop(
    Animated.sequence([
      // Déformation pendant la rotation
      Animated.parallel([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: config.rotationDuration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          // Étirement en début de rotation
          Animated.timing(scaleValue, {
            toValue: config.scaleIntensity.initial,
            duration: config.timings.initialStretch,
            useNativeDriver: true,
          }),
          // Compression au milieu
          Animated.timing(scaleValue, {
            toValue: config.scaleIntensity.compressed,
            duration: config.timings.compression,
            useNativeDriver: true,
          }),
          // Étirement à la fin
          Animated.timing(scaleValue, {
            toValue: config.scaleIntensity.final,
            duration: config.timings.finalStretch,
            useNativeDriver: true,
          }),
          // Stabilisation
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: config.timings.stabilization,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Remise en position initiale
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      // Pause avec léger rebond de récupération
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: config.scaleIntensity.bounce,
          duration: config.timings.bounceUp,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: config.timings.bounceDown,
          useNativeDriver: true,
        }),
      ]),
    ])
  );
};

export const createRotateInterpolation = (rotateValue: Animated.Value) => {
  return rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
};