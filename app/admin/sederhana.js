import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  CreditCard,
  LogOut,
  Megaphone,
  Users,
  Wrench,
} from "lucide-react-native";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function AdminSederhana() {
  const { logout } = useApp();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ProtectedRoute role="admin">
      <View style={styles.container}>
        <Text style={styles.title}>Mode Sederhana</Text>

        <Text style={styles.subtitle}>
          Menu cepat untuk pemilik kost
        </Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/admin/penghuni?from=sederhana")}
        >
          <Users size={34} color="#2563EB" />
          <Text style={styles.menuText}>
            Data Penghuni
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/admin/pembayaran?from=sederhana")}
        >
          <CreditCard size={34} color="#16A34A" />
          <Text style={styles.menuText}>
            Verifikasi Pembayaran
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/admin/keluhan?from=sederhana")}
        >
          <Wrench size={34} color="#F59E0B" />
          <Text style={styles.menuText}>
            Keluhan Penghuni
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/admin/pengumuman?from=sederhana")}
        >
          <Megaphone size={34} color="#8B5CF6" />
          <Text style={styles.menuText}>
            Pengumuman
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={28} color="#FFFFFF" />
          <Text style={styles.logoutText}>
            Keluar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/admin/dashboard")}
        >
          <Text style={styles.backText}>
            Kembali ke Dashboard Lengkap
          </Text>
        </TouchableOpacity>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0F172A",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 8,
    marginBottom: 30,
    fontSize: 16,
  },

  menuButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  menuText: {
    marginLeft: 18,
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    borderRadius: 24,
    padding: 22,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  backButton: {
    marginTop: 16,
    padding: 16,
  },

  backText: {
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 16,
  },
});