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
  CheckCircle,
  CreditCard,
  DoorOpen,
  LogOut,
  MessageSquareWarning,
  UserCircle,
  Wallet,
} from "lucide-react-native";

import ProtectedRoute from "../../components/ProtectedRoute";
import UserBottomTabs from "../../components/UserBottomTabs";
import { useApp } from "../../context/AppContext";

export default function UserDashboard() {
  const { logout, user, pembayaran, keluhan, pengumuman } = useApp();

  const tagihanSaya = pembayaran.filter((item) => item.user_id === user?.id);

  const tagihanAktif = tagihanSaya.filter(
    (item) => item.status !== "Lunas"
  ).length;

  const totalSisaTagihan = tagihanSaya
    .filter((item) => item.status !== "Lunas")
    .reduce(
      (total, item) => total + Number(item.remaining_amount ?? item.jumlah),
      0
    );

  const pembayaranLunas = tagihanSaya.filter(
    (item) => item.status === "Lunas"
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
              <Text style={styles.greeting}>Selamat datang</Text>
              <Text style={styles.title}>{user?.nama || "Penghuni"}</Text>
            </View>

            <View style={styles.avatar}>
              <UserCircle size={30} color="#16A34A" />
            </View>
          </View>

          <View style={styles.roomCard}>
            <View style={styles.roomTop}>
              <View style={styles.roomIcon}>
                <DoorOpen size={30} color="#FFFFFF" />
              </View>

              <View style={styles.statusBadge}>
                <CheckCircle size={14} color="#DCFCE7" />
                <Text style={styles.statusBadgeText}>
                  {user?.status || "Aktif"}
                </Text>
              </View>
            </View>

            <Text style={styles.roomLabel}>Kamar Anda</Text>
            <Text style={styles.roomValue}>Kamar {user?.kamar || "-"}</Text>
            <Text style={styles.roomNote}>
              Pantau tagihan, pembayaran, keluhan, dan informasi kost.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paymentSummary,
              totalSisaTagihan > 0
                ? styles.paymentWarning
                : styles.paymentSuccess,
            ]}
            onPress={() => router.push("/user/tagihan")}
          >
            <View style={styles.paymentSummaryIcon}>
              <Wallet
                size={28}
                color={totalSisaTagihan > 0 ? "#D97706" : "#16A34A"}
              />
            </View>

            <View style={styles.paymentSummaryContent}>
              <Text
                style={[
                  styles.paymentSummaryTitle,
                  totalSisaTagihan > 0
                    ? styles.warningText
                    : styles.successText,
                ]}
              >
                {totalSisaTagihan > 0
                  ? "Ada Tagihan Aktif"
                  : "Pembayaran Aman"}
              </Text>

              <Text
                style={[
                  styles.paymentSummaryValue,
                  totalSisaTagihan > 0
                    ? styles.warningText
                    : styles.successText,
                ]}
              >
                {totalSisaTagihan > 0
                  ? `Rp ${totalSisaTagihan.toLocaleString("id-ID")}`
                  : "Tidak ada tunggakan"}
              </Text>

              <Text
                style={[
                  styles.paymentSummaryNote,
                  totalSisaTagihan > 0
                    ? styles.warningText
                    : styles.successText,
                ]}
              >
                Ketuk untuk melihat detail tagihan
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Ringkasan Anda</Text>

          <View style={styles.grid}>
            <StatCard
              Icon={CreditCard}
              color="#2563EB"
              value={tagihanAktif}
              label="Tagihan Aktif"
            />

            <StatCard
              Icon={CheckCircle}
              color="#16A34A"
              value={pembayaranLunas}
              label="Pembayaran Lunas"
            />

            <StatCard
              Icon={MessageSquareWarning}
              color="#F59E0B"
              value={keluhanAktif}
              label="Keluhan Aktif"
            />

            <StatCard
              Icon={DoorOpen}
              color="#8B5CF6"
              value={user?.kamar || "-"}
              label="Kamar"
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
        <Icon size={25} color={color} />
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
    paddingBottom: 110,
  },
  header: {
    marginTop: 48,
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
    fontSize: 29,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  roomCard: {
    backgroundColor: "#16A34A",
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
  },
  roomTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  roomIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusBadgeText: {
    color: "#DCFCE7",
    fontSize: 12,
    fontWeight: "bold",
  },
  roomLabel: {
    color: "#DCFCE7",
    fontSize: 14,
  },
  roomValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 8,
  },
  roomNote: {
    color: "#DCFCE7",
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  paymentSummary: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  paymentWarning: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D",
  },
  paymentSuccess: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },
  paymentSummaryIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  paymentSummaryContent: {
    flex: 1,
  },
  paymentSummaryTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  paymentSummaryValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
  paymentSummaryNote: {
    fontSize: 12,
    marginTop: 3,
  },
  warningText: {
    color: "#92400E",
  },
  successText: {
    color: "#166534",
  },
  sectionTitle: {
    fontSize: 21,
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
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 13,
  },
  statIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },
  statValue: {
    fontSize: 24,
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
    borderRadius: 18,
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