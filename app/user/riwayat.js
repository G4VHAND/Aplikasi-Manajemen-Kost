import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function RiwayatUser() {
  return (
    <ProtectedRoute role="user">
      <View style={styles.container}>
        <Text style={styles.title}>Riwayat Aktivitas</Text>

      <View style={styles.card}>
        <Text style={styles.name}>Login Aplikasi</Text>
        <Text>Tanggal: 13 Mei 2026</Text>
        <Text>Status: Berhasil</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>Mengirim Keluhan</Text>
        <Text>Keluhan: Lampu kamar mati</Text>
        <Text>Status: Terkirim</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>Melihat Tagihan</Text>
        <Text>Bulan: Mei 2026</Text>
        <Text>Status: Belum Bayar</Text>
      </View>

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>
    </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  back: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  backText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});