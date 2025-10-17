import { StyleSheet } from "react-native";

export const NAVBAR_GRADIENT_COLORS = [
  "rgba(253, 29, 29, 0.85)",
  "rgba(252, 176, 69, 0.85)",
  "rgba(255, 255, 0, 0.85)",
] as const;

export const NAVBAR_GRADIENT_LOCATIONS = [0.15, 0.81, 1] as const;

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 50,
  },
  shadowContainer: {
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 7,
  },
  content: {
    alignItems: "center",
  },
  logo: {
    height: 90,
    width: 130,
  },
});
