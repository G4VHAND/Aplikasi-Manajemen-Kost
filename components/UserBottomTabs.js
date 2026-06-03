import { router, usePathname } from "expo-router";
import {
  Bell,
  CreditCard,
  Home,
  MessageSquareWarning,
  User,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "../context/AppContext";

export default function UserBottomTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", path: "/user/dashboard", Icon: Home },
    { label: "Profil", path: "/user/profile", Icon: User },
    { label: "Tagihan", path: "/user/tagihan", Icon: CreditCard },
    { label: "Keluhan", path: "/user/keluhan", Icon: MessageSquareWarning },
    { label: "Info", path: "/user/pengumuman", Icon: Bell },
  ];

  const { pembayaran, user } = useApp();

  const tagihanAktif = pembayaran.filter(
    (item) => item.nama === user?.nama && item.status !== "Lunas"
  ).length;

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
            <View>
              <Icon
                size={22}
                color={active ? "#16A34A" : "#94A3B8"}
              />

              {tab.label === "Tagihan" && tagihanAktif > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {tagihanAktif}
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
    color: "#16A34A",
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
});