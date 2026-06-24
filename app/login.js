import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

export default function LoginScreen() {
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginAdmin = async () => {
    const result = await login("admin", email, password);

    if (!result.success) {
      Alert.alert("Login Gagal", result.message);
      return;
    }

    router.replace("/admin/dashboard");
  };

  const handleLoginUser = async () => {
    const result = await login("user", email, password);

    if (!result.success) {
      Alert.alert("Login Gagal", result.message);
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
            <Building2 size={40} color="#2563EB" />
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
            <Mail size={19} color="#64748B" />
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
            <Lock size={19} color="#64748B" />
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
          <UserPlus size={18} color="#2563EB" />
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
    backgroundColor: "#F8FAFC",
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
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
  },
  cardSubtitle: {
    color: "#64748B",
    marginTop: 5,
    lineHeight: 20,
  },
  label: {
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 7,
  },
  inputWrapper: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 15,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    color: "#0F172A",
  },
  adminButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 18,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  userButton: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 18,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
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
    color: "#2563EB",
    fontWeight: "800",
  },
  demoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  demoTitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
  },
  demoText: {
    color: "#0F172A",
    fontWeight: "bold",
    marginTop: 4,
  },
});