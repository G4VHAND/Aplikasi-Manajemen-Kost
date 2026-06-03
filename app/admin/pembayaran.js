import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
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
  CheckCircle,
  CreditCard,
  Edit3,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { STORAGE_URL } from "../../services/api";

export default function PembayaranAdmin() {
  const { from } = useLocalSearchParams();

  const handleBack = () => {
    if (from === "sederhana") {
      router.replace("/admin/sederhana");
    } else {
      router.replace("/admin/dashboard");
    }
  };
  
  const {
    pembayaran,
    tambahPembayaran,
    tandaiLunas,
    hapusPembayaran,
    editPembayaran,
  } = useApp();

  const [nama, setNama] = useState("");
  const [bulan, setBulan] = useState("");
  const [jumlah, setJumlah] = useState("");

  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editBulan, setEditBulan] = useState("");
  const [editJumlah, setEditJumlah] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleTambah = async () => {
    if (!nama || !bulan || !jumlah) {
      Alert.alert("Peringatan", "Semua data pembayaran wajib diisi");
      return;
    }

    await tambahPembayaran(nama, bulan, jumlah);

    Alert.alert("Berhasil", "Tagihan berhasil ditambahkan");
    setNama("");
    setBulan("");
    setJumlah("");
  };

  const handleHapus = (id) => {
    Alert.alert(
      "Hapus Tagihan",
      "Apakah Anda yakin ingin menghapus tagihan ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await hapusPembayaran(id);
            Alert.alert("Berhasil", "Tagihan berhasil dihapus");
          },
        },
      ]
    );
  };

  const mulaiEdit = (item) => {
    setEditId(item.id);
    setEditNama(item.nama);
    setEditBulan(item.bulan);
    setEditJumlah(String(item.jumlah));
    setEditStatus(item.status);
  };

  const simpanEdit = async () => {
    if (!editNama || !editBulan || !editJumlah || !editStatus) {
      Alert.alert("Peringatan", "Semua data wajib diisi");
      return;
    }

    await editPembayaran(editId, {
      nama: editNama,
      bulan: editBulan,
      jumlah: editJumlah,
      status: editStatus,
    });

    Alert.alert("Berhasil", "Data pembayaran berhasil diperbarui");

    setEditId(null);
    setEditNama("");
    setEditBulan("");
    setEditJumlah("");
    setEditStatus("");
  };

  return (
    <ProtectedRoute role="admin">
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={handleBack}
            >
              <ArrowLeft size={22} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.title}>Pembayaran</Text>
              <Text style={styles.subtitle}>
                Kelola tagihan dan verifikasi pembayaran
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <CreditCard size={24} color="#16A34A" />
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Tambah Tagihan Baru</Text>

            <TextInput
              style={styles.input}
              placeholder="Nama penghuni"
              value={nama}
              onChangeText={setNama}
            />

            <TextInput
              style={styles.input}
              placeholder="Bulan, contoh: Mei 2026"
              value={bulan}
              onChangeText={setBulan}
            />

            <TextInput
              style={styles.input}
              placeholder="Jumlah pembayaran"
              value={jumlah}
              onChangeText={setJumlah}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.addButton} onPress={handleTambah}>
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Tambah Tagihan</Text>
            </TouchableOpacity>
          </View>

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
                {editId === item.id ? (
                  <View>
                    <Text style={styles.formTitle}>Edit Tagihan</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Nama penghuni"
                      value={editNama}
                      onChangeText={setEditNama}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Bulan"
                      value={editBulan}
                      onChangeText={setEditBulan}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Jumlah"
                      value={editJumlah}
                      onChangeText={setEditJumlah}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Status"
                      value={editStatus}
                      onChangeText={setEditStatus}
                    />

                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={simpanEdit}
                    >
                      <CheckCircle size={18} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Simpan Perubahan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setEditId(null)}
                    >
                      <Text style={styles.buttonText}>Batal</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View style={styles.paymentHeader}>
                      <View style={styles.paymentIcon}>
                        <Wallet size={26} color="#16A34A" />
                      </View>

                      <View style={styles.paymentInfo}>
                        <Text style={styles.name}>{item.nama}</Text>
                        <Text style={styles.month}>{item.bulan}</Text>
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

                      <Text style={styles.methodText}>
                        Metode: {item.metode || "-"}
                      </Text>
                    </View>

                    {item.proof && (
                      <View style={styles.proofBox}>
                        <Text style={styles.proofTitle}>
                          Bukti Pembayaran
                        </Text>

                        <Image
                          source={{
                            uri: `${STORAGE_URL}/${item.proof}`,
                          }}
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
                        <Text style={styles.buttonText}>Tandai Lunas</Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => mulaiEdit(item)}
                      >
                        <Edit3 size={17} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleHapus(item.id)}
                      >
                        <Trash2 size={17} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Hapus</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          />
        </View>

        <AdminBottomTabs />
      </View>
    </ProtectedRoute>
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
  headerText: {
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    color: "#64748B",
    marginTop: 3,
    fontSize: 13,
  },
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
  input: {
    backgroundColor: "#F8FAFC",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  listContent: {
    paddingBottom: 30,
  },
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
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  paymentInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#0F172A",
  },
  month: {
    color: "#64748B",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgePaid: {
    backgroundColor: "#DCFCE7",
  },
  badgeVerify: {
    backgroundColor: "#DBEAFE",
  },
  badgeUnpaid: {
    backgroundColor: "#FEF3C7",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  badgeTextPaid: {
    color: "#16A34A",
  },
  badgeTextVerify: {
    color: "#2563EB",
  },
  badgeTextUnpaid: {
    color: "#D97706",
  },
  amountBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  amountLabel: {
    color: "#64748B",
    fontSize: 13,
  },
  amountValue: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
  methodText: {
    color: "#64748B",
    marginTop: 6,
  },
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
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  saveButton: {
    backgroundColor: "#16A34A",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: "#64748B",
    padding: 13,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
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
  empty: {
    textAlign: "center",
    marginTop: 6,
    color: "#64748B",
  },
});