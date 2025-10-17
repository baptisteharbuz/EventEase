import { useMemo, useRef } from "react";
import { Alert, Animated, PanResponder } from "react-native";

// ===== TYPES =====

export interface SwipeNavigationConfig {
  onNavigateBack: () => void;
  scrollEnabled?: boolean;
  onSwipeProgress?: (progress: number) => void;
}

export interface SwipeCardConfig {
  onToggleParticipation: () => void;
  onDelete: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  canDelete?: boolean;
}

// ===== CONSTANTES =====

const DEFAULT_THRESHOLD = 100;
const DEFAULT_EXIT_DISTANCE = 400;
const DEFAULT_ANIMATION_DURATION = 200;
const DEFAULT_TERMINATE_DURATION = 100;

// ===== ANIMATIONS DE BASE =====

export const createSwipeRightAnimation = (
  translateX: Animated.Value,
  onComplete: () => void
) => {
  return Animated.timing(translateX, {
    toValue: DEFAULT_EXIT_DISTANCE,
    duration: DEFAULT_ANIMATION_DURATION,
    useNativeDriver: false,
  }).start(() => {
    setTimeout(onComplete, 50);
  });
};

export const createReturnAnimation = (
  translateX: Animated.Value
) => {
  return Animated.timing(translateX, {
    toValue: 0,
    duration: DEFAULT_ANIMATION_DURATION,
    useNativeDriver: false,
  }).start();
};

export const createTerminateAnimation = (
  translateX: Animated.Value,
  backgroundColor?: Animated.Value,
  duration: number = DEFAULT_TERMINATE_DURATION
) => {
  const animations = [
    Animated.timing(translateX, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    })
  ];

  if (backgroundColor) {
    animations.push(
      Animated.timing(backgroundColor, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      })
    );
  }

  return Animated.parallel(animations).start();
};

// ===== HOOK POUR NAVIGATION (Swipe droite simple) =====

export const useSwipeNavigation = ({
  onNavigateBack,
  scrollEnabled = true,
  onSwipeProgress,
}: SwipeNavigationConfig) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const isRightSwipe = gestureState.dx > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        return scrollEnabled && isRightSwipe;
      },

      onPanResponderGrant: () => {
        translateX.setOffset(0);
      },

      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
          // Calculer le progrès du swipe (0 à 1)
          const progress = Math.min(gestureState.dx / DEFAULT_EXIT_DISTANCE, 1);
          onSwipeProgress?.(progress);
        }
      },

      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx > DEFAULT_THRESHOLD) {
          createSwipeRightAnimation(translateX, onNavigateBack);
        } else {
          createReturnAnimation(translateX);
          onSwipeProgress?.(0);
        }
      },

      onPanResponderTerminate: () => {
        createTerminateAnimation(translateX);
        onSwipeProgress?.(0);
      },
    })
  ).current;

  return {
    translateX,
    panResponder,
  };
};

// ===== HOOK POUR CARTES (Swipe bidirectionnel avec couleurs) =====

export const useSwipeCard = ({
  onToggleParticipation,
  onDelete,
  onSwipeStart,
  onSwipeEnd,
  canDelete = false,
}: SwipeCardConfig) => {
  const statusOpacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  // Animation de status
  const showStatusAnimation = () => {
    Animated.sequence([
      Animated.timing(statusOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(statusOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Gestes de swipe
  const handleSwipeRight = () => {
    onToggleParticipation();
    showStatusAnimation();
  };

  const handleSwipeLeft = () => {
    Alert.alert("Supprimer", "Voulez-vous vraiment supprimer cet événement ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: onDelete
      },
    ]);
  };

  const panResponder = useMemo(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const hasEnoughDistance = Math.abs(gestureState.dx) > 15;
        return isHorizontal && hasEnoughDistance;
      },

      onMoveShouldSetPanResponderCapture: (_evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
      },

      onPanResponderGrant: () => {
        onSwipeStart?.();
        translateX.setOffset(0);
        backgroundColor.setOffset(0);
      },

      onPanResponderMove: (_evt, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          translateX.setValue(gestureState.dx);

          const maxSwipe = 120;
          let progress = gestureState.dx / maxSwipe;

          if (!canDelete && progress < 0) {
            progress = 0;
          }

          progress = Math.max(-1, Math.min(1, progress));
          backgroundColor.setValue(progress);
        }
      },

      onPanResponderRelease: (_evt, gestureState) => {
        onSwipeEnd?.();

        if (gestureState.dx > 80) {
          handleSwipeRight();
        } else if (gestureState.dx < -80 && canDelete) {
          handleSwipeLeft();
        } else {
          return
        }

        // Retour à la position initiale
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: DEFAULT_ANIMATION_DURATION,
            useNativeDriver: false,
          }),
          Animated.timing(backgroundColor, {
            toValue: 0,
            duration: DEFAULT_ANIMATION_DURATION,
            useNativeDriver: false,
          }),
        ]).start();
      },

      onPanResponderTerminate: () => {
        onSwipeEnd?.();
        createTerminateAnimation(translateX, backgroundColor);
      },
    }),
    [canDelete, onSwipeStart, onSwipeEnd, onToggleParticipation, onDelete]
  );

  // Style animé pour le fond
  const animatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["rgba(244, 67, 54, 1)", "rgba(0, 0, 0, 0)", "rgba(76, 175, 80, 1)"],
    extrapolate: "clamp",
  });

  return {
    statusOpacity,
    translateX,
    backgroundColor,
    panResponder,
    showStatusAnimation,
    animatedBackgroundColor,
  };
};