import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CreditCard,
  DoorOpen,
  RotateCcw,
  UserCheck,
  Users,
  Wallet,
  Wrench
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function AdminDashboard() {
  const { logout, resetData, penghuni, kamar, pembayaran, keluhan } = useApp();

  const totalPenghuni = penghuni.length;

  const penghuniAktif = penghuni.filter(
    (item) => item.status === "Aktif"
  ).length;

  const kamarKosong = kamar.filter(
    (item) => item.status === "Kosong"
  ).length;

  const belumBayar = pembayaran.filter(
    (item) => item.status !== "Lunas"
  ).length;

  const keluhanAktif = keluhan.filter(
    (item) => item.status !== "Selesai"
  ).length;

  const totalPemasukan = pembayaran
    .filter((item) => item.status === "Lunas")
    .reduce((total, item) => total + item.jumlah, 0);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleReset = () => {
    Alert.alert("Reset Data", "Yakin ingin menghapus semua data lokal?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await resetData();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ProtectedRoute role="admin">
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Halo, Admin</Text>
              <Text style={styles.title}>Dashboard Kost</Text>
            </View>

            <View style={styles.avatar}>
              <UserCheck size={26} color="#2563EB" />
            </View>
          </View>

          <View style={styles.incomeCard}>
            <View style={styles.incomeIcon}>
              <Wallet size={28} color="#FFFFFF" />
            </View>

            <Text style={styles.incomeLabel}>Total Pemasukan Lunas</Text>

            <Text style={styles.incomeValue}>
              Rp {totalPemasukan.toLocaleString("id-ID")}
            </Text>

            <Text style={styles.incomeNote}>
              Berdasarkan pembayaran dengan status lunas
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Ringkasan Kost</Text>

          <View style={styles.grid}>
            <StatCard
              Icon={Users}
              color="#2563EB"
              value={totalPenghuni}
              label="Total Penghuni"
            />

            <StatCard
              Icon={UserCheck}
              color="#16A34A"
              value={penghuniAktif}
              label="Penghuni Aktif"
            />

            <StatCard
              Icon={DoorOpen}
              color="#F59E0B"
              value={kamarKosong}
              label="Kamar Kosong"
            />

            <StatCard
              Icon={CreditCard}
              color="#EF4444"
              value={belumBayar}
              label="Belum Bayar"
            />

            <View style={styles.statCardFull}>
              <View style={styles.statIconBox}>
                <Wrench size={28} color="#8B5CF6" />
              </View>

              <Text style={styles.statValue}>{keluhanAktif}</Text>
              <Text style={styles.statLabel}>Keluhan Masih Aktif</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <RotateCcw size={18} color="#FFFFFF" />
            <Text style={styles.resetText}>Reset Data Lokal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.simpleButton}
            onPress={() => router.push("/admin/sederhana")}
          >
            <Text style={styles.simpleText}>Mode Sederhana</Text>
          </TouchableOpacity>
        </ScrollView>

        <AdminBottomTabs />
      </View>
    </ProtectedRoute>
  );
}

function StatCard({ Icon, color, value, label }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconBox}>
        <Icon size={28} color={color} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  },
  header: {
    marginTop: 45,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    color: "#64748B",
    fontSize: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 4,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  incomeCard: {
    backgroundColor: "#2563EB",
    borderRadius: 26,
    padding: 22,
    marginBottom: 24,
  },
  incomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  incomeLabel: {
    color: "#DBEAFE",
    fontSize: 14,
  },
  incomeValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
  incomeNote: {
    color: "#BFDBFE",
    marginTop: 8,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statCardFull: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statLabel: {
    color: "#64748B",
    marginTop: 4,
    fontSize: 13,
  },
  resetButton: {
    backgroundColor: "#64748B",
    padding: 15,
    borderRadius: 16,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  resetText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  simpleButton: {
  backgroundColor: "#0F172A",
  padding: 16,
  borderRadius: 16,
  marginBottom: 12,
},
simpleText: {
  color: "#FFFFFF",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: 16,
},
});