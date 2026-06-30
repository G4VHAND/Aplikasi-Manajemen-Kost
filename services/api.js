import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

function resolveHost() {
  // Web: Expo's hostUri (LAN IP) doesn't apply. Use the browser's own host.
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location?.hostname) {
      return window.location.hostname;
    }
    return "localhost";
  }

  // Native (Expo Go / dev build): derive LAN IP from Expo's hostUri
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  const ip = hostUri?.split(":")[0];
  return ip || "localhost";
}

const host = resolveHost();

export const BASE_URL = `http://${host}:8000`;
export const STORAGE_URL = `${BASE_URL}/storage`;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

console.log("API URL:", `${BASE_URL}/api`);

export default api;