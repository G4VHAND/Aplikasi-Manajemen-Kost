import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Mail,
  MessageSquareWarning,
  Trash2,
  User,
  Wrench,
} from "lucide-react-native";

import AdminBottomTabs from "../../components/AdminBottomTabs";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function KeluhanAdmin() {
  const { keluhan, ubahStatusKeluhan, hapusKeluhan } = useApp();

  const { from } = useLocalSearchParams();

  const handleBack = () => {
    if (from === "sederhana") {
      router.replace("/admin/sederhana");
    } else {
      router.replace("/admin/dashboard");
    }
  };

  const handleHapus = (id) => {
    Alert.alert(
      "Hapus Keluhan",
      "Apakah Anda yakin ingin menghapus keluhan ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await hapusKeluhan(id);
            Alert.alert("Berhasil", "Keluhan berhasil dihapus");
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
              <Text style={styles.title}>Keluhan Penghuni</Text>
              <Text style={styles.subtitle}>
                Pantau dan proses laporan penghuni
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <MessageSquareWarning size={24} color="#8B5CF6" />
            </View>
          </View>

          <FlatList
            data={keluhan}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <MessageSquareWarning size={42} color="#9AACC9" />
                <Text style={styles.emptyTitle}>Belum ada keluhan</Text>
                <Text style={styles.empty}>
                  Keluhan dari penghuni akan tampil di sini.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.complaintHeader}>
                  <View style={styles.complaintIcon}>
                    <Wrench size={26} color="#8B5CF6" />
                  </View>

                  <View style={styles.complaintInfo}>
                    <Text style={styles.name}>{item.nama}</Text>

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

                <View style={styles.infoBox}>
                  <InfoRow Icon={User} text={item.nama} />
                  <InfoRow Icon={Mail} text={item.email || "-"} />
                  <InfoRow Icon={MessageSquareWarning} text={item.isi} />
                  <InfoRow Icon={Clock} text={`Status: ${item.status}`} />
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.processButton}
                    onPress={() => ubahStatusKeluhan(item.id, "Diproses")}
                  >
                    <Clock size={17} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Diproses</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => ubahStatusKeluhan(item.id, "Selesai")}
                  >
                    <CheckCircle size={17} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Selesai</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleHapus(item.id)}
                >
                  <Trash2 size={17} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Hapus Keluhan</Text>
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

function InfoRow({ Icon, text }) {
  return (
    <View style={styles.infoRow}>
      <Icon size={17} color="#6B7A94" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
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
    backgroundColor: "#EDE9FE",
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
  complaintHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  complaintIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  complaintInfo: {
    flex: 1,
  },
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
  badgeWaiting: {
    backgroundColor: "#FEF3C7",
  },
  badgeProcess: {
    backgroundColor: "#E6F0FE",
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
    color: "#4F8EF7",
  },
  badgeTextDone: {
    color: "#16A34A",
  },
  infoBox: {
    backgroundColor: "#EAF2FE",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    color: "#28395A",
    flex: 1,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  processButton: {
    flex: 1,
    backgroundColor: "#F59E0B",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  doneButton: {
    flex: 1,
    backgroundColor: "#16A34A",
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
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