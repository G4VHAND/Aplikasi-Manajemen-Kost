import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Building2,
  Lock,
  LogIn,
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
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Building2 size={38} color="#2563EB" />
        </View>

        <Text style={styles.title}>KostKu</Text>
        <Text style={styles.subtitle}>
          Sistem Informasi Manajemen Kost
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Masuk Akun</Text>
          <Text style={styles.cardSubtitle}>
            Gunakan email dan password untuk masuk
          </Text>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Mail size={19} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
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
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.adminButton}
            onPress={handleLoginAdmin}
          >
            <ShieldCheck size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Masuk sebagai Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userButton}
            onPress={handleLoginUser}
          >
            <Users size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Masuk sebagai Penghuni</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/register")}
        >
          <UserPlus size={17} color="#2563EB" />
          <Text style={styles.registerText}>
            Belum punya akun? Daftar Penghuni
          </Text>
        </TouchableOpacity>

        <View style={styles.helperBox}>
          <LogIn size={15} color="#94A3B8" />
          <Text style={styles.helper}>
            Admin demo: admin@kost.com / admin123
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: "center",
  },
  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: "#DBEAFE",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
  },
  cardSubtitle: {
    color: "#64748B",
    marginTop: 4,
    marginBottom: 18,
  },
  label: {
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 10,
    color: "#0F172A",
  },
  adminButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 16,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  userButton: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 16,
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
  },
  registerButton: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  registerText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  helperBox: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  helper: {
    color: "#94A3B8",
    fontSize: 12,
  },
});