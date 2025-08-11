import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../assets/utils/colors";
import { EPaymentModal } from "./EPaymentModal";
import { registerForEvent } from "../../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'https://techrush-backend.onrender.com';

const FallbackImage = ({ uri, style }) => {
  const [hasError, setHasError] = useState(!uri);
  return (
    <Image
      source={
        hasError
          ? require("../../../assets/images/event.png")
          : { uri }
      }
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

export const EventModal = ({ visible, item, onClose, onRegistrationSuccess }) => {
  if (!item) return null;

  const [isRegisterModalVisible, setRegisterModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!visible || !item) return;

      setIsCheckingStatus(true);
      try {
        const userId = await AsyncStorage.getItem("userID");
        if (userId && item.attendees && Array.isArray(item.attendees)) {
          const registered = item.attendees.some(attendee => {
            const attendeeId = typeof attendee === 'object' && attendee !== null ? attendee._id : attendee;
            return attendeeId === userId;
          });
          setIsAlreadyRegistered(registered);
        } else {
          setIsAlreadyRegistered(false);
        }
      } catch (error) {
        console.error("Failed to check registration status:", error);
        setIsAlreadyRegistered(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkRegistrationStatus();
  }, [visible, item]);

  const handleSuccessfulRegistration = () => {
    setIsAlreadyRegistered(true); 
    if (onRegistrationSuccess) {
      onRegistrationSuccess(item._id);
    }
    onClose();
  };

  const handleEventRegister = useCallback(async () => {
    if (item.eventType === "Paid") {
      setRegisterModal(true);
    } else {
      setIsRegistering(true);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Authentication Error", "You must be logged in to register.");
          setIsRegistering(false);
          return;
        }
        await registerForEvent(item._id);
        Alert.alert("Success!", "You have successfully registered for the event.");
        handleSuccessfulRegistration();
      } catch (error) {
        console.error("Event registration error:", error);
        Alert.alert("Error", "Failed to register for the event. You may have already registered.");
      } finally {
        setIsRegistering(false);
      }
    }
  }, [item, onClose, onRegistrationSuccess]);
  
  const formattedDate = item.date ? new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'Date not available';

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close-circle" size={32} color="#888" />
            </TouchableOpacity>

            <FallbackImage
              uri={
                item.coverImage
                  ? `${API_URL}${item.coverImage}`
                  : null
              }
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>{item.title}</Text>
            
            <View style={styles.infoRow}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                <Text style={styles.modalDescription}>
                    {item.description}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#c0392b" />
                <Text style={styles.modalDescription}>
                    {item.location || 'Location not specified'}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#2980b9" />
                <Text style={styles.modalDescription}>
                    {formattedDate}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={20} color="#27ae60" />
                <Text style={styles.modalDescription}>
                    {`${item.attendees?.length || 0} / ${item.capacity || 'Unlimited'} attendees`}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name={item.eventType === "Paid" ? "pricetag-outline" : "leaf-outline"} size={20} color={item.eventType === "Paid" ? "#f39c12" : "green"} />
                <Text style={[styles.modalDescription, { color: item.eventType === "Paid" ? "#f39c12" : "green", fontFamily: "Poppins-SemiBold" }]}>
                    {item.eventType}
                    {item.eventType === "Paid" && `: ₹${item.ticketPrice}`}
                </Text>
            </View>

            <TouchableOpacity 
              style={[styles.button, (isAlreadyRegistered || isRegistering || isCheckingStatus) && styles.buttonDisabled]} 
              onPress={handleEventRegister}
              disabled={isAlreadyRegistered || isRegistering || isCheckingStatus}
            >
              {isRegistering || isCheckingStatus ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.registertxt}>
                  {isAlreadyRegistered ? "Already Registered" : "Register Now!"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isRegisterModalVisible && (
        <EPaymentModal
          data={() => setRegisterModal(false)}
          eventID={item._id}
          onClose={handleSuccessfulRegistration}
          amount={item.ticketPrice}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  closeButton: { 
    position: "absolute", 
    top: 10, 
    right: 10, 
    zIndex: 1,
  },
  modalTitle: { 
    fontSize: 24, 
    fontFamily: "Poppins-Bold", 
    marginVertical: 15, 
    textAlign: "center",
    color: "#333",
  },
  modalDescription: { 
    flex: 1,
    fontSize: 15, 
    fontFamily: "Poppins-Regular",
    color: "#555",
    lineHeight: 22,
  },
  modalImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 15,
    gap: 10,
    paddingHorizontal: 5,
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 15,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#a9a9a9",
    shadowOpacity: 0,
    elevation: 0,
  },
  registertxt: {
    fontFamily: "Poppins-Bold",
    color: colors.white,
    fontSize: 16,
  },
});
