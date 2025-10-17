import { useCallback, useState } from "react";
import type { Event } from "../../services/storage/eventStorage";

export type Screen = "login" | "signup" | "events" | "addEvent" | "editEvent" | "eventDetail" | "calendar" | "liked";

export const useAppNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("events");
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigateToDetail = useCallback((event: Event) => {
    setPreviousScreen(currentScreen);
    setSelectedEvent(event);
    setCurrentScreen("eventDetail");
  }, [currentScreen]);

  const handleNavigateToEdit = useCallback((event: Event) => {
    setPreviousScreen(currentScreen);
    setSelectedEvent(event);
    setCurrentScreen("editEvent");
  }, [currentScreen]);

  const handleNavigateBack = useCallback((onAnimationStart?: () => void, onAnimationComplete?: () => void) => {
    if (previousScreen && !isTransitioning) {
      setIsTransitioning(true);
      onAnimationStart?.();

      const completeNavigation = () => {
        setCurrentScreen(previousScreen);
        setPreviousScreen(null);
        if (currentScreen === "eventDetail" || currentScreen === "editEvent") {
          setSelectedEvent(undefined);
        }
        setIsTransitioning(false);
        onAnimationComplete?.();
      };

      return completeNavigation;
    }
    return undefined;
  }, [previousScreen, currentScreen, isTransitioning]);

  const navigateToScreen = useCallback((screen: Screen) => {
    if (!isTransitioning) {
      setCurrentScreen(screen);
    }
  }, [isTransitioning]);

  const handleLoginSuccess = useCallback(() => {
    setCurrentScreen("events");
  }, []);

  const handleSignupSuccess = useCallback(() => {
    setCurrentScreen("events");
  }, []);

  const getCurrentTabForScreen = useCallback((screen?: Screen): "events" | "calendar" | "add" | "liked" | "logout" => {
    const screenToCheck = screen || currentScreen;
    switch (screenToCheck) {
      case "calendar":
        return "calendar";
      case "addEvent":
      case "editEvent":
        return "add";
      case "liked":
        return "liked";
      default:
        return "events";
    }
  }, [currentScreen]);

  const shouldShowTabs = ["events", "calendar", "addEvent", "editEvent", "liked", "eventDetail"].includes(currentScreen);

  return {
    currentScreen,
    previousScreen,
    selectedEvent,
    isTransitioning,
    handleNavigateToDetail,
    handleNavigateToEdit,
    handleNavigateBack,
    navigateToScreen,
    handleLoginSuccess,
    handleSignupSuccess,
    getCurrentTabForScreen,
    shouldShowTabs,
    setCurrentScreen,
  };
};