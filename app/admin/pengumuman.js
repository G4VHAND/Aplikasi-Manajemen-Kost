import { router, useLocalSearchParams } from "expo-router";
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
  Bell,
  Megaphone,
  Plus,
  Trash2,
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function PengumumanAdmin() {

  const { from } = useLocalSearchParams();

  const handleBack = () => {
    if (from === "sederhana") {
      router.replace("/admin/sederhana");
    } else {
      router.replace("/admin/dashboard");
    }
  };

  const { pengumuman, tambahPengumuman, hapusPengumuman } = useApp();

  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");

  const simpanPengumuman = async () => {
    if (!judul.trim() || !isi.trim()) {
      Alert.alert("Peringatan", "Judul dan isi pengumuman wajib diisi");
      return;
    }

    await tambahPengumuman(judul, isi);

    Alert.alert("Berhasil", "Pengumuman berhasil dibuat");
    setJudul("");
    setIsi("");
  };

  const handleHapus = (id) => {
    Alert.alert(
      "Hapus Pengumuman",
      "Apakah Anda yakin ingin menghapus pengumuman ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await hapusPengumuman(id);
            Alert.alert("Berhasil", "Pengumuman berhasil dihapus");
          },
        },
      ]
    );
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
              <ArrowLeft size={22} color="#1B2A47" />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.title}>Pengumuman</Text>
              <Text style={styles.subtitle}>
                Buat dan kelola informasi kost
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Bell size={24} color="#EF4444" />
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Buat Pengumuman Baru</Text>

            <TextInput
              style={styles.input}
              placeholder="Judul pengumuman"
              value={judul}
              onChangeText={setJudul}
            />

            <TextInput
              style={styles.textarea}
              placeholder="Isi pengumuman..."
              multiline
              numberOfLines={5}
              value={isi}
              onChangeText={setIsi}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={simpanPengumuman}
            >
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Simpan Pengumuman</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Daftar Pengumuman</Text>

          <FlatList
            data={pengumuman}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Bell size={42} color="#9AACC9" />
                <Text style={styles.emptyTitle}>Belum ada pengumuman</Text>
                <Text style={styles.empty}>
                  Pengumuman yang dibuat admin akan tampil di sini.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.announcementHeader}>
                  <View style={styles.announcementIcon}>
                    <Megaphone size={26} color="#EF4444" />
                  </View>

                  <View style={styles.announcementInfo}>
                    <Text style={styles.name}>{item.judul}</Text>
                    <Text style={styles.desc}>{item.isi}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleHapus(item.id)}
                >
                  <Trash2 size={17} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Hapus Pengumuman</Text>
                </TouchableOpacity>
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
    backgroundColor: "#EAF2FE",
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
    borderColor: "#D9E5FA",
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
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1B2A47",
  },
  subtitle: {
    color: "#6B7A94",
    marginTop: 3,
    fontSize: 13,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D9E5FA",
    marginBottom: 20,
  },
  formTitle: {
    fontWeight: "bold",
    color: "#1B2A47",
    marginBottom: 12,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#EAF2FE",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C7D7F5",
    marginBottom: 10,
  },
  textarea: {
    backgroundColor: "#EAF2FE",
    padding: 13,
    borderRadius: 14,
    height: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#C7D7F5",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4F8EF7",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B2A47",
    marginBottom: 12,
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
    borderColor: "#D9E5FA",
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  announcementIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  announcementInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1B2A47",
    marginBottom: 6,
  },
  desc: {
    color: "#6B7A94",
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
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
    marginTop: 20,
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
});