import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 100,
    // padding: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
  },
  form: {
    gap: 12,
  },
  mapPreview: {
    marginVertical: 8,
  },
  mapLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
});

