import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  validationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
},
validationTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#fff",
    marginBottom: 8,
},
validationRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 4,
},
validationIcon: {
    fontSize: 14,
    marginRight: 8,
},
validationText: {
    fontSize: 14,
    flex: 1,
},
});

