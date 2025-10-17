import { useCallback, useRef } from "react";
import { Animated } from "react-native";

export const useSwipeAnimations = () => {
  // Animations pour la previous page
  const previousPageOpacity = useRef(new Animated.Value(0.3)).current;
  const previousPageTranslateX = useRef(new Animated.Value(-50)).current;
  const previousPageScale = useRef(new Animated.Value(0.95)).current;

  // Animation pour la page de détail qui sort
  const detailPageOpacity = useRef(new Animated.Value(1)).current;

  // Callback pour gérer le progrès du swipe
  const handleSwipeProgress = useCallback(
    (progress: number) => {
      // Pendant le swipe, animer progressivement la page précédente
      const opacity = 0.3 + progress * 0.7; // De 0.3 à 1
      const translateX = -30 + progress * 30; // De -50 à 0
      const scale = 0.95 + progress * 0.05; // De 0.95 à 1

      previousPageOpacity.setValue(opacity);
      previousPageTranslateX.setValue(translateX);
      previousPageScale.setValue(scale);

      // Animer aussi l'opacité de la page de détail qui part
      const detailOpacity = 1 - progress * 0.3; // De 1 à 0.7
      detailPageOpacity.setValue(detailOpacity);
    },
    [previousPageOpacity, previousPageTranslateX, previousPageScale, detailPageOpacity]
  );

  // Réinitialiser les animations
  const resetAnimations = useCallback(() => {
    previousPageOpacity.setValue(0.3);
    previousPageTranslateX.setValue(-50);
    previousPageScale.setValue(0.95);
    detailPageOpacity.setValue(1);
  }, [previousPageOpacity, previousPageTranslateX, previousPageScale, detailPageOpacity]);

  // Animation complète de retour
  const animateBack = useCallback((onComplete?: () => void) => {
    Animated.parallel([
      Animated.timing(previousPageOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(previousPageTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(previousPageScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(detailPageOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onComplete?.();
      setTimeout(resetAnimations, 50);
    });
  }, [previousPageOpacity, previousPageTranslateX, previousPageScale, detailPageOpacity, resetAnimations]);

  return {
    previousPageOpacity,
    previousPageTranslateX,
    previousPageScale,
    detailPageOpacity,
    handleSwipeProgress,
    resetAnimations,
    animateBack,
  };
};