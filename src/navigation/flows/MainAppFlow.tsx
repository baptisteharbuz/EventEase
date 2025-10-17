import { useState } from "react";
import { Alert, View } from "react-native";
import { useSwipeAnimations } from "../../animations/swipeAnimations";
import BottomTabBar from "../../components/BottomTabBar";
import { useAuth } from "../../contexts/AuthContext";
import EventDetailContainer from "../../features/eventDetail/EventDetailContainer";
import EventDetailScreen from "../../features/eventDetail/EventDetailScreen";
import AddEventScreen from "../../features/events/AddEventScreen";
import CalendarScreen from "../../features/events/CalendarScreen";
import EventsListScreen from "../../features/events/EventsListScreen";
import LikedEventsScreen from "../../features/events/LikedEventsScreen";
import { useAppNavigation } from "../hooks/useAppNavigation";

export default function MainAppFlow() {
  const { logout } = useAuth();

  const [shouldRefreshEvents, setShouldRefreshEvents] = useState(false);

  const {
    currentScreen,
    previousScreen,
    selectedEvent,
    isTransitioning,
    handleNavigateToDetail,
    handleNavigateToEdit,
    handleNavigateBack,
    navigateToScreen,
    getCurrentTabForScreen,
    shouldShowTabs,
  } = useAppNavigation();

  // Hook d'animations pour les transitions de swipe
  const { handleSwipeProgress, animateBack, resetAnimations } = useSwipeAnimations();

  // Gère la déconnexion avec confirmation utilisateur
  const handleLogoutWithConfirmation = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: () => {
          logout().then(() => {
            navigateToScreen("login");
          });
        },
      },
    ]);
  };

  // Gère la navigation retour avec animations de swipe
  const handleNavigateBackWithAnimation = () => {
    const completeNavigation = handleNavigateBack(
      () => resetAnimations(),
      () => {}
    );

    if (completeNavigation) {
      animateBack(completeNavigation);
    }
  };

  // Rendu conditionnel de l'écran précédent pour les animations
  const renderPreviousScreen = () => {
    if (!previousScreen) return null;

    switch (previousScreen) {
      case "events":
        return (
          <EventsListScreen
            onNavigateToDetail={handleNavigateToDetail}
            forceRefresh={shouldRefreshEvents}
            onRefreshComplete={handleRefreshComplete}
          />
        );
      case "calendar":
        return <CalendarScreen onNavigateToDetail={handleNavigateToDetail} />;
      case "liked":
        return <LikedEventsScreen onNavigateToDetail={handleNavigateToDetail} />;
      default:
        return null;
    }
  };

  // Gère le retour depuis l'écran d'ajout d'événement avec refresh
  const handleNavigateBackFromAddEvent = () => {
    setShouldRefreshEvents(true);
    navigateToScreen("events");
  };

  // Reset le flag de refresh après completion
  const handleRefreshComplete = () => {
    setShouldRefreshEvents(false);
  };

  // Fonction principale de rendu des écrans selon l'état de navigation
  const renderScreen = () => {
    switch (currentScreen) {
      case "addEvent":
        return <AddEventScreen onNavigateBack={handleNavigateBackFromAddEvent} />;

      case "editEvent":
        return <AddEventScreen onNavigateBack={handleNavigateBackFromAddEvent} eventToEdit={selectedEvent} />;

      case "eventDetail":
        return selectedEvent ? (
          <EventDetailScreen
            event={selectedEvent}
            onNavigateBack={handleNavigateBackWithAnimation}
            onNavigateToEdit={handleNavigateToEdit}
            onSwipeProgress={handleSwipeProgress}
          />
        ) : (
          // Fallback si pas d'événement sélectionné
          <EventsListScreen
            onNavigateToDetail={handleNavigateToDetail}
            forceRefresh={shouldRefreshEvents}
            onRefreshComplete={handleRefreshComplete}
          />
        );

      case "calendar":
        return <CalendarScreen onNavigateToDetail={handleNavigateToDetail} />;

      case "liked":
        return <LikedEventsScreen onNavigateToDetail={handleNavigateToDetail} />;

      default:
        // Écran par défaut : liste des événements
        return (
          <EventsListScreen
            onNavigateToDetail={handleNavigateToDetail}
            forceRefresh={shouldRefreshEvents}
            onRefreshComplete={handleRefreshComplete}
          />
        );
    }
  };

  // Composants rendus pour l'écran actuel et précédent
  const screen = renderScreen();
  const previousScreenComponent = renderPreviousScreen();

  if (!shouldShowTabs) {
    return screen;
  }

  // Rendu spécial pour EventDetail avec animations
  if (currentScreen === "eventDetail" && previousScreenComponent) {
    return (
      <EventDetailContainer
        screen={screen}
        previousScreenComponent={previousScreenComponent}
        previousScreen={previousScreen}
        isTransitioning={isTransitioning}
        onNavigateToEvents={() => navigateToScreen("events")}
        onNavigateToCalendar={() => navigateToScreen("calendar")}
        onNavigateToAdd={() => navigateToScreen("addEvent")}
        onNavigateToLiked={() => navigateToScreen("liked")}
        onLogout={handleLogoutWithConfirmation}
        getCurrentTabForScreen={getCurrentTabForScreen}
      />
    );
  }

  // Rendu normal pour les autres écrans
  return (
    <View style={{ flex: 1 }}>
      {screen}
      <BottomTabBar
        currentTab={getCurrentTabForScreen()}
        onNavigateToEvents={() => navigateToScreen("events")}
        onNavigateToCalendar={() => navigateToScreen("calendar")}
        onNavigateToAdd={() => navigateToScreen("addEvent")}
        onNavigateToLiked={() => navigateToScreen("liked")}
        onLogout={handleLogoutWithConfirmation}
      />
    </View>
  );
}