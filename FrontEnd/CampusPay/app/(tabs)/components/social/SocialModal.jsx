import { React, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../assets/utils/colors";

export const SocialModal = ({ visible, item, onClose }) => {
  if (!item) return null;
  const API_URL = 'https://techrush-backend.onrender.com';

  function handleUpvote() {
    Alert.alert("Upvoted!", "Thanks for your feedback.");
    onClose();
  }

  const FallbackImage = ({ uri, style }) => {
    const [hasError, setHasError] = useState(!uri);
    return (
      <Image
        source={
          hasError
            ? require("../../../assets/images/social.png")
            : { uri }
        }
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
            <Ionicons name="close-circle" size={32} color="#888" />
          </TouchableOpacity>

          <FallbackImage
            uri={
              item.image
                ? `${API_URL}${item.image}`
                : null
            }
            style={styles.modalImage}
          />
          <View style={styles.authorContainer}>
            <Image 
              source={ item.author?.profilePicture ? { uri: `${API_URL}${item.author.profilePicture}` } : require('../../../assets/images/studentProfile.png')} 
              style={styles.authorImage} 
            />
            <Text style={styles.authorName}>{item.author?.name || 'Campus User'}</Text>
          </View>

          <Text style={styles.modalContent}>
            {item.content}
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleUpvote}>
            <Ionicons name="arrow-up-circle" size={24} color={colors.white} />
            <Text style={styles.registertxt}>Upvote</Text>
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
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  authorName: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: '#333'
  },
  modalContent: { 
    fontSize: 15, 
    fontFamily: "Poppins-Regular",
    color: '#555',
    width: '100%',
    lineHeight: 22,
    marginVertical: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 15,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'red',
    flexDirection: 'row',
    gap: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  registertxt: {
    fontFamily: "Poppins-Bold",
    color: colors.white,
    fontSize: 16,
  },
});
