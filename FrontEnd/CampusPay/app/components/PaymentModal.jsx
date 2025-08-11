import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import colors from "../assets/utils/colors";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

import paymentImage from "../assets/images/payment.png";

const PIN_STORAGE_KEY = 'userSecurityPIN'; 

export default function PaymentModal({ data, Payto, receiverid }) {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
    if (!storedPin) {
        Alert.alert("PIN Not Set", "Please set up your security PIN from your profile before making payments.");
        return;
    }
    if (amount.trim()) {
        setShowPinInput(true);
    }
  };

  const handlePinVerify = async () => {
    if (pin.length !== 4) {
      Alert.alert("Invalid PIN", "Please enter your 4-digit PIN.");
      return;
    }
    setIsLoading(true);
    try {
      const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      if (pin === storedPin) {
        const token = await AsyncStorage.getItem("authToken");
        const payload = { receiverId: receiverid, amount: Number(amount), description: `Payment to ${Payto}` };
        await axios.post(
          `https://techrush-backend.onrender.com/api/transactions/send`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Alert.alert("Success!", "Payment sent successfully!");
        data(); // Close modal on success
      } else {
        Alert.alert("Incorrect PIN", "The PIN you entered is incorrect. Please try again.");
        setPin("");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Payment failed. Please try again.";
      Alert.alert("Payment Failed", errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (showPinInput) {
      setShowPinInput(false);
      setPin("");
    } else {
      data();
    }
  };

  return (
    <Modal transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>

          {!showPinInput && (
            <Image source={paymentImage} style={styles.paymentImage} resizeMode="contain" />
          )}

          <Text style={styles.title}>
            {showPinInput ? "Enter PIN to Confirm" : `Paying: ${Payto}`}
          </Text>

          {!showPinInput ? (
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ""))}
                placeholderTextColor="#bbb"
                editable={!isLoading}
              />
            </View>
          ) : isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.processingText}>Processing Payment...</Text>
            </View>
          ) : (
            <TextInput
              style={styles.pinInput}
              placeholder="••••"
              secureTextEntry
              keyboardType="number-pad"
              value={pin}
              onChangeText={setPin}
              maxLength={4}
              placeholderTextColor="#bbb"
              editable={!isLoading}
            />
          )}

          {!showPinInput ? (
            <TouchableOpacity
              style={[
                styles.payButton,
                (!amount.trim() || isLoading) && styles.payButtonDisabled,
              ]}
              onPress={handlePay}
              disabled={!amount.trim() || isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.payText}>
                {isLoading ? "Processing..." : "Pay Now"}
              </Text>
            </TouchableOpacity>
          ) : !isLoading ? (
            <TouchableOpacity
              style={[
                styles.payButton,
                (pin.length !== 4 || isLoading) && styles.payButtonDisabled,
              ]}
              onPress={handlePinVerify}
              disabled={pin.length !== 4 || isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.payText}>Verify & Pay</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton} activeOpacity={0.7}>
            <Text style={styles.cancelText}>{showPinInput ? "Back" : "Cancel"}</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 15,
    alignItems: "center",
  },
  paymentImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: "#222",
    marginBottom: 28,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 14,
    paddingHorizontal: 18,
    marginBottom: 28,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  currencySymbol: {
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    color: colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    color: colors.primary,
    paddingVertical: 14,
  },
  pinInput: {
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    letterSpacing: 26,
    width: "70%",
    backgroundColor: "#f0f0f0",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  payButtonDisabled: {
    backgroundColor: "#aacbff",
    shadowOpacity: 0,
  },
  payText: {
    color: colors.white,
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
  },
  cancelButton: {
    marginTop: 18,
  },
  cancelText: {
    color: "#555",
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 14,
    marginBottom: 28
  },
  processingText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: "Poppins-SemiBold",
    marginTop: 12,
  },
});
