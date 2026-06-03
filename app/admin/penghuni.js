import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
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
  CheckCircle,
  DoorOpen,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Users
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function DataPenghuni() {

  const app = useApp();

  if (!app) {
    return (
      <View style={styles.container}>
        <Text>Context belum terbaca</Text>
      </View>
    );
  }

  const { from } = useLocalSearchParams();

  const handleBack = () => {
    if (from === "sederhana") {
      router.replace("/admin/sederhana");
    } else {
      router.replace("/admin/dashboard");
    }
  };

  const {
    penghuni,
    konfirmasiPenghuni,
    hapusPenghuni,
    editPenghuni,
    refreshData,
  } = app;

  const [kamarInput, setKamarInput] = useState({});
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editNoHp, setEditNoHp] = useState("");
  const [editAlamat, setEditAlamat] = useState("");
  const [editKamar, setEditKamar] = useState("");

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  const handleKonfirmasi = async (id) => {
    const nomorKamar = kamarInput[id];

    if (!nomorKamar) {
      Alert.alert("Peringatan", "Nomor kamar wajib diisi");
      return;
    }

    await konfirmasiPenghuni(id, nomorKamar);
    Alert.alert("Berhasil", "Penghuni berhasil dikonfirmasi");
  };

  const handleHapus = (id) => {
    Alert.alert(
      "Hapus Penghuni",
      "Apakah Anda yakin ingin menghapus data penghuni ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await hapusPenghuni(id);
            Alert.alert("Berhasil", "Data penghuni berhasil dihapus");
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
              <Text style={styles.title}>Data Penghuni</Text>
              <Text style={styles.subtitle}>
                Kelola data dan konfirmasi penghuni
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Users size={24} color="#2563EB" />
            </View>
          </View>

          <FlatList
            data={penghuni}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Users size={42} color="#94A3B8" />
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

                    <TextInput
                      style={styles.input}
                      placeholder="Kamar"
                      value={editKamar}
                      onChangeText={setEditKamar}
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
                )}

                {item.status !== "Aktif" && (
                  <View style={styles.confirmBox}>
                    <Text style={styles.formTitle}>Konfirmasi Penghuni</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Masukkan nomor kamar"
                      value={kamarInput[item.id] || ""}
                      onChangeText={(text) =>
                        setKamarInput({
                          ...kamarInput,
                          [item.id]: text,
                        })
                      }
                    />

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
      </View>
    </ProtectedRoute>
  );
}

function InfoRow({ Icon, label }) {
  return (
    <View style={styles.infoRow}>
      <Icon size={17} color="#64748B" />
      <Text style={styles.infoText}>{label}</Text>
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
    backgroundColor: "#DBEAFE",
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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#0F172A",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeActive: {
    backgroundColor: "#DCFCE7",
  },
  badgePending: {
    backgroundColor: "#FEF3C7",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  badgeTextActive: {
    color: "#16A34A",
  },
  badgeTextPending: {
    color: "#D97706",
  },
  infoBox: {
    backgroundColor: "#F8FAFC",
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
    color: "#334155",
    flex: 1,
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
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 18,
    marginTop: 4,
  },
  confirmBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 18,
    marginTop: 12,
  },
  formTitle: {
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10,
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
    backgroundColor: "#64748B",
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
  empty: {
    textAlign: "center",
    marginTop: 6,
    color: "#64748B",
  },
});