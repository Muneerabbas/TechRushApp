//components/PaymentModal.jsx
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import colors from "../assets/utils/colors";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentModal({ data, Payto, receiverid }) {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);

  const handlePay = async () => {
    if (!amount.trim()) {
      return;
    }
    setShowPinInput(true);
  };

  const handlePinVerify = async () => {
    if (!pin.trim()) {
      alert("Please enter your PIN.");
      return;
    }

    try {
      const storedPin = await AsyncStorage.getItem("userPin");

      if (pin === storedPin) {
        const token = await AsyncStorage.getItem("authToken");

        const payload = {
          receiverId: receiverid,
          amount: Number(amount),
        };

        const res = await axios.post(
          `transactions/send`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Transaction successful:", res.data);
        alert("Payment successful!");
        data(); 
      } else {
        alert("Incorrect PIN. Please try again.");
        setPin(""); 
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
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
    <Modal transparent={true} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {showPinInput ? "Enter PIN" : `Paying: ${Payto}`}
          </Text>

          {!showPinInput ? (
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9.]/g, "");
                  setAmount(numericValue);
                }}
                placeholderTextColor="#aaa"
              />
            </View>
          ) : (
            <TextInput
              style={styles.pinInput}
              placeholder="••••"
              secureTextEntry={true}
              keyboardType="number-pad"
              value={pin}
              onChangeText={setPin}
              maxLength={4} 
              placeholderTextColor="#aaa"
            />
          )}

          {/* Conditional Buttons */}
          {!showPinInput ? (
            <TouchableOpacity
              style={[styles.payButton, !amount.trim() && styles.payButtonDisabled]}
              onPress={handlePay}
              disabled={!amount.trim()}
            >
              <Text style={styles.payText}>Pay Now</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.payButton, !pin.trim() && styles.payButtonDisabled]}
              onPress={handlePinVerify}
              disabled={!pin.trim()}
            >
              <Text style={styles.payText}>Verify PIN</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
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
  title: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 25,
    color: "#333",
    textAlign: "center",
  },
  // Amount input styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
    width: "100%",
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: colors.primary,
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: colors.primary,
    paddingVertical: 12,
  },
  // PIN input styles
  pinInput: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    letterSpacing: 25,
    width: "70%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 25,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
  },
  payButtonDisabled: {
    backgroundColor: "#a0c4ff",
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