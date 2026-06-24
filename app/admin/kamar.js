import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  CheckCircle,
  DoorOpen,
  Edit3,
  Home,
  Plus,
  Search,
  Trash2,
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function DataKamar() {
  const { kamar, tambahKamar, hapusKamar, editKamar } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [nomor, setNomor] = useState("");
  const [harga, setHarga] = useState("");
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);
  const [editNomor, setEditNomor] = useState("");
  const [editHarga, setEditHarga] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleTambah = async () => {
    if (!nomor || !harga) {
      Alert.alert("Peringatan", "Nomor kamar dan harga wajib diisi");
      return;
    }

    await tambahKamar(nomor, harga);
    Alert.alert("Berhasil", "Kamar berhasil ditambahkan");

    setNomor("");
    setHarga("");
    setShowForm(false);
  };

  const handleHapus = (id) => {
    Alert.alert("Hapus Kamar", "Apakah Anda yakin ingin menghapus kamar ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await hapusKamar(id);
          Alert.alert("Berhasil", "Kamar berhasil dihapus");
        },
      },
    ]);
  };

  const mulaiEdit = (item) => {
    setEditId(item.id);
    setEditNomor(item.nomor);
    setEditHarga(String(item.harga));
    setEditStatus(item.status);
  };

  const simpanEdit = async () => {
    if (!editNomor || !editHarga || !editStatus) {
      Alert.alert("Peringatan", "Semua data wajib diisi");
      return;
    }

    await editKamar(editId, {
      nomor: editNomor,
      harga: editHarga,
      status: editStatus,
    });

    Alert.alert("Berhasil", "Data kamar berhasil diperbarui");

    setEditId(null);
    setEditNomor("");
    setEditHarga("");
    setEditStatus("");
  };

  const filteredKamar = kamar.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.nomor?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword) ||
      String(item.harga).includes(keyword)
    );
  });

  return (
    <ProtectedRoute role="admin">
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => router.replace("/admin/dashboard")}
            >
              <ArrowLeft size={22} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.title}>Data Kamar</Text>
              <Text style={styles.subtitle}>Kelola kamar kost</Text>
            </View>

            <View style={styles.headerIcon}>
              <DoorOpen size={24} color="#F59E0B" />
            </View>
          </View>

          <TouchableOpacity
            style={styles.toggleFormButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {showForm ? "Tutup Form Kamar" : "Tambah Kamar Baru"}
            </Text>
          </TouchableOpacity>

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Tambah Kamar Baru</Text>

              <TextInput
                style={styles.input}
                placeholder="Nomor kamar, contoh: E13"
                value={nomor}
                onChangeText={setNomor}
              />

              <TextInput
                style={styles.input}
                placeholder="Harga kamar"
                value={harga}
                onChangeText={setHarga}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.addButton} onPress={handleTambah}>
                <Plus size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Tambah Kamar</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.searchBox}>
            <Search size={19} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nomor kamar, status, atau harga..."
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filteredKamar}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <DoorOpen size={42} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Belum ada kamar</Text>
                <Text style={styles.empty}>
                  Data kamar kost akan tampil di sini.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                {editId === item.id ? (
                  <View>
                    <Text style={styles.formTitle}>Edit Kamar</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Nomor kamar"
                      value={editNomor}
                      onChangeText={setEditNomor}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Harga kamar"
                      value={editHarga}
                      onChangeText={setEditHarga}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Status kamar"
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
                    <View style={styles.roomHeader}>
                      <View style={styles.roomIcon}>
                        <Home size={26} color="#F59E0B" />
                      </View>

                      <View style={styles.roomInfo}>
                        <Text style={styles.roomTitle}>Kamar {item.nomor}</Text>

                        <View
                          style={[
                            styles.badge,
                            item.status === "Kosong"
                              ? styles.badgeEmpty
                              : styles.badgeFilled,
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeText,
                              item.status === "Kosong"
                                ? styles.badgeTextEmpty
                                : styles.badgeTextFilled,
                            ]}
                          >
                            {item.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.priceBox}>
                      <Text style={styles.priceLabel}>Harga Bulanan</Text>
                      <Text style={styles.priceValue}>
                        Rp {item.harga.toLocaleString("id-ID")}
                      </Text>
                    </View>

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
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#0F172A" },
  subtitle: { color: "#64748B", marginTop: 3, fontSize: 13 },
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
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  searchBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    marginLeft: 10,
    color: "#0F172A",
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
  roomHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  roomIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  roomInfo: { flex: 1 },
  roomTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeEmpty: { backgroundColor: "#DCFCE7" },
  badgeFilled: { backgroundColor: "#DBEAFE" },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  badgeTextEmpty: { color: "#16A34A" },
  badgeTextFilled: { color: "#2563EB" },
  priceBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  priceLabel: { color: "#64748B", fontSize: 13 },
  priceValue: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
  actionRow: { flexDirection: "row", gap: 10 },
  editButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
});