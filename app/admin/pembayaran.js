import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  DoorOpen,
  Plus,
  Trash2,
  Wallet,
  X,
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { STORAGE_URL } from "../../services/api";

const daftarBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const currentYear = new Date().getFullYear();
const daftarTahun = Array.from({ length: 10 }, (_, i) =>
  String(currentYear + i)
);

export default function PembayaranAdmin() {
  const { from } = useLocalSearchParams();

  const {
    pembayaran,
    kamar,
    penghuni,
    tambahPembayaran,
    tandaiLunas,
    hapusPembayaran,
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bulanDipilih, setBulanDipilih] = useState("");
  const [tahunDipilih, setTahunDipilih] = useState("");
  const [jumlahBulan, setJumlahBulan] = useState("1");

  const [roomModal, setRoomModal] = useState(false);
  const [monthModal, setMonthModal] = useState(false);
  const [yearModal, setYearModal] = useState(false);

  const kamarTerisi = kamar.filter((item) => item.status === "Terisi");

  const penghuniKamar = selectedRoom
    ? penghuni.find((item) => item.kamar === selectedRoom.nomor)
    : null;

  const totalTagihan =
    selectedRoom && jumlahBulan
      ? selectedRoom.harga * Number(jumlahBulan)
      : 0;

  const handleBack = () => {
    if (from === "sederhana") {
      router.replace("/admin/sederhana");
    } else {
      router.replace("/admin/dashboard");
    }
  };

  const handleTambah = async () => {
    const bulanTagihan =
      bulanDipilih && tahunDipilih
        ? `${bulanDipilih} ${tahunDipilih}`
        : "";

    if (!selectedRoom || !bulanTagihan || !jumlahBulan) {
      Alert.alert(
        "Peringatan",
        "Kamar, bulan, tahun, dan jumlah bulan wajib diisi"
      );
      return;
    }

    if (!penghuniKamar) {
      Alert.alert("Peringatan", "Tidak ada penghuni aktif di kamar ini");
      return;
    }

    await tambahPembayaran(selectedRoom.nomor, bulanTagihan, jumlahBulan);

    Alert.alert("Berhasil", "Tagihan berhasil dibuat");

    setSelectedRoom(null);
    setBulanDipilih("");
    setTahunDipilih("");
    setJumlahBulan("1");
    setShowForm(false);
  };

  const handleHapus = (id) => {
    Alert.alert("Hapus Tagihan", "Yakin ingin menghapus tagihan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await hapusPembayaran(id);
          Alert.alert("Berhasil", "Tagihan berhasil dihapus");
        },
      },
    ]);
  };

  return (
    <ProtectedRoute role="admin">
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={handleBack}>
              <ArrowLeft size={22} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.title}>Pembayaran</Text>
              <Text style={styles.subtitle}>
                Buat tagihan berdasarkan kamar penghuni
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <CreditCard size={24} color="#16A34A" />
            </View>
          </View>

          <TouchableOpacity
            style={styles.toggleFormButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {showForm ? "Tutup Form Tagihan" : "Buat Tagihan Baru"}
            </Text>
          </TouchableOpacity>

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Tambah Tagihan Baru</Text>

              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setRoomModal(true)}
              >
                <DoorOpen size={19} color="#64748B" />
                <Text style={styles.selectText}>
                  {selectedRoom
                    ? `Kamar ${selectedRoom.nomor}`
                    : "Pilih kamar penghuni"}
                </Text>
              </TouchableOpacity>

              {selectedRoom && (
                <View style={styles.previewBox}>
                  <Text style={styles.previewText}>
                    Penghuni: {penghuniKamar?.nama || "-"}
                  </Text>
                  <Text style={styles.previewText}>
                    Harga kamar: Rp{" "}
                    {selectedRoom.harga.toLocaleString("id-ID")}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setMonthModal(true)}
              >
                <Calendar size={19} color="#64748B" />
                <Text style={styles.selectText}>
                  {bulanDipilih || "Pilih bulan"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setYearModal(true)}
              >
                <Calendar size={19} color="#64748B" />
                <Text style={styles.selectText}>
                  {tahunDipilih || "Pilih tahun"}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Jumlah bulan"
                value={jumlahBulan}
                onChangeText={setJumlahBulan}
                keyboardType="numeric"
              />

              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total Tagihan</Text>
                <Text style={styles.totalValue}>
                  Rp {totalTagihan.toLocaleString("id-ID")}
                </Text>
              </View>

              <TouchableOpacity style={styles.addButton} onPress={handleTambah}>
                <Plus size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Tambah Tagihan</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={pembayaran}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <CreditCard size={42} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Belum ada pembayaran</Text>
                <Text style={styles.empty}>
                  Data tagihan pembayaran akan tampil di sini.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentIcon}>
                    <Wallet size={26} color="#16A34A" />
                  </View>

                  <View style={styles.paymentInfo}>
                    <Text style={styles.name}>{item.nama}</Text>
                    <Text style={styles.month}>
                      Kamar {item.kamar || "-"} • {item.bulan}
                    </Text>
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

                  <Text style={styles.detailText}>
                    Jumlah bulan: {item.month_count || 1} bulan
                  </Text>
                  <Text style={styles.detailText}>
                    Dibayar: Rp{" "}
                    {(item.paid_amount || 0).toLocaleString("id-ID")}
                  </Text>
                  <Text style={styles.detailText}>
                    Sisa:{" "}
                    {item.remaining_amount > 0
                      ? `Rp ${item.remaining_amount.toLocaleString("id-ID")}`
                      : "-"}
                  </Text>
                  <Text style={styles.detailText}>
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

                {item.status !== "Lunas" && (
                  <TouchableOpacity
                    style={styles.lunasButton}
                    onPress={() => tandaiLunas(item.id)}
                  >
                    <CheckCircle size={18} color="#FFFFFF" />
                    <Text style={styles.buttonText}>
                      Verifikasi Pembayaran
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleHapus(item.id)}
                >
                  <Trash2 size={17} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Hapus Tagihan</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <AdminBottomTabs />

        <Modal visible={roomModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pilih Kamar</Text>
                <TouchableOpacity onPress={() => setRoomModal(false)}>
                  <X size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={kamarTerisi}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const penghuniItem = penghuni.find(
                    (p) => p.kamar === item.nomor
                  );

                  return (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        setSelectedRoom(item);
                        setRoomModal(false);
                      }}
                    >
                      <Text style={styles.optionTitle}>Kamar {item.nomor}</Text>
                      <Text style={styles.optionText}>
                        {penghuniItem?.nama || "Penghuni tidak ditemukan"}
                      </Text>
                      <Text style={styles.optionText}>
                        Rp {item.harga.toLocaleString("id-ID")} / bulan
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>

        <Modal visible={monthModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pilih Bulan</Text>
                <TouchableOpacity onPress={() => setMonthModal(false)}>
                  <X size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={daftarBulan}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      setBulanDipilih(item);
                      setMonthModal(false);
                    }}
                  >
                    <Text style={styles.optionTitle}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <Modal visible={yearModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pilih Tahun</Text>
                <TouchableOpacity onPress={() => setYearModal(false)}>
                  <X size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={daftarTahun}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      setTahunDipilih(item);
                      setYearModal(false);
                    }}
                  >
                    <Text style={styles.optionTitle}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
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
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#0F172A" },
  subtitle: { color: "#64748B", marginTop: 3, fontSize: 13 },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  formTitle: {
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
    fontSize: 16,
  },
  selectBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectText: { color: "#0F172A", flex: 1 },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10,
  },
  previewBox: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  previewText: { color: "#1E40AF", fontWeight: "600", marginBottom: 3 },
  totalBox: {
    backgroundColor: "#F1F5F9",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  totalLabel: { color: "#64748B", fontSize: 13 },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
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
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  paymentInfo: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 18, color: "#0F172A" },
  month: { color: "#64748B", marginTop: 4 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgePaid: { backgroundColor: "#DCFCE7" },
  badgeVerify: { backgroundColor: "#DBEAFE" },
  badgeLess: { backgroundColor: "#FEE2E2" },
  badgeUnpaid: { backgroundColor: "#FEF3C7" },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  badgeTextPaid: { color: "#16A34A" },
  badgeTextVerify: { color: "#2563EB" },
  badgeTextLess: { color: "#DC2626" },
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
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 8,
  },
  detailText: { color: "#64748B", marginTop: 4 },
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
  lunasButton: {
    backgroundColor: "#16A34A",
    padding: 13,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  buttonText: { color: "#FFFFFF", textAlign: "center", fontWeight: "bold" },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    marginTop: 20,
  },
  emptyTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#0F172A",
    marginTop: 12,
  },
  empty: { textAlign: "center", marginTop: 6, color: "#64748B" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  optionItem: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  optionTitle: {
    fontWeight: "bold",
    color: "#0F172A",
    fontSize: 16,
  },
  optionText: {
    color: "#64748B",
    marginTop: 3,
  },
  toggleFormButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});