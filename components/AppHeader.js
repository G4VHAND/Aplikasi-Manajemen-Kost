import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function AppHeader({ title, subtitle }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.dark,
  },
  subtitle: {
    color: COLORS.gray,
    marginTop: 4,
    fontSize: 14,
  },
});