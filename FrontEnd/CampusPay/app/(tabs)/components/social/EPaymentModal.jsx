import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import colors from "../../../assets/utils/colors";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForEvent } from "../../services/apiService";

const PIN_STORAGE_KEY = 'userSecurityPIN';

export const EPaymentModal = ({ data, eventID, onClose, amount }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterForEvent = useCallback(async () => {
    if (!pin.trim() || pin.length !== 4) {
      setError("Please enter a valid 4-digit PIN.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);

      if (!storedPin) {
        Alert.alert(
          "PIN Not Set",
          "You need to set a security PIN in your profile before making payments.",
          [{ text: "OK", onPress: () => {
            data(); 
            onClose(); 
          }}]
        );
        setIsLoading(false);
        return;
      }

      if (pin !== storedPin) {
        setError("Incorrect PIN. Please try again.");
        setPin("");
        setIsLoading(false);
        return;
      }

      await registerForEvent(eventID);
      Alert.alert("Success!", "You have successfully registered for the event.");
      data(); // Close this modal
      onClose(); // Trigger success actions on the parent modal
    } catch (error) {
      console.error("Event registration error:", error);
      const errorMessage = error.response?.data?.message || "Failed to register. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [eventID, data, pin, onClose]);

  return (
    <Modal transparent={true} animationType="fade" accessible={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <Image source={require('../../../assets/images/payment.png')} style={styles.paymentImage} />
          <Text style={styles.title}>Confirm Registration</Text>
          <Text style={styles.amountText}>
            You are paying <Text style={{fontFamily: 'Poppins-Bold'}}>₹{amount}</Text>
          </Text>
          <Text style={styles.subtitle}>Enter your 4-digit PIN to confirm</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.pinInput}
            placeholder="••••"
            secureTextEntry={true}
            keyboardType="number-pad"
            value={pin}
            onChangeText={setPin}
            maxLength={4}
            placeholderTextColor="#bbb"
            accessibilityLabel="PIN input"
          />
          
          <TouchableOpacity
            style={[styles.payButton, (isLoading || pin.length !== 4) && styles.payButtonDisabled]}
            onPress={handleRegisterForEvent}
            disabled={isLoading || pin.length !== 4}
          >
            {isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.payText}>Pay & Register</Text>}
          </TouchableOpacity>
      
          <TouchableOpacity style={styles.cancelButton} onPress={data}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 25,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  paymentImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#333",
    textAlign: "center",
  },
  amountText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#444',
    marginTop: 5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  pinInput: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    letterSpacing: 20,
    width: "80%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  payButtonDisabled: {
    backgroundColor: "#a0c4ff",
    shadowOpacity: 0,
  },
  payText: {
    color: colors.white,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelText: {
    color: "#777",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});
