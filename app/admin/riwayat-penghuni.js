import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  CalendarDays,
  DoorOpen,
  UserX,
} from "lucide-react-native";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";

export default function RiwayatPenghuni() {
  const { riwayatPenghuni } = useApp();

  return (
    <ProtectedRoute role="admin">
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={22} color="#1B2A47" />
            </TouchableOpacity>

            <Text style={styles.title}>Riwayat Penghuni</Text>
          </View>

          {riwayatPenghuni.length === 0 ? (
            <View style={styles.emptyCard}>
              <UserX size={42} color="#9AACC9" />
              <Text style={styles.emptyText}>
                Belum ada penghuni keluar
              </Text>
            </View>
          ) : (
            riwayatPenghuni.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.nama}>{item.nama}</Text>

                <View style={styles.row}>
                  <DoorOpen size={18} color="#6B7A94" />
                  <Text style={styles.value}>
                    Kamar Terakhir: {item.kamar || "-"}
                  </Text>
                </View>

                <View style={styles.row}>
                  <CalendarDays size={18} color="#6B7A94" />
                  <Text style={styles.value}>
                    Keluar:
                    {" "}
                    {item.exit_date
                      ? new Date(item.exit_date).toLocaleDateString("id-ID")
                      : "-"}
                  </Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    Penghuni Keluar
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B2A47",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D9E5FA",
  },
  nama: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B2A47",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  value: {
    color: "#5A6B8C",
  },
  badge: {
    marginTop: 10,
    backgroundColor: "#FEE2E2",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    color: "#6B7A94",
  },
});