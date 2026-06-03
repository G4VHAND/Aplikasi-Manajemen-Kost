import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  DoorOpen,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle,
} from "lucide-react-native";

import ProtectedRoute from "../../components/ProtectedRoute";
import UserBottomTabs from "../../components/UserBottomTabs";
import { useApp } from "../../context/AppContext";

export default function ProfileUser() {
  const { user, penghuni } = useApp();

  const dataPenghuni = penghuni.find((item) => item.email === user?.email);

  return (
    <ProtectedRoute role="user">
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => router.replace("/user/dashboard")}
            >
              <ArrowLeft size={22} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.title}>Profil Penghuni</Text>
              <Text style={styles.subtitle}>Informasi akun dan kamar</Text>
            </View>

            <View style={styles.headerIcon}>
              <UserCircle size={24} color="#16A34A" />
            </View>
          </View>

          <View style={styles.profileCard}>
            <Image
              source={{
                uri:
                  dataPenghuni?.foto ||
                  "https://via.placeholder.com/150",
              }}
              style={styles.photo}
            />

            <Text style={styles.name}>{dataPenghuni?.nama || "-"}</Text>

            <View
              style={[
                styles.badge,
                dataPenghuni?.status === "Aktif"
                  ? styles.badgeActive
                  : styles.badgePending,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  dataPenghuni?.status === "Aktif"
                    ? styles.badgeTextActive
                    : styles.badgeTextPending,
                ]}
              >
                {dataPenghuni?.status || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <InfoRow Icon={Mail} label="Email" value={dataPenghuni?.email || "-"} />
            <InfoRow Icon={Phone} label="No HP" value={dataPenghuni?.noHp || "-"} />
            <InfoRow Icon={MapPin} label="Alamat" value={dataPenghuni?.alamat || "-"} />
            <InfoRow Icon={DoorOpen} label="Kamar" value={`Kamar ${dataPenghuni?.kamar || "-"}`} />
            <InfoRow Icon={ShieldCheck} label="Status" value={dataPenghuni?.status || "-"} />
          </View>
          </ScrollView>
          <UserBottomTabs />
        </View>
    </ProtectedRoute>
  );
}

function InfoRow({ Icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconBox}>
        <Icon size={20} color="#16A34A" />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    marginBottom: 16,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 36,
    backgroundColor: "#E2E8F0",
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 10,
    textAlign: "center",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: "#64748B",
    fontSize: 13,
  },
  infoValue: {
    color: "#0F172A",
    fontWeight: "bold",
    marginTop: 2,
    fontSize: 15,
  },
});