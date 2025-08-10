// app/(tabs)/components/social/EventSocialModal.jsx
import { React, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../assets/utils/colors";
export const EventModal = ({ visible, item, onClose }) => {
  if (!item) return null;

  const FallbackImage = ({ uri, style, type }) => {
    const [hasError, setHasError] = useState(!uri);

    const getDefaultImage = () => {
      switch (type) {
        case "event":
          return require("../../../assets/images/event.png");
        case "social":
          return require("../../../assets/images/social.png");
        case "club":
        default:
          return require("../../../assets/images/club.webp");
      }
    };

    return (
      <Image
        source={hasError ? getDefaultImage() : { uri }}
        style={style}
        onError={() => setHasError(true)}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#555" />
          </TouchableOpacity>

          <FallbackImage
            uri={
              item.coverImage
                ? `https://techrush-backend.onrender.com${item.coverImage}`
                : null
            }
            style={styles.modalImage}
            type="event"
          />
          <Text style={styles.modalTitle}>{item.name || item.title}</Text>
          <Text style={styles.modalDescription}>
            <Text style={{ fontFamily: "Poppins-Bold" }}>Description: </Text>
            {item.description || item.content}
          </Text>
          <Text
            style={[
              styles.modalDescription,
              { color: "green", fontFamily: "Poppins-SemiBold" },
            ]}
          >
          
            <Text style={{ fontFamily: "Poppins-Bold" }}>Type: </Text>
            {item.eventType}
          </Text>
          {item.eventType == "Paid" ? (
            <Text
              style={[
                styles.modalDescription,
                { color: "green", fontFamily: "Poppins-SemiBold" },
              ]}
            >
              <Text style={{ fontFamily: "Poppins-Bold" }}>Price: </Text>
              {item.ticketPrice}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.button}>
            <Text style={styles.registertxt}>Register Now!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
  },
  closeButton: { alignSelf: "flex-end", position: "absolute", margin: 3 },
  modalTitle: { fontSize: 22, fontFamily: "Poppins-Bold", marginVertical: 10,textAlign:"center" },
  modalDescription: { fontSize: 16, fontFamily: "Poppins-Regular" },
  modalImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e9e9e9",
    borderRadius: 20,
  },
  button: {
    width: "45%",
    height: 55,
    borderRadius: 12,
    alignSelf: "center",
    margin: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  registertxt: {
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
});
