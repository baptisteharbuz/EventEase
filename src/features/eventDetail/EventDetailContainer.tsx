import { Animated, View } from "react-native";
import { useSwipeAnimations } from "../../animations/swipeAnimations";
import BottomTabBar from "../../components/BottomTabBar";
import type { Screen } from "../../navigation/hooks/useAppNavigation";

interface EventDetailContainerProps {
  readonly screen: React.ReactNode;
  readonly previousScreenComponent: React.ReactNode;
  readonly previousScreen: Screen | null;
  readonly isTransitioning: boolean;
  readonly onNavigateToEvents: () => void;
  readonly onNavigateToCalendar: () => void;
  readonly onNavigateToAdd: () => void;
  readonly onNavigateToLiked: () => void;
  readonly onLogout: () => void;
  readonly getCurrentTabForScreen: (screen?: Screen) => "events" | "calendar" | "add" | "liked" | "logout";
}

export default function EventDetailContainer({
  screen,
  previousScreenComponent,
  previousScreen,
  isTransitioning,
  onNavigateToEvents,
  onNavigateToCalendar,
  onNavigateToAdd,
  onNavigateToLiked,
  onLogout,
  getCurrentTabForScreen,
}: EventDetailContainerProps) {
  const {
    previousPageOpacity,
    previousPageTranslateX,
    previousPageScale,
    detailPageOpacity,
  } = useSwipeAnimations();

  return (
    <View style={{ flex: 1 }}>
      {/* Page précédente en arrière-plan avec animations */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: previousPageOpacity,
          transform: [{ translateX: previousPageTranslateX }, { scale: previousPageScale }],
        }}
      >
        {previousScreenComponent}
        <BottomTabBar
          currentTab={getCurrentTabForScreen(previousScreen || "events")}
          onNavigateToEvents={() => !isTransitioning && onNavigateToEvents()}
          onNavigateToCalendar={() => !isTransitioning && onNavigateToCalendar()}
          onNavigateToAdd={() => !isTransitioning && onNavigateToAdd()}
          onNavigateToLiked={() => !isTransitioning && onNavigateToLiked()}
          onLogout={onLogout}
        />
      </Animated.View>

      {/* Page de détail avec animation d'opacité */}
      <Animated.View
        style={{
          flex: 1,
          opacity: detailPageOpacity,
        }}
      >
        {screen}
      </Animated.View>
    </View>
  );
}