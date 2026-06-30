import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react-native";

import { useApp } from "../context/AppContext";
import { showAlert } from "../utils/showAlert";
import { COLORS } from "../constants/theme";

export default function LoginScreen() {
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginAdmin = async () => {
    const result = await login("admin", email, password);

    if (!result.success) {
      showAlert("Login Gagal", result.message);
      return;
    }

    router.replace("/admin/dashboard");
  };

  const handleLoginUser = async () => {
    const result = await login("user", email, password);

    if (!result.success) {
      showAlert("Login Gagal", result.message);
      return;
    }

    router.replace("/user/dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Building2 size={36} color={COLORS.primaryDark} />
          </View>

          <Text style={styles.title}>KostKu</Text>
          <Text style={styles.subtitle}>
            Sistem Informasi Manajemen Kost Berbasis Mobile
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Masuk Akun</Text>
            <Text style={styles.cardSubtitle}>
              Pilih role sesuai akun yang digunakan
            </Text>
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Mail size={19} color={COLORS.gray} />
            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={19} color={COLORS.gray} />
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.adminButton} onPress={handleLoginAdmin}>
            <ShieldCheck size={19} color="#FFFFFF" />
            <Text style={styles.buttonText}>Masuk sebagai Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.userButton} onPress={handleLoginUser}>
            <Users size={19} color="#FFFFFF" />
            <Text style={styles.buttonText}>Masuk sebagai Penghuni</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/register")}
        >
          <UserPlus size={18} color={COLORS.primaryDark} />
          <Text style={styles.registerText}>Daftar Penghuni Baru</Text>
        </TouchableOpacity>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Akun Demo Admin</Text>
          <Text style={styles.demoText}>admin@kost.com / admin123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  hero: {
    alignItems: "center",
    marginBottom: 26,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  title: {
    fontSize: 34,
    fontWeight: "600",
    color: COLORS.dark,
  },
  subtitle: {
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.dark,
  },
  cardSubtitle: {
    color: COLORS.gray,
    marginTop: 5,
    lineHeight: 20,
  },
  label: {
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 7,
  },
  inputWrapper: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    color: COLORS.dark,
  },
  adminButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  userButton: {
    backgroundColor: COLORS.accentDark,
    padding: 16,
    borderRadius: 14,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
  registerButton: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  registerText: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
  demoBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  demoTitle: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: "600",
  },
  demoText: {
    color: COLORS.dark,
    fontWeight: "600",
    marginTop: 4,
  },
});