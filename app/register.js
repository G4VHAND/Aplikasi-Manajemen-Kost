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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
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
        <Text style={styles.title}>Daftar Penghuni</Text>
        <Text style={styles.subtitle}>
          Lengkapi data diri untuk registrasi kost
        </Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.photoBox} onPress={pilihFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>📷</Text>
                <Text style={styles.photoText}>Pilih Foto</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama lengkap"
            value={nama}
            onChangeText={setNama}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Nomor HP</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nomor HP"
            value={noHp}
            onChangeText={setNoHp}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Alamat Asal</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan alamat asal"
            value={alamat}
            onChangeText={setAlamat}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Buat password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.loginText}>Sudah punya akun? Masuk</Text>
        </TouchableOpacity>
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
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
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
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  photoBox: {
    alignSelf: "center",
    marginBottom: 20,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  photoIcon: {
    fontSize: 28,
  },
  photoText: {
    color: "#2563EB",
    fontWeight: "700",
    marginTop: 4,
  },
  label: {
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 16,
    marginTop: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "700",
    marginTop: 20,
  },
});