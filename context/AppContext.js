import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [penghuni, setPenghuni] = useState([]);
  const [kamar, setKamar] = useState([]);
  const [pembayaran, setPembayaran] = useState([]);
  const [keluhan, setKeluhan] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [riwayatPenghuni, setRiwayatPenghuni] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const normalizeUser = (data) => ({
    id: data.id,
    nama: data.name,
    email: data.email,
    role: data.role,
    noHp: data.phone,
    alamat: data.address,
    foto: data.photo,
    kamar: data.room_number,
    status: data.status,
  });

  const normalizePenghuni = (data) =>
    data.map((item) => ({
      id: item.id,
      nama: item.name,
      email: item.email,
      noHp: item.phone,
      alamat: item.address,
      foto: item.photo,
      kamar: item.room_number || "-",
      status: item.status,
      exit_date: item.exit_date,
    }));

  const normalizeKamar = (data) =>
    data.map((item) => ({
      id: item.id,
      nomor: item.number,
      harga: Number(item.price),
      status: item.status,
    }));

  const normalizePembayaran = (data) =>
  data.map((item) => ({
    id: item.id,
    user_id: item.user_id,
    nama: item.user?.name || "-",
    kamar: item.room_number || "-",
    bulan: item.month,
    start_month: item.start_month,
    month_count: item.month_count || 1,
    jumlah: Number(item.amount),
    paid_amount: Number(item.paid_amount || 0),
    remaining_amount: Number(item.remaining_amount || 0),
    status: item.status,
    metode: item.method,
    proof: item.proof,
  }));

  const normalizeKeluhan = (data) =>
    data.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      nama: item.user?.name || "-",
      email: item.user?.email || "-",
      isi: item.content,
      status: item.status,
    }));

  const normalizePengumuman = (data) =>
    data.map((item) => ({
      id: item.id,
      judul: item.title,
      isi: item.content,
    }));

  const loadData = async () => {
    try {
      const dataUser = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (dataUser) {
        setUser(JSON.parse(dataUser));
      }

      if (token) {
        await refreshData();
      }
    } catch (error) {
      console.log("Gagal memuat data:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [
        penghuniRes,
        historyRes,
        kamarRes,
        pembayaranRes,
        keluhanRes,
        pengumumanRes,
      ] = await Promise.all([
        api.get("/users"),
        api.get("/users/history"),
        api.get("/rooms"),
        api.get("/payments"),
        api.get("/complaints"),
        api.get("/announcements"),
      ]);

      setPenghuni(normalizePenghuni(penghuniRes.data));
      setRiwayatPenghuni(normalizePenghuni(historyRes.data));
      setKamar(normalizeKamar(kamarRes.data));
      setPembayaran(normalizePembayaran(pembayaranRes.data));
      setKeluhan(normalizeKeluhan(keluhanRes.data));
      setPengumuman(normalizePengumuman(pengumumanRes.data));
    } catch (error) {
      console.log(
        "Gagal refresh data:",
        error?.response?.data || error.message
      );
    }
  };

  const login = async (role, email = "", password = "") => {
    try {
      if (!email.trim() || !password.trim()) {
        return {
          success: false,
          message: "Email dan password wajib diisi",
        };
      }

      const response = await api.post("/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      const dataUser = normalizeUser(response.data.user);

      if (dataUser.role !== role) {
        return {
          success: false,
          message:
            role === "admin"
              ? "Akun ini bukan admin"
              : "Akun ini bukan penghuni",
        };
      }

     await AsyncStorage.setItem("token", response.data.token);
     await AsyncStorage.setItem("user", JSON.stringify(dataUser));
     setUser(dataUser);

     await refreshData();

     return { success: true };
    } catch (error) {
        console.log("LOGIN ERROR");
        console.log(error.response?.status);
        console.log(error.response?.data);
        console.log(error.message);

        return {
          success: false,
          message:
            error?.response?.data?.message ||
            "Login gagal",
        };
      }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.log("Logout API gagal:", error?.response?.data || error.message);
    }

    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    setUser(null);
    setPenghuni([]);
    setKamar([]);
    setPembayaran([]);
    setKeluhan([]);
    setPengumuman([]);
    setRiwayatPenghuni([]);
  };

  const registerPenghuni = async (data) => {
    try {
      await api.post("/register", {
        name: data.nama,
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phone: data.noHp,
        address: data.alamat,
      });

      return {
        success: true,
        message: "Registrasi berhasil, menunggu konfirmasi admin",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.email?.[0] ||
          "Registrasi gagal",
      };
    }
  };

  const konfirmasiPenghuni = async (id, nomorKamar) => {
    await api.put(`/users/${id}/confirm`, {
      room_number: nomorKamar,
    });

    await refreshData();
  };

  const tambahKamar = async (nomor, harga) => {
    await api.post("/rooms", {
      number: nomor,
      price: Number(harga),
    });

    await refreshData();
  };

  const hapusKamar = async (id) => {
    await api.delete(`/rooms/${id}`);
    await refreshData();
  };

  const editKamar = async (id, dataBaru) => {
    await api.put(`/rooms/${id}`, {
      number: dataBaru.nomor,
      price: Number(dataBaru.harga),
      status: dataBaru.status,
    });

    await refreshData();
  };

  const hapusPenghuni = async (id) => {
    try {
      const res = await api.delete(`/users/${id}`);

      console.log("DELETE SUCCESS:", res.data);

      await refreshData();
    } catch (error) {
      console.log(
        "DELETE ERROR:",
        error?.response?.data || error.message
      );
    }
  };

  const tambahPembayaran = async (room_number, start_month, month_count) => {
    await api.post("/payments", {
      room_number,
      start_month,
      month_count: Number(month_count),
    });

    await refreshData();
  };

  const tandaiLunas = async (id) => {
    await api.put(`/payments/${id}/paid`);
    await refreshData();
  };

  const hapusPembayaran = async (id) => {
    await api.delete(`/payments/${id}`);
    await refreshData();
  };

  const editPembayaran = async (id, dataBaru) => {
    await api.put(`/payments/${id}`, {
      month: dataBaru.bulan,
      amount: Number(dataBaru.jumlah),
      status: dataBaru.status,
      method: dataBaru.metode || null,
    });

    await refreshData();
  };

  const ajukanPembayaran = async (
    id,
    metode,
    paidAmount,
    bukti = null
  ) => {
    const formData = new FormData();

    formData.append("method", metode);
    formData.append("paid_amount", Number(paidAmount));

    if (bukti) {
      formData.append("proof", {
        uri: bukti.uri,
        name: bukti.fileName || "bukti-pembayaran.jpg",
        type: bukti.mimeType || "image/jpeg",
      });
    }

    const response = await api.post(`/payments/${id}/submit`, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("AJUKAN PEMBAYARAN RESPONSE:", response.data);

    await refreshData();
  };

  const tambahKeluhan = async (isi) => {
    await api.post("/complaints", {
      user_id: user.id,
      content: isi,
    });

    await refreshData();
  };

  const ubahStatusKeluhan = async (id, statusBaru) => {
    await api.put(`/complaints/${id}/status`, {
      status: statusBaru,
    });

    await refreshData();
  };

  const hapusKeluhan = async (id) => {
    await api.delete(`/complaints/${id}`);
    await refreshData();
  };

  const tambahPengumuman = async (judul, isi) => {
    await api.post("/announcements", {
      title: judul,
      content: isi,
    });

    await refreshData();
  };

  const hapusPengumuman = async (id) => {
    await api.delete(`/announcements/${id}`);
    await refreshData();
  };

  const editPenghuni = async (id, dataBaru) => {
    await api.put(`/users/${id}`, {
      name: dataBaru.nama,
      phone: dataBaru.noHp,
      address: dataBaru.alamat,
      room_number: dataBaru.kamar,
    });

    await refreshData();
  };

  const resetData = async () => {
    await AsyncStorage.clear();

    setUser(null);
    setPenghuni([]);
    setKamar([]);
    setPembayaran([]);
    setKeluhan([]);
    setPengumuman([]);
    setRiwayatPenghuni([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshData,

        penghuni,
        registerPenghuni,
        konfirmasiPenghuni,
        hapusPenghuni,
        editPenghuni,
        riwayatPenghuni,

        kamar,
        tambahKamar,
        hapusKamar,
        editKamar,

        pembayaran,
        tambahPembayaran,
        tandaiLunas,
        hapusPembayaran,
        editPembayaran,
        ajukanPembayaran,

        keluhan,
        tambahKeluhan,
        ubahStatusKeluhan,
        hapusKeluhan,

        pengumuman,
        tambahPengumuman,
        hapusPengumuman,

        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}