import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.25)",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: "30%",
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  likeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  heartFull: {
    fontSize: 24,
    color: "#FF4444",
  },
  heartEmpty: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  mapPreview: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  description: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});

