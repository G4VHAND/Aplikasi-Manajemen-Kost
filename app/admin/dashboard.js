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
  ArrowRight,
  CreditCard,
  DoorOpen,
  Eye,
  RotateCcw,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function AdminDashboard() {
  const { resetData, penghuni, kamar, pembayaran, keluhan } = useApp();

  const totalPenghuni = penghuni.length;
  const penghuniAktif = penghuni.filter((item) => item.status === "Aktif").length;
  const kamarKosong = kamar.filter((item) => item.status === "Kosong").length;
  const kamarTerisi = kamar.filter((item) => item.status === "Terisi").length;
  const belumBayar = pembayaran.filter((item) => item.status !== "Lunas").length;
  const menungguVerifikasi = pembayaran.filter(
    (item) => item.status === "Menunggu Verifikasi"
  ).length;
  const keluhanAktif = keluhan.filter((item) => item.status !== "Selesai").length;

  const totalPemasukan = pembayaran
    .filter((item) => item.status === "Lunas")
    .reduce((total, item) => total + item.jumlah, 0);

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

  const totalTunggakan = pembayaran
  .filter((item) => item.status !== "Lunas")
  .reduce((total, item) => total + (item.remaining_amount || item.jumlah), 0);

  return (
    <ProtectedRoute role="admin">
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Selamat datang kembali</Text>
              <Text style={styles.title}>Dashboard Admin</Text>
            </View>

            <View style={styles.avatar}>
              <UserCheck size={26} color="#2563EB" />
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.heroIcon}>
                <Wallet size={30} color="#FFFFFF" />
              </View>

              <View style={styles.heroBadge}>
                <Sparkles size={14} color="#DBEAFE" />
                <Text style={styles.heroBadgeText}>KostKu</Text>
              </View>
            </View>

            <Text style={styles.heroLabel}>Total Pemasukan Lunas</Text>
            <Text style={styles.heroValue}>
              Rp {totalPemasukan.toLocaleString("id-ID")}
            </Text>
            <Text style={styles.heroNote}>
              Berdasarkan pembayaran yang sudah diverifikasi admin
            </Text>
          </View>

          {menungguVerifikasi > 0 && (
            <TouchableOpacity
              style={styles.noticeCard}
              onPress={() => router.push("/admin/pembayaran")}
            >
              <View style={styles.noticeIcon}>
                <CreditCard size={24} color="#D97706" />
              </View>

              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>
                  {menungguVerifikasi} Pembayaran Menunggu
                </Text>
                <Text style={styles.noticeText}>
                  Periksa bukti pembayaran dari penghuni.
                </Text>
              </View>

              <ArrowRight size={22} color="#D97706" />
            </TouchableOpacity>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ringkasan Kost</Text>
            <Text style={styles.sectionSubtitle}>Data operasional hari ini</Text>
          </View>

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
              Icon={DoorOpen}
              color="#8B5CF6"
              value={kamarTerisi}
              label="Kamar Terisi"
            />

            <StatCard
              Icon={CreditCard}
              color="#EF4444"
              value={belumBayar}
              label="Tagihan Aktif"
            />

            <StatCard
              Icon={CreditCard}
              color="#2563EB"
              value={menungguVerifikasi}
              label="Menunggu Verifikasi"
            />

            <StatCard
              Icon={Wallet}
              color="#DC2626"
              value={`Rp ${totalTunggakan.toLocaleString("id-ID")}`}
              label="Total Tunggakan"
            />

            <StatCard
              Icon={Wrench}
              color="#0EA5E9"
              value={keluhanAktif}
              label="Keluhan Aktif"
            />
          </View>

          <TouchableOpacity
            style={styles.simpleButton}
            onPress={() => router.push("/admin/sederhana")}
          >
            <View style={styles.simpleIcon}>
              <Eye size={24} color="#FFFFFF" />
            </View>

            <View style={styles.simpleContent}>
              <Text style={styles.simpleTitle}>Mode Sederhana</Text>
              <Text style={styles.simpleDesc}>
                Tampilan besar dan mudah untuk pemilik kost
              </Text>
            </View>

            <ArrowRight size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <RotateCcw size={18} color="#FFFFFF" />
            <Text style={styles.resetText}>Reset Data Lokal</Text>
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
  content: {
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
    fontSize: 31,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: "#DBEAFE",
    fontWeight: "bold",
    fontSize: 12,
  },
  heroLabel: {
    color: "#DBEAFE",
    fontSize: 14,
  },
  heroValue: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "bold",
    marginTop: 8,
  },
  heroNote: {
    color: "#BFDBFE",
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  noticeCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 24,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#FCD34D",
    flexDirection: "row",
    alignItems: "center",
  },
  noticeIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#FFFBEB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    color: "#92400E",
    fontWeight: "bold",
    fontSize: 16,
  },
  noticeText: {
    color: "#92400E",
    marginTop: 3,
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0F172A",
  },
  sectionSubtitle: {
    color: "#64748B",
    marginTop: 3,
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    fontSize: 27,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statLabel: {
    color: "#64748B",
    marginTop: 4,
    fontSize: 13,
  },
  simpleButton: {
    backgroundColor: "#0F172A",
    borderRadius: 26,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  simpleIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  simpleContent: {
    flex: 1,
  },
  simpleTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
  },
  simpleDesc: {
    color: "#CBD5E1",
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
  },
  resetButton: {
    backgroundColor: "#64748B",
    padding: 15,
    borderRadius: 18,
    marginTop: 4,
    marginBottom: 20,
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
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
  },
});