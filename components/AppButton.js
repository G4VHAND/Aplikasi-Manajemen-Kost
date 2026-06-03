import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AppButton({ title, onPress, color = "#2563EB" }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  text: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});