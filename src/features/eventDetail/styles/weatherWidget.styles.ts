import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(17, 164, 255, 1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  content: {
    alignItems: "center",
  },
  temperature: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    textTransform: "capitalize",
    marginBottom: 12,
  },
  details: {
    flexDirection: "row",
    gap: 20,
  },
  detailText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  errorText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    textAlign: "center",
  },
});

