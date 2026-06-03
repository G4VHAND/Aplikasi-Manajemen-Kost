import { router } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  Bell,
  Megaphone,
} from "lucide-react-native";

import ProtectedRoute from "../../components/ProtectedRoute";
import UserBottomTabs from "../../components/UserBottomTabs";
import { useApp } from "../../context/AppContext";

export default function PengumumanUser() {
  const { pengumuman } = useApp();

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
              <Text style={styles.title}>Pengumuman</Text>
              <Text style={styles.subtitle}>
                Informasi terbaru dari pengelola kost
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Bell size={24} color="#EF4444" />
            </View>
          </View>

          <FlatList
            data={pengumuman}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Bell size={42} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Belum ada pengumuman</Text>
                <Text style={styles.empty}>
                  Pengumuman dari admin akan tampil di sini.
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
    backgroundColor: "#FEE2E2",
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
  announcementHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    color: "#0F172A",
    marginBottom: 6,
  },
  desc: {
    color: "#64748B",
    lineHeight: 20,
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