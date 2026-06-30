import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, SIZES } from "../constants/theme";

export default function AppButton({ title, onPress, color = COLORS.primary }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: SIZES.radiusSm,
    marginTop: 10,
  },
  text: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "600",
  },
});