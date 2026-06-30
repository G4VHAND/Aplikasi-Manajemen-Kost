import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
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
  const { pembayaran, user, ajukanPembayaran, refreshData } = useApp();
  const [nominalBayar, setNominalBayar] = useState({});

  const tagihanUser = pembayaran.filter((item) => item.user_id === user?.id);

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );

  const getNominal = (item) => {
    const value = nominalBayar[item.id];
    return Number(value || 0);
  };

  const validasiNominal = (item) => {
    const nominal = getNominal(item);

    if (!nominal || nominal <= 0) {
      Alert.alert("Peringatan", "Masukkan nominal pembayaran terlebih dahulu");
      return null;
    }

    const batasBayar =
      item.status === "Kurang Bayar"
        ? item.remaining_amount
        : item.jumlah;

    if (nominal > batasBayar) {
      Alert.alert("Peringatan", "Nominal pembayaran melebihi sisa tagihan");
      return null;
    }

    return nominal;
  };

  const bayarTunai = async (item) => {
    const nominal = validasiNominal(item);
    if (!nominal) return;

    try {
      await ajukanPembayaran(item.id, "Tunai", nominal);
      Alert.alert("Berhasil", "Pembayaran tunai menunggu verifikasi admin");
    } catch (error) {
      console.log("TUNAI ERROR:", error?.response?.data || error.message);
      Alert.alert("Gagal", "Gagal mengajukan pembayaran tunai");
    }
  };

  const uploadBuktiTransfer = async (item) => {
    const nominal = validasiNominal(item);
    if (!nominal) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;

    try {
      await ajukanPembayaran(item.id, "Transfer", nominal, result.assets[0]);
      Alert.alert("Berhasil", "Bukti transfer berhasil dikirim");
    } catch (error) {
      console.log("TRANSFER ERROR:", error?.response?.data || error.message);
      Alert.alert("Gagal", "Upload bukti pembayaran gagal");
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
              <ArrowLeft size={22} color="#1B2A47" />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.title}>Tagihan</Text>
              <Text style={styles.subtitle}>Status pembayaran kost Anda</Text>
            </View>

            <View style={styles.headerIcon}>
              <CreditCard size={24} color="#4F8EF7" />
            </View>
          </View>

          <FlatList
            data={tagihanUser}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <CreditCard size={42} color="#9AACC9" />
                <Text style={styles.emptyTitle}>Belum ada tagihan</Text>
                <Text style={styles.empty}>
                  Tagihan pembayaran kost akan tampil di sini.
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const nominalInput = getNominal(item);
              const sisaPreview =
                nominalInput > 0 ? item.jumlah - nominalInput : item.jumlah;

              return (
                <View style={styles.card}>
                  <View style={styles.paymentHeader}>
                    <View style={styles.paymentIcon}>
                      <Wallet size={26} color="#4F8EF7" />
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
                          : item.status === "Kurang Bayar"
                          ? styles.badgeLess
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
                            : item.status === "Kurang Bayar"
                            ? styles.badgeTextLess
                            : styles.badgeTextUnpaid,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.amountBox}>
                    <Text style={styles.amountLabel}>Total Tagihan</Text>
                    <Text style={styles.amountValue}>
                      Rp {item.jumlah.toLocaleString("id-ID")}
                    </Text>

                    <View style={styles.infoRow}>
                      <User size={17} color="#6B7A94" />
                      <Text style={styles.infoText}>Nama: {item.nama}</Text>
                    </View>

                    <Text style={styles.methodText}>
                      Jumlah bulan: {item.month_count || 1} bulan
                    </Text>

                    <Text style={styles.methodText}>
                      Dibayar: Rp {(item.paid_amount || 0).toLocaleString("id-ID")}
                    </Text>

                    <Text style={styles.methodText}>
                      Sisa:
                      {item.remaining_amount > 0
                        ? ` Rp ${item.remaining_amount.toLocaleString("id-ID")}`
                        : " -"}
                    </Text>

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

                  {(item.status === "Belum Bayar" || item.status === "Kurang Bayar") && (
                    <View style={styles.paymentInputBox}>
                      <Text style={styles.inputLabel}>Nominal Dibayar</Text>

                      <TextInput
                        style={styles.input}
                        placeholder="Contoh: 1000000"
                        keyboardType="numeric"
                        value={nominalBayar[item.id] || ""}
                        onChangeText={(value) =>
                          setNominalBayar({
                            ...nominalBayar,
                            [item.id]: value.replace(/[^0-9]/g, ""),
                          })
                        }
                      />

                      <Text style={styles.previewText}>
                        Perkiraan sisa: Rp{" "}
                        {Math.max(sisaPreview, 0).toLocaleString("id-ID")}
                      </Text>

                      <TouchableOpacity
                        style={styles.cashButton}
                        onPress={() => bayarTunai(item)}
                      >
                        <Banknote size={18} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Bayar Tunai</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.transferButton}
                        onPress={() => uploadBuktiTransfer(item)}
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

                  {item.status === "Kurang Bayar" && (
                    <View style={styles.lessBox}>
                      <Clock size={18} color="#DC2626" />
                      <Text style={styles.lessText}>
                        Pembayaran kurang Rp{" "}
                        {(item.remaining_amount || 0).toLocaleString("id-ID")}
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
              );
            }}
          />
        </View>

        <UserBottomTabs />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#EAF2FE" },
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
    borderColor: "#D9E5FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: { flex: 1 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#E6F0FE",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#1B2A47" },
  subtitle: { color: "#6B7A94", marginTop: 3, fontSize: 13 },
  listContent: { paddingBottom: 30 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D9E5FA",
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
    backgroundColor: "#E6F0FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  paymentInfo: { flex: 1 },
  month: { fontWeight: "bold", fontSize: 18, color: "#1B2A47" },
  name: { color: "#6B7A94", marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgePaid: { backgroundColor: "#DCFCE7" },
  badgeVerify: { backgroundColor: "#E6F0FE" },
  badgeLess: { backgroundColor: "#FEE2E2" },
  badgeUnpaid: { backgroundColor: "#FEF3C7" },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  badgeTextPaid: { color: "#16A34A" },
  badgeTextVerify: { color: "#4F8EF7" },
  badgeTextLess: { color: "#DC2626" },
  badgeTextUnpaid: { color: "#D97706" },
  amountBox: {
    backgroundColor: "#EAF2FE",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  amountLabel: { color: "#6B7A94", fontSize: 13 },
  amountValue: {
    color: "#1B2A47",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  infoText: { marginLeft: 8, color: "#28395A" },
  methodText: { color: "#6B7A94", marginTop: 8 },
  proofBox: {
    backgroundColor: "#EAF2FE",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  proofTitle: {
    fontWeight: "bold",
    color: "#1B2A47",
    marginBottom: 8,
  },
  proofImage: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    backgroundColor: "#D9E5FA",
  },
  paymentInputBox: {
    backgroundColor: "#EAF2FE",
    padding: 14,
    borderRadius: 18,
  },
  inputLabel: {
    fontWeight: "bold",
    color: "#1B2A47",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C7D7F5",
    padding: 13,
    borderRadius: 14,
    marginBottom: 8,
  },
  previewText: {
    color: "#6B7A94",
    marginBottom: 12,
    fontWeight: "600",
  },
  cashButton: {
    backgroundColor: "#16A34A",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  transferButton: {
    backgroundColor: "#4F8EF7",
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
  lessBox: {
    backgroundColor: "#FEE2E2",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  lessText: { color: "#DC2626", fontWeight: "bold" },
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
    borderColor: "#D9E5FA",
    alignItems: "center",
    marginTop: 30,
  },
  emptyTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1B2A47",
    marginTop: 12,
  },
  empty: { textAlign: "center", marginTop: 6, color: "#6B7A94" },
});