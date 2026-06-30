import { StyleSheet, View } from "react-native";
import { COLORS, SIZES } from "../constants/theme";

export default function AppCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radiusSm,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});