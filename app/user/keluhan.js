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
  Clock,
  MessageSquareWarning,
  Send,
  Wrench,
} from "lucide-react-native";

import ProtectedRoute from "../../components/ProtectedRoute";
import UserBottomTabs from "../../components/UserBottomTabs";
import { useApp } from "../../context/AppContext";

export default function KeluhanUser() {
  const { user, keluhan, tambahKeluhan } = useApp();
  const [isi, setIsi] = useState("");

  const keluhanSaya = keluhan.filter((item) => item.email === user?.email);

  const kirimKeluhan = async () => {
    if (!isi.trim()) {
      Alert.alert("Peringatan", "Keluhan tidak boleh kosong");
      return;
    }

    await tambahKeluhan(isi);

    Alert.alert("Berhasil", "Keluhan berhasil dikirim");
    setIsi("");
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
              <Text style={styles.title}>Keluhan</Text>
              <Text style={styles.subtitle}>
                Kirim dan pantau laporan Anda
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <MessageSquareWarning size={24} color="#F59E0B" />
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Tulis Keluhan Baru</Text>

            <TextInput
              style={styles.textarea}
              placeholder="Contoh: Lampu kamar mati, air kecil, atau fasilitas rusak..."
              multiline
              numberOfLines={5}
              value={isi}
              onChangeText={setIsi}
            />

            <TouchableOpacity style={styles.sendButton} onPress={kirimKeluhan}>
              <Send size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Kirim Keluhan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Riwayat Keluhan Saya</Text>

          <FlatList
            data={keluhanSaya}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <MessageSquareWarning size={42} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Belum ada keluhan</Text>
                <Text style={styles.empty}>
                  Keluhan yang Anda kirim akan tampil di sini.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.complaintHeader}>
                  <View style={styles.complaintIcon}>
                    <Wrench size={26} color="#F59E0B" />
                  </View>

                  <View style={styles.complaintInfo}>
                    <Text style={styles.complaintTitle}>Keluhan Saya</Text>

                    <View
                      style={[
                        styles.badge,
                        item.status === "Selesai"
                          ? styles.badgeDone
                          : item.status === "Diproses"
                          ? styles.badgeProcess
                          : styles.badgeWaiting,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          item.status === "Selesai"
                            ? styles.badgeTextDone
                            : item.status === "Diproses"
                            ? styles.badgeTextProcess
                            : styles.badgeTextWaiting,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.messageBox}>
                  <Text style={styles.messageText}>{item.isi}</Text>
                </View>

                {item.status === "Selesai" ? (
                  <View style={styles.statusBoxDone}>
                    <CheckCircle size={18} color="#16A34A" />
                    <Text style={styles.statusTextDone}>
                      Keluhan telah diselesaikan
                    </Text>
                  </View>
                ) : (
                  <View style={styles.statusBoxWaiting}>
                    <Clock size={18} color="#D97706" />
                    <Text style={styles.statusTextWaiting}>
                      Menunggu proses admin
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
    backgroundColor: "#FEF3C7",
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
    marginBottom: 20,
  },
  formTitle: {
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
    fontSize: 16,
  },
  textarea: {
    backgroundColor: "#F8FAFC",
    padding: 13,
    borderRadius: 14,
    height: 130,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
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
    borderColor: "#E2E8F0",
  },
  complaintHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  complaintIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  complaintInfo: {
    flex: 1,
  },
  complaintTitle: {
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
  badgeWaiting: {
    backgroundColor: "#FEF3C7",
  },
  badgeProcess: {
    backgroundColor: "#DBEAFE",
  },
  badgeDone: {
    backgroundColor: "#DCFCE7",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  badgeTextWaiting: {
    color: "#D97706",
  },
  badgeTextProcess: {
    color: "#2563EB",
  },
  badgeTextDone: {
    color: "#16A34A",
  },
  messageBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  messageText: {
    color: "#334155",
    lineHeight: 20,
  },
  statusBoxWaiting: {
    backgroundColor: "#FEF3C7",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statusTextWaiting: {
    color: "#D97706",
    fontWeight: "bold",
  },
  statusBoxDone: {
    backgroundColor: "#DCFCE7",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statusTextDone: {
    color: "#16A34A",
    fontWeight: "bold",
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