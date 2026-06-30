import { Alert, Platform } from "react-native";

/**
 * Cross-platform alert helper.
 * React Native's Alert.alert() does not render any UI on web (Expo web),
 * so we fall back to window.confirm / window.alert there.
 *
 * Usage is the same as Alert.alert(title, message, buttons)
 */
export function showAlert(title, message, buttons) {
  if (Platform.OS === "web") {
    const hasButtons = Array.isArray(buttons) && buttons.length > 0;

    // If there's a destructive/confirm action (e.g. Batal / Reset), use confirm()
    if (hasButtons && buttons.length > 1) {
      const confirmButton =
        buttons.find((b) => b.style === "destructive") ||
        buttons[buttons.length - 1];
      const cancelButton = buttons.find((b) => b.style === "cancel");

      const ok = window.confirm(`${title}\n\n${message || ""}`);
      if (ok) {
        confirmButton?.onPress?.();
      } else {
        cancelButton?.onPress?.();
      }
      return;
    }

    window.alert(`${title}${message ? `\n\n${message}` : ""}`);
    if (hasButtons) buttons[0]?.onPress?.();
    return;
  }

  Alert.alert(title, message, buttons);
}
