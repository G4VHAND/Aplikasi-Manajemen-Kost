import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  Upload,
  User,
  Wallet,
} from "lucide-react-native";

import ProtectedRoute from "../../components/ProtectedRoute";
import UserBottomTabs from "../../components/UserBottomTabs";
import { useApp } from "../../context/AppContext";
import { STORAGE_URL } from "../../services/api";

export default function TagihanUser() {
  const { pembayaran, user, ajukanPembayaran } = useApp();

  const tagihanUser = pembayaran.filter((item) => item.nama === user?.nama);

  const bayarTunai = async (id) => {
    try {
      await ajukanPembayaran(id, "Tunai");
      Alert.alert("Berhasil", "Pembayaran tunai menunggu verifikasi admin");
    } catch (error) {
      Alert.alert("Gagal", "Gagal mengajukan pembayaran tunai");
    }
  };

  const uploadBuktiTransfer = async (id) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;

    const image = result.assets[0];

    console.log("IMAGE PICKER RESULT:", image);

    await ajukanPembayaran(id, "Transfer", image);

    Alert.alert("Berhasil", "Bukti transfer berhasil dikirim");
  } catch (error) {
    console.log("UPLOAD ERROR FULL:", error);
    console.log("UPLOAD ERROR RESPONSE:", error?.response?.data);
    console.log("UPLOAD ERROR MESSAGE:", error?.message);

    Alert.alert(
      "Upload Gagal",
      JSON.stringify(error?.response?.data || error?.message || error)
    );
  }
};

  return (
    <ProtectedRoute role="user">
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => router.replace("/user/dashboard")}
            >
              <ArrowLeft size={22} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.title}>Tagihan</Text>
              <Text style={styles.subtitle}>Status pembayaran kost Anda</Text>
            </View>

            <View style={styles.headerIcon}>
              <CreditCard size={24} color="#2563EB" />
            </View>
          </View>

          <FlatList
            data={tagihanUser}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <CreditCard size={42} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Belum ada tagihan</Text>
                <Text style={styles.empty}>
                  Tagihan pembayaran kost akan tampil di sini.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentIcon}>
                    <Wallet size={26} color="#2563EB" />
                  </View>

                  <View style={styles.paymentInfo}>
                    <Text style={styles.month}>{item.bulan}</Text>
                    <Text style={styles.name}>{item.nama}</Text>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      item.status === "Lunas"
                        ? styles.badgePaid
                        : item.status === "Menunggu Verifikasi"
                        ? styles.badgeVerify
                        : styles.badgeUnpaid,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        item.status === "Lunas"
                          ? styles.badgeTextPaid
                          : item.status === "Menunggu Verifikasi"
                          ? styles.badgeTextVerify
                          : styles.badgeTextUnpaid,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Jumlah Tagihan</Text>
                  <Text style={styles.amountValue}>
                    Rp {item.jumlah.toLocaleString("id-ID")}
                  </Text>

                  <View style={styles.infoRow}>
                    <User size={17} color="#64748B" />
                    <Text style={styles.infoText}>Nama: {item.nama}</Text>
                  </View>

                  <Text style={styles.methodText}>
                    Metode: {item.metode || "-"}
                  </Text>
                </View>

                {item.proof && (
                  <View style={styles.proofBox}>
                    <Text style={styles.proofTitle}>Bukti Pembayaran</Text>
                    <Image
                      source={{ uri: `${STORAGE_URL}/${item.proof}` }}
                      style={styles.proofImage}
                    />
                  </View>
                )}

                {item.status === "Belum Bayar" && (
                  <View>
                    <TouchableOpacity
                      style={styles.cashButton}
                      onPress={() => bayarTunai(item.id)}
                    >
                      <Banknote size={18} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Bayar Tunai</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.transferButton}
                      onPress={() => uploadBuktiTransfer(item.id)}
                    >
                      <Upload size={18} color="#FFFFFF" />
                      <Text style={styles.buttonText}>
                        Upload Bukti Transfer
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === "Menunggu Verifikasi" && (
                  <View style={styles.waitingBox}>
                    <Clock size={18} color="#D97706" />
                    <Text style={styles.waitingText}>
                      Menunggu verifikasi admin
                    </Text>
                  </View>
                )}

                {item.status === "Lunas" && (
                  <View style={styles.paidBox}>
                    <CheckCircle size={18} color="#16A34A" />
                    <Text style={styles.paidText}>
                      Pembayaran telah dikonfirmasi
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        </View>

        <UserBottomTabs />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1, padding: 24 },
  header: {
    marginTop: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: { flex: 1 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#0F172A" },
  subtitle: { color: "#64748B", marginTop: 3, fontSize: 13 },
  listContent: { paddingBottom: 30 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  paymentIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  paymentInfo: { flex: 1 },
  month: { fontWeight: "bold", fontSize: 18, color: "#0F172A" },
  name: { color: "#64748B", marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgePaid: { backgroundColor: "#DCFCE7" },
  badgeVerify: { backgroundColor: "#DBEAFE" },
  badgeUnpaid: { backgroundColor: "#FEF3C7" },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  badgeTextPaid: { color: "#16A34A" },
  badgeTextVerify: { color: "#2563EB" },
  badgeTextUnpaid: { color: "#D97706" },
  amountBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  amountLabel: { color: "#64748B", fontSize: 13 },
  amountValue: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  infoText: { marginLeft: 8, color: "#334155" },
  methodText: { color: "#64748B", marginTop: 8 },
  proofBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  proofTitle: {
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  proofImage: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
  },
  cashButton: {
    backgroundColor: "#16A34A",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  transferButton: {
    backgroundColor: "#2563EB",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold" },
  waitingBox: {
    backgroundColor: "#FEF3C7",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  waitingText: { color: "#D97706", fontWeight: "bold" },
  paidBox: {
    backgroundColor: "#DCFCE7",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  paidText: { color: "#16A34A", fontWeight: "bold" },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    marginTop: 30,
  },
  emptyTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#0F172A",
    marginTop: 12,
  },
  empty: { textAlign: "center", marginTop: 6, color: "#64748B" },
});