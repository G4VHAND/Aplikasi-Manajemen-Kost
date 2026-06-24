import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
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
  ArrowLeft,
  Camera,
  Home,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  UserPlus,
} from "lucide-react-native";

import { useApp } from "../context/AppContext";

export default function RegisterScreen() {
  const { registerPenghuni } = useApp();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState("");

  const pilihFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!nama || !email || !noHp || !alamat || !password) {
      Alert.alert("Peringatan", "Semua data wajib diisi");
      return;
    }

    const result = await registerPenghuni({
      nama,
      email,
      noHp,
      alamat,
      password,
      foto,
    });

    if (!result.success) {
      Alert.alert("Registrasi Gagal", result.message);
      return;
    }

    Alert.alert(
      "Registrasi Berhasil",
      "Akun Anda menunggu konfirmasi admin."
    );

    router.replace("/login");
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Home size={34} color="#2563EB" />
          </View>

          <Text style={styles.title}>Daftar Penghuni</Text>
          <Text style={styles.subtitle}>
            Lengkapi data diri untuk mengajukan akun penghuni kost
          </Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.photoBox} onPress={pilihFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={30} color="#2563EB" />
                <Text style={styles.photoText}>Pilih Foto</Text>
              </View>
            )}
          </TouchableOpacity>

          <InputField
            Icon={User}
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={nama}
            onChangeText={setNama}
          />

          <InputField
            Icon={Mail}
            label="Email"
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            Icon={Phone}
            label="Nomor HP"
            placeholder="Masukkan nomor HP"
            value={noHp}
            onChangeText={setNoHp}
            keyboardType="phone-pad"
          />

          <InputField
            Icon={MapPin}
            label="Alamat Asal"
            placeholder="Masukkan alamat asal"
            value={alamat}
            onChangeText={setAlamat}
          />

          <InputField
            Icon={Lock}
            label="Password"
            placeholder="Buat password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <UserPlus size={19} color="#FFFFFF" />
            <Text style={styles.buttonText}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.loginText}>Sudah punya akun? Masuk</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({ Icon, label, ...props }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon size={19} color="#64748B" />
        <TextInput
          style={styles.input}
          placeholderTextColor="#94A3B8"
          {...props}
        />
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
    padding: 24,
    paddingTop: 54,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  hero: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  photoBox: {
    alignSelf: "center",
    marginBottom: 22,
  },
  photo: {
    width: 116,
    height: 116,
    borderRadius: 38,
    backgroundColor: "#E2E8F0",
  },
  photoPlaceholder: {
    width: 116,
    height: 116,
    borderRadius: 38,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  photoText: {
    color: "#2563EB",
    fontWeight: "800",
    marginTop: 6,
    fontSize: 13,
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
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 18,
    marginTop: 6,
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
  loginButton: {
    marginTop: 22,
  },
  loginText: {
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "800",
  },
});