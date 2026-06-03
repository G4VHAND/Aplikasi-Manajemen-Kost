import { router, usePathname } from "expo-router";
import {
  CreditCard,
  DoorOpen,
  Home,
  Menu,
  Users,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "../context/AppContext";

export default function AdminBottomTabs() {
  const pathname = usePathname();

  const { pembayaran } = useApp();

  const pembayaranMenunggu = pembayaran.filter(
    (item) => item.status === "Menunggu Verifikasi"
  ).length;

  const tabs = [
    { label: "Home", path: "/admin/dashboard", Icon: Home },
    { label: "Penghuni", path: "/admin/penghuni", Icon: Users },
    { label: "Kamar", path: "/admin/kamar", Icon: DoorOpen },
    { label: "Bayar", path: "/admin/pembayaran", Icon: CreditCard },
    { label: "Lainnya", path: "/admin/lainnya", Icon: Menu },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        const Icon = tab.Icon;

        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.item}
            onPress={() => router.replace(tab.path)}
          >
            <View style={styles.iconContainer}>
              <Icon
                size={22}
                color={active ? "#2563EB" : "#94A3B8"}
              />

              {tab.label === "Bayar" &&
                pembayaranMenunggu > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {pembayaranMenunggu}
                    </Text>
                  </View>
                )}
            </View>
            <Text style={[styles.text, active && styles.activeText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },
  activeText: {
    color: "#2563EB",
    fontWeight: "bold",
  },
  badge: {
  position: "absolute",
  top: -8,
  right: -10,
  backgroundColor: "#EF4444",
  minWidth: 18,
  height: 18,
  borderRadius: 9,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 4,
},

badgeText: {
  color: "#FFFFFF",
  fontSize: 10,
  fontWeight: "bold",
},

iconContainer: {
  position: "relative",
},
});