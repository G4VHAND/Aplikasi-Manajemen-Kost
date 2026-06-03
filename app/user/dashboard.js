import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Bell,
  CreditCard,
  DoorOpen,
  LogOut,
  MessageSquareWarning,
  UserCircle,
} from "lucide-react-native";

import ProtectedRoute from "../../components/ProtectedRoute";
import UserBottomTabs from "../../components/UserBottomTabs";
import { useApp } from "../../context/AppContext";

export default function UserDashboard() {
  const { logout, user, pembayaran, keluhan, pengumuman } = useApp();

  const tagihanAktif = pembayaran.filter(
    (item) => item.nama === user?.nama && item.status !== "Lunas"
  ).length;

  const keluhanAktif = keluhan.filter(
    (item) => item.email === user?.email && item.status !== "Selesai"
  ).length;

  const pengumumanTerbaru = pengumuman[0];

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ProtectedRoute role="user">
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Halo, Penghuni</Text>
              <Text style={styles.title}>{user?.nama || "Penghuni"}</Text>
            </View>

            <View style={styles.avatar}>
              <UserCircle size={30} color="#16A34A" />
            </View>
          </View>

          <View style={styles.roomCard}>
            <View style={styles.roomIcon}>
              <DoorOpen size={30} color="#FFFFFF" />
            </View>

            <Text style={styles.roomLabel}>Kamar Anda</Text>
            <Text style={styles.roomValue}>Kamar {user?.kamar || "-"}</Text>
            <Text style={styles.roomNote}>
              Pantau tagihan, keluhan, dan informasi kost melalui aplikasi.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Ringkasan Anda</Text>

          <View style={styles.grid}>
            <StatCard
              Icon={CreditCard}
              color="#2563EB"
              value={tagihanAktif}
              label="Tagihan Aktif"
            />

            <StatCard
              Icon={MessageSquareWarning}
              color="#F59E0B"
              value={keluhanAktif}
              label="Keluhan Aktif"
            />
          </View>

          <Text style={styles.sectionTitle}>Pengumuman Terbaru</Text>

          <View style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
              <View style={styles.announcementIcon}>
                <Bell size={24} color="#EF4444" />
              </View>

              <View style={styles.announcementInfo}>
                <Text style={styles.announcementTitle}>
                  {pengumumanTerbaru?.judul || "Belum ada pengumuman"}
                </Text>

                <Text style={styles.announcementText}>
                  {pengumumanTerbaru?.isi ||
                    "Pengumuman dari admin akan tampil di sini."}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>

        <UserBottomTabs />
      </View>
    </ProtectedRoute>
  );
}

function StatCard({ Icon, color, value, label }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconBox}>
        <Icon size={26} color={color} />
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
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 100,
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 4,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  roomCard: {
    backgroundColor: "#16A34A",
    borderRadius: 26,
    padding: 22,
    marginBottom: 24,
  },
  roomIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  roomLabel: {
    color: "#DCFCE7",
    fontSize: 14,
  },
  roomValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
  roomNote: {
    color: "#DCFCE7",
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
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
  announcementCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  announcementIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  announcementInfo: {
    flex: 1,
  },
  announcementTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 6,
  },
  announcementText: {
    color: "#64748B",
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 16,
    marginTop: 4,
    marginBottom: 20,
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
});