import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const hostUri =
  Constants.expoConfig?.hostUri ||
  Constants.manifest2?.extra?.expoGo?.debuggerHost;

const ip = hostUri?.split(":")[0];

export const BASE_URL = `http://${ip}:8000`;
export const STORAGE_URL = `${BASE_URL}/storage`;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
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