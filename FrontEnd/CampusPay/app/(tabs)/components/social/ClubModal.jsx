import { React, useState, useEffect } from "react";
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
import { joinClub } from "../../services/apiService";
import colors from "../../../assets/utils/colors";
import { CPaymentModal } from "./CPaymentModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ClubModal = ({ visible, item, onClose, onJoinSuccess }) => {
  if (!item) return null;

  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkMembershipStatus = async () => {
      if (!visible || !item) return;

      setIsCheckingStatus(true);
      try {
        const userId = await AsyncStorage.getItem("userID");
        if (userId && item.members && Array.isArray(item.members)) {
          // FIX: Check against the members array from the item prop directly
          const joined = item.members.some(member => {
            const memberId = typeof member.user === 'object' && member.user !== null ? member.user._id : member.user;
            return memberId === userId;
          });
          setIsAlreadyJoined(joined);
        } else {
          setIsAlreadyJoined(false);
        }
      } catch (error) {
        console.error("Failed to check membership status:", error);
        setIsAlreadyJoined(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkMembershipStatus();
  }, [visible, item]);

  const FallbackImage = ({ uri, style }) => {
    const [hasError, setHasError] = useState(!uri);
    return (
      <Image
        source={
          hasError
            ? require("../../../assets/images/club.webp")
            : { uri }
        }
        style={style}
        onError={() => setHasError(true)}
      />
    );
  };

  const handleSuccessfulJoin = () => {
    setIsAlreadyJoined(true);
    if (onJoinSuccess) {
      onJoinSuccess(item._id);
    }
    onClose();
  };

  const handleClubJoin = async () => {
    if (item.eventType === "Paid") {
      setIsJoinModalVisible(true);
    } else {
      setIsJoining(true);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Authentication Error", "You must be logged in to join.");
          setIsJoining(false);
          return;
        }
        await joinClub(item._id);
        Alert.alert("Success!", "You have successfully joined the club.");
        handleSuccessfulJoin();
      } catch (error) {
        console.error("Join club error:", error);
        Alert.alert("Error", "Failed to join the club. You may have already joined.");
      } finally {
        setIsJoining(false);
      }
    }
  };

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
                  ? `https://techrush-backend.onrender.com${item.coverImage}`
                  : null
              }
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>{item.name || item.title}</Text>
            
            <View style={styles.infoRow}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                <Text style={styles.modalDescription}>
                    {item.description || item.content}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name={item.eventType === "Paid" ? "pricetag-outline" : "leaf-outline"} size={20} color={item.eventType === "Paid" ? "#c48b00" : "green"} />
                <Text style={[styles.modalDescription, { color: item.eventType === "Paid" ? "#c48b00" : "green", fontFamily: "Poppins-SemiBold" }]}>
                    {item.eventType}
                    {item.eventType === "Paid" && `: ₹${item.ticketPrice}`}
                </Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.button, 
                (isJoining || isCheckingStatus) && styles.buttonDisabled,
                isAlreadyJoined && styles.buttonJoined
              ]} 
              onPress={handleClubJoin}
              disabled={isAlreadyJoined || isJoining || isCheckingStatus}
            >
              {isJoining || isCheckingStatus ? (
                <ActivityIndicator color={colors.white} />
              ) : isAlreadyJoined ? (
                <View style={styles.joinedContainer}>
                  <Ionicons name="checkmark-circle" size={22} color={colors.white} />
                  <Text style={styles.registertxt}>Already Joined</Text>
                </View>
              ) : (
                <Text style={styles.registertxt}>Register Now!</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {isJoinModalVisible && (
        <CPaymentModal
          data={() => setIsJoinModalVisible(false)}
          clubID={item._id}
          Close={handleSuccessfulJoin}
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
  buttonJoined: {
    backgroundColor: "#27ae60",
    shadowColor: "#27ae60",
    shadowOpacity: 0.3,
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registertxt: {
    fontFamily: "Poppins-Bold",
    color: colors.white,
    fontSize: 16,
  },
});
