import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/utils/colors";
import { useState } from "react";

export default function PaymentModal({ data }) {
  const [amount, setAmount] = useState("");

  const handlePay = () => {
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    // Handle actual payment logic here
    console.log("Paying amount:", amount);
    data(); // Close modal
  };

  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Enter Amount</Text>
          <Text style={[styles.title,{fontSize:20, color:colors.blac}]}>Paying: Muneer Abass</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <TouchableOpacity style={styles.payButton} onPress={handlePay}>
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={data}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 20,
  },
  input: {
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    flex: 1,
  },
  payButton: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  payText: {
    color: colors.text,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  cancelText: {
    color: "red",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    marginTop: 5,
  },
});
