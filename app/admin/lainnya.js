import { router } from "expo-router";
import {
  Bell,
  LogOut,
  MessageSquareWarning,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function AdminLainnya() {
  const { logout } = useApp();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ProtectedRoute role="admin">
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Menu Lainnya</Text>
          <Text style={styles.subtitle}>Kelola menu tambahan admin</Text>

          <MenuCard
            Icon={MessageSquareWarning}
            title="Keluhan Penghuni"
            desc="Pantau dan proses laporan penghuni"
            color="#8B5CF6"
            onPress={() => router.replace("/admin/keluhan")}
          />

          <MenuCard
            Icon={Bell}
            title="Pengumuman"
            desc="Buat informasi untuk penghuni kost"
            color="#EF4444"
            onPress={() => router.replace("/admin/pengumuman")}
          />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <AdminBottomTabs />
      </View>
    </ProtectedRoute>
  );
}

function MenuCard({ Icon, title, desc, color, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconBox}>
        <Icon size={24} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    color: "#64748B",
    marginTop: 4,
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0F172A",
  },
  cardDesc: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },
  arrow: {
    fontSize: 30,
    color: "#94A3B8",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 16,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});