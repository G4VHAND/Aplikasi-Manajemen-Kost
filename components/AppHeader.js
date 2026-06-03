import { StyleSheet, Text, View } from "react-native";

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
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    color: "#64748B",
    marginTop: 4,
    fontSize: 15,
  },
});