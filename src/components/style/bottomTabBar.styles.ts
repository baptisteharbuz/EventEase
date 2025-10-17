import { StyleSheet } from "react-native";
import { NAVBAR_GRADIENT_COLORS } from "./navbar.styles";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  addTab: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -8,
  },
  addTabActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -8,
  },
  tabText: {
    color: "rgba(152, 152, 152, 0.7)",
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  activeTabText: {
    color: NAVBAR_GRADIENT_COLORS[0]
  },
  // Icon colors
  iconActive: {
    color: NAVBAR_GRADIENT_COLORS[0]
  },
  iconInactive: {
    color: "rgba(152, 152, 152, 0.7)",
  },
  iconPrimary: {
    color: NAVBAR_GRADIENT_COLORS[0],
  },
});