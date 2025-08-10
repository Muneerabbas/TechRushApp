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
  import colors from "../../../assets/utils/colors";
  import { useState, useCallback } from "react";
  import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { joinClub } from "../../services/apiService";
  
  export const CPaymentModal = ({ data, clubID ,Close}) => {
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [showPinInput, setShowPinInput] = useState(true);
    const [error, setError] = useState("");
  
    const handlePay = async () => {
      if (!amount.trim() || isNaN(amount) || Number(amount) <= 0) {
        setError("Please enter a valid amount.");
        return;
      }
      setError("");
      setShowPinInput(true);
    };
  
    // const handlePinVerify = async () => {
    //   if (!pin.trim() || pin.length !== 4) {
    //     setError("Please enter a valid 4-digit PIN.");
    //     return;
    //   }
  
    //   try {
    //     const storedPin = await AsyncStorage.getItem("userPin");
  
    //     if (pin !== storedPin) {
    //       setError("Incorrect PIN. Please try again.");
    //       setPin("");
    //       return;
    //     }
  
    //     const token = await AsyncStorage.getItem("authToken");
    //     if (!token) {
    //       setError("Authentication token not found.");
    //       return;
    //     }
  
    //     // Example API call for payment
    //     const res = await axios.post(
    //       "https://api.example.com/payment", // Replace with actual API endpoint
    //       { amount: Number(amount), clubID },
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );
  
    //     console.log("Transaction successful:", res.data);
    //     alert("Payment successful!");
    //     setAmount("");
    //     setPin("");
    //     setShowPinInput(false);
    //     data(); // Assuming data is a callback to close modal or refresh
    //   } catch (error) {
    //     console.error("Payment error:", error);
    //     setError("Payment failed. Please try again.");
    //   }
    // };
  
    const handleJoinClub = useCallback(async () => {
      if (!pin.trim() || pin.length !== 4) {
        setError("Please enter a valid 4-digit PIN.");
        return;
      }
  
      try {
        const storedPin = await AsyncStorage.getItem("userPin");
  
        if (pin !== storedPin) {
          setError("Incorrect PIN. Please try again.");
          setPin("");
          return;
        }
  
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found.");
          return;
        }
  
        const res = await joinClub(clubID);
        console.log("Join club successful:", res.data);
        alert("Successfully joined the club!");
        setPin("");
        setShowPinInput(false);
        data();
        Close();
      } catch (error) {
        console.error("Join club error:", error);
        console.log(clubID)
        setError("Failed to join club. Please try again.");
      }
    }, [clubID, data, pin]);
  
    
  
    return (
      <Modal transparent={true} animationType="fade" accessible={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.title} accessibilityRole="header">
              Enter PIN
            </Text>
  
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
  
          
              <TextInput
                style={styles.pinInput}
                placeholder="••••"
                secureTextEntry={true}
                keyboardType="number-pad"
                value={pin}
                onChangeText={setPin}
                maxLength={4}
                placeholderTextColor="#aaa"
                accessibilityLabel="PIN input"
              />
            
  
           
              <TouchableOpacity
                style={[styles.payButton, !pin.trim() && styles.payButtonDisabled]}
                onPress={handleJoinClub}
                disabled={!pin.trim()}
                accessibilityRole="button"
                accessibilityLabel="Verify PIN"
              >
                <Text style={styles.payText}>Verify PIN</Text>
              </TouchableOpacity>
          
  <TouchableOpacity
  style={styles.cancelButton}
  onPress={data}
  ><Text style={styles.cancelText}> Cancel</Text></TouchableOpacity>
           
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
    errorText: {
      color: "red",
      fontFamily: "Poppins-Regular",
      fontSize: 14,
      marginBottom: 15,
      textAlign: "center",
    },
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
    pinInput: {
      fontSize: 24,
      fontFamily: "Poppins-Bold",
      textAlign: "center",
      letterSpacing: 10, 
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