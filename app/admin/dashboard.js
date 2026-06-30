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
import { COLORS } from "../../constants/theme";

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
              <UserCheck size={26} color={COLORS.primaryDark} />
            </View>
          </View>

          {/* Hero card: biru cerah + aksen lingkaran biru muda & pink */}
          <View style={styles.heroCard}>
            <View style={styles.heroDecorBig} />
            <View style={styles.heroDecorSmall} />

            <View style={styles.heroTop}>
              <View style={styles.heroIcon}>
                <Wallet size={22} color={COLORS.primaryDark} />
              </View>

              <View style={styles.heroBadge}>
                <Sparkles size={14} color={COLORS.primaryLight} />
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
                <CreditCard size={22} color={COLORS.accentDark} />
              </View>

              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>
                  {menungguVerifikasi} Pembayaran Menunggu
                </Text>
                <Text style={styles.noticeText}>
                  Periksa bukti pembayaran dari penghuni.
                </Text>
              </View>

              <ArrowRight size={22} color={COLORS.accentDark} />
            </TouchableOpacity>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ringkasan Kost</Text>
            <Text style={styles.sectionSubtitle}>Data operasional hari ini</Text>
          </View>

          <View style={styles.grid}>
            <StatCard
              Icon={Users}
              tone="blue"
              value={totalPenghuni}
              label="Total Penghuni"
            />

            <StatCard
              Icon={UserCheck}
              tone="blue"
              value={penghuniAktif}
              label="Penghuni Aktif"
            />

            <StatCard
              Icon={DoorOpen}
              tone="pink"
              value={kamarKosong}
              label="Kamar Kosong"
            />

            <StatCard
              Icon={DoorOpen}
              tone="blue"
              value={kamarTerisi}
              label="Kamar Terisi"
            />

            <StatCard
              Icon={CreditCard}
              tone="pink"
              value={belumBayar}
              label="Tagihan Aktif"
            />

            <StatCard
              Icon={CreditCard}
              tone="pink"
              value={menungguVerifikasi}
              label="Menunggu Verifikasi"
            />

            <StatCard
              Icon={Wallet}
              tone="pink"
              value={`Rp ${totalTunggakan.toLocaleString("id-ID")}`}
              label="Total Tunggakan"
            />

            <StatCard
              Icon={Wrench}
              tone="blue"
              value={keluhanAktif}
              label="Keluhan Aktif"
            />
          </View>

          <TouchableOpacity
            style={styles.simpleButton}
            onPress={() => router.push("/admin/sederhana")}
          >
            <View style={styles.simpleIcon}>
              <Eye size={22} color={COLORS.white} />
            </View>

            <View style={styles.simpleContent}>
              <Text style={styles.simpleTitle}>Mode Sederhana</Text>
              <Text style={styles.simpleDesc}>
                Tampilan besar dan mudah untuk pemilik kost
              </Text>
            </View>

            <ArrowRight size={22} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <RotateCcw size={18} color={COLORS.white} />
            <Text style={styles.resetText}>Reset Data Lokal</Text>
          </TouchableOpacity>
        </ScrollView>

        <AdminBottomTabs />
      </View>
    </ProtectedRoute>
  );
}

const TONES = {
  blue: { tint: COLORS.primaryTint, border: COLORS.primary, icon: COLORS.primaryDark },
  pink: { tint: COLORS.accentTint, border: COLORS.accent, icon: COLORS.accentDark },
};

function StatCard({ Icon, tone = "blue", value, label }) {
  const t = TONES[tone];
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: t.tint, borderColor: t.border }]}>
        <Icon size={22} color={t.icon} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.gray,
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: COLORS.dark,
    marginTop: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primaryDark,
    overflow: "hidden",
  },
  heroDecorBig: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.6,
  },
  heroDecorSmall: {
    position: "absolute",
    bottom: -24,
    right: 14,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.accent,
    opacity: 0.85,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 12,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
  },
  heroValue: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "600",
    marginTop: 6,
  },
  heroNote: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  noticeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    flexDirection: "row",
    alignItems: "center",
  },
  noticeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accentTint,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    color: COLORS.dark,
    fontWeight: "600",
    fontSize: 15,
  },
  noticeText: {
    color: COLORS.gray,
    marginTop: 3,
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.dark,
  },
  sectionSubtitle: {
    color: COLORS.gray,
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
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.dark,
  },
  statLabel: {
    color: COLORS.gray,
    marginTop: 4,
    fontSize: 13,
  },
  simpleButton: {
    backgroundColor: COLORS.dark,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  simpleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  simpleContent: {
    flex: 1,
  },
  simpleTitle: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  simpleDesc: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
  },
  resetButton: {
    backgroundColor: COLORS.gray,
    padding: 14,
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  resetText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "600",
  },
});