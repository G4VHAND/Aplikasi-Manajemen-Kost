import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
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
  CheckCircle,
  DoorOpen,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function DataPenghuni() {
  const app = useApp();
  const { from } = useLocalSearchParams();

  const {
    penghuni,
    kamar,
    konfirmasiPenghuni,
    hapusPenghuni,
    editPenghuni,
    refreshData,
  } = app;

  const [search, setSearch] = useState("");

  const [kamarDipilih, setKamarDipilih] = useState({});
  const [modalKamar, setModalKamar] = useState(false);
  const [penghuniAktifId, setPenghuniAktifId] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editNoHp, setEditNoHp] = useState("");
  const [editAlamat, setEditAlamat] = useState("");
  const [editKamar, setEditKamar] = useState("");

  const kamarKosong = kamar.filter((item) => item.status === "Kosong");

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  const handleBack = () => {
    if (from === "sederhana") {
      router.replace("/admin/sederhana");
    } else {
      router.replace("/admin/dashboard");
    }
  };

  const bukaModalKamar = (id) => {
    setPenghuniAktifId(id);
    setModalKamar(true);
  };

  const pilihKamar = (item) => {
    if (editId) {
      setEditKamar(item.nomor);
    } else {
      setKamarDipilih({
        ...kamarDipilih,
        [penghuniAktifId]: item.nomor,
      });
    }

    setModalKamar(false);
  };

  const handleKonfirmasi = async (id) => {
    const nomorKamar = kamarDipilih[id];

    if (!nomorKamar) {
      Alert.alert("Peringatan", "Pilih kamar kosong terlebih dahulu");
      return;
    }

    await konfirmasiPenghuni(id, nomorKamar);

    Alert.alert("Berhasil", "Penghuni berhasil dikonfirmasi");

    setKamarDipilih({
      ...kamarDipilih,
      [id]: "",
    });
  };

  const handleHapus = (id) => {
    Alert.alert(
      "Keluarkan Penghuni",
      "Apakah Anda yakin ingin mengeluarkan penghuni ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluarkan",
          style: "destructive",
          onPress: async () => {
            await hapusPenghuni(id);
            Alert.alert("Berhasil", "Data penghuni berhasil dikeluarkan dan kamar dikosongkan");
          },
        },
      ]
    );
  };

  const mulaiEdit = (item) => {
    setEditId(item.id);
    setEditNama(item.nama);
    setEditNoHp(item.noHp);
    setEditAlamat(item.alamat);
    setEditKamar(item.kamar);
  };

  const simpanEdit = async () => {
    if (!editNama || !editNoHp || !editAlamat || !editKamar) {
      Alert.alert("Peringatan", "Semua data wajib diisi");
      return;
    }

    await editPenghuni(editId, {
      nama: editNama,
      noHp: editNoHp,
      alamat: editAlamat,
      kamar: editKamar,
    });

    Alert.alert("Berhasil", "Data penghuni berhasil diperbarui");

    setEditId(null);
    setEditNama("");
    setEditNoHp("");
    setEditAlamat("");
    setEditKamar("");
  };

  const filteredPenghuni = penghuni.filter((item) =>
    {
      const keyword = search.toLowerCase();
      return (
        item.nama?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.noHp?.toLowerCase().includes(keyword) ||
        item.alamat?.toLowerCase().includes(keyword) ||
        item.kamar?.toString().toLowerCase().includes(keyword)
      );
    }
  );
  

  return (
    <ProtectedRoute role="admin">
      <View style={styles.wrapper}>
        <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={handleBack}>
            <ArrowLeft size={22} color="#1B2A47" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Data Penghuni</Text>
            <Text style={styles.subtitle}>
              Kelola data dan konfirmasi penghuni
            </Text>

            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => router.push("/admin/riwayat-penghuni")}
            >
              <Text style={styles.historyText}>Riwayat Penghuni</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerIcon}>
            <Users size={24} color="#4F8EF7" />
          </View>
        </View>

          <View style={styles.searchBox}>
          <Search size={19} color="#6B7A94" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, email, kamar, atau status..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

          <FlatList
            data={filteredPenghuni}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Users size={42} color="#9AACC9" />
                <Text style={styles.emptyTitle}>Belum ada penghuni</Text>
                <Text style={styles.empty}>
                  Data penghuni yang registrasi akan tampil di sini.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.profileRow}>
                  <Image
                    source={{
                      uri: item.foto || "https://via.placeholder.com/150",
                    }}
                    style={styles.photo}
                  />

                  <View style={styles.profileInfo}>
                    <Text style={styles.name}>{item.nama}</Text>

                    <View
                      style={[
                        styles.badge,
                        item.status === "Aktif"
                          ? styles.badgeActive
                          : styles.badgePending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          item.status === "Aktif"
                            ? styles.badgeTextActive
                            : styles.badgeTextPending,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <InfoRow Icon={Mail} label={item.email} />
                  <InfoRow Icon={Phone} label={item.noHp} />
                  <InfoRow Icon={MapPin} label={item.alamat} />
                  <InfoRow Icon={DoorOpen} label={`Kamar ${item.kamar}`} />
                </View>

                {editId === item.id ? (
                  <View style={styles.editBox}>
                    <Text style={styles.formTitle}>Edit Data Penghuni</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Nama"
                      value={editNama}
                      onChangeText={setEditNama}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="No HP"
                      value={editNoHp}
                      onChangeText={setEditNoHp}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Alamat"
                      value={editAlamat}
                      onChangeText={setEditAlamat}
                    />

                    <TouchableOpacity
                      style={styles.selectBox}
                      onPress={() => {
                        setPenghuniAktifId(editId);
                        setModalKamar(true);
                      }}
                    >
                      <DoorOpen size={19} color="#6B7A94" />
                      <Text style={styles.selectText}>
                        {editKamar ? `Kamar ${editKamar}` : "Pilih kamar"}
                      </Text>
                    </TouchableOpacity>

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
                      <Text style={styles.buttonText}>Keluar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status !== "Aktif" && (
                  <View style={styles.confirmBox}>
                    <Text style={styles.formTitle}>Konfirmasi Penghuni</Text>

                    <TouchableOpacity
                      style={styles.selectBox}
                      onPress={() => bukaModalKamar(item.id)}
                    >
                      <DoorOpen size={19} color="#6B7A94" />
                      <Text style={styles.selectText}>
                        {kamarDipilih[item.id]
                          ? `Kamar ${kamarDipilih[item.id]}`
                          : "Pilih kamar kosong"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => handleKonfirmasi(item.id)}
                    >
                      <CheckCircle size={18} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Konfirmasi Penghuni</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        </View>

        <AdminBottomTabs />

        <Modal visible={modalKamar} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pilih Kamar Kosong</Text>

                <TouchableOpacity onPress={() => setModalKamar(false)}>
                  <X size={22} color="#1B2A47" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={editId ? kamar : kamarKosong}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <Text style={styles.empty}>
                    Tidak ada kamar kosong tersedia.
                  </Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => pilihKamar(item)}
                  >
                    <Text style={styles.optionTitle}>Kamar {item.nomor}</Text>
                    <Text style={styles.optionText}>
                      Rp {item.harga.toLocaleString("id-ID")} / bulan
                    </Text>
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

function InfoRow({ Icon, label }) {
  return (
    <View style={styles.infoRow}>
      <Icon size={17} color="#6B7A94" />
      <Text style={styles.infoText}>{label}</Text>
    </View>
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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#D9E5FA",
    marginRight: 14,
  },
  profileInfo: { flex: 1 },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1B2A47",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeActive: { backgroundColor: "#DCFCE7" },
  badgePending: { backgroundColor: "#FEF3C7" },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  badgeTextActive: { color: "#16A34A" },
  badgeTextPending: { color: "#D97706" },
  infoBox: {
    backgroundColor: "#EAF2FE",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    color: "#28395A",
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#4F8EF7",
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
  editBox: {
    backgroundColor: "#EAF2FE",
    padding: 14,
    borderRadius: 18,
    marginTop: 4,
  },
  confirmBox: {
    backgroundColor: "#EAF2FE",
    padding: 14,
    borderRadius: 18,
    marginTop: 12,
  },
  formTitle: {
    fontWeight: "bold",
    color: "#1B2A47",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C7D7F5",
    marginBottom: 10,
  },
  selectBox: {
    backgroundColor: "#FFFFFF",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C7D7F5",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectText: {
    color: "#1B2A47",
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#16A34A",
    padding: 13,
    borderRadius: 14,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  cancelButton: {
    backgroundColor: "#6B7A94",
    padding: 13,
    borderRadius: 14,
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "#16A34A",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
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
  empty: {
    textAlign: "center",
    marginTop: 6,
    color: "#6B7A94",
  },
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
    color: "#1B2A47",
  },
  optionItem: {
    backgroundColor: "#EAF2FE",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D9E5FA",
  },
  optionTitle: {
    fontWeight: "bold",
    color: "#1B2A47",
    fontSize: 16,
  },
  optionText: {
    color: "#6B7A94",
    marginTop: 3,
  },
  searchBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9E5FA",
    paddingHorizontal: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    marginLeft: 10,
    color: "#1B2A47",
  },
historyButton: {
  backgroundColor: "#4F8EF7",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 10,
  alignSelf: "flex-start",
  marginTop: 10,
},

historyText: {
  color: "#FFFFFF",
  fontWeight: "600",
  fontSize: 13,
},
});