import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (role && user.role !== role) {
    if (user.role === "admin") {
      return <Redirect href="/admin/dashboard" />;
    }

    return <Redirect href="/user/dashboard" />;
  }

  return children;
}