import { StyleSheet } from "react-native";

export const BACKGROUND_GRADIENT_COLORS = [
  "rgb(255, 0, 119)",
  "rgba(253, 29, 29, 1)",
  "rgba(252, 176, 69, 1)",
] as const;

export const BACKGROUND_GRADIENT_LOCATIONS = [0, 0.51, 0.82] as const;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff00ee",
  },
  gradientFill: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundLogo: {
    position: "absolute",
    opacity: 0.2,
    alignSelf: "center",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    zIndex: 1,
  },
});
