// app/(tabs)/postForm.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const primaryColor = "#007AFF";
// Define your API's base URL here. The category will be appended to this.
const API_BASE_URL = "https://techrush-backend.onrender.com/api/";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [membershipType, setMembershipType] = useState(null);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow gallery access.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Submit post
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category || !membershipType) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
  
    if (membershipType === "Paid") {
      const numericPrice = parseFloat(price);
      if (!price.trim() || isNaN(numericPrice) || numericPrice <= 0) {
        Alert.alert("Error", "Please enter a valid price for paid posts.");
        return;
      }
    }
  
    setLoading(true);
  
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        setLoading(false);
        return;
      }
  
      const formData = new FormData();
      let imageKey = "coverImage";
      let endpoint = `${API_BASE_URL}${category.toLowerCase()}`;
      
      // Separate logic for each category to match backend controller requirements
      if (category === "Social") {
        // Backend Social Controller expects 'content' and 'image'
        formData.append("content", description);
        imageKey = "image";
      } else if (category === "Clubs") {
        // Backend Club Controller expects 'name', 'description', 'eventType', 'ticketPrice', and 'coverImage'
        formData.append("name", title);
        formData.append("description", description);
        formData.append("eventType", membershipType);
        if (membershipType === "Paid") {
          formData.append("ticketPrice", parseFloat(price));
        }
      } else if (category === "Events") {
        // Backend Event Controller expects 'title', 'description', 'eventType', 'ticketPrice', and 'coverImage'.
        // NOTE: The backend `createEvent` controller also expects 'date', 'location', 'capacity', and 'visibility',
        // which are not currently included in the form. This might cause a server error if they are required fields.
        formData.append("title", title);
        formData.append("description", description);
        formData.append("eventType", membershipType);
        if (membershipType === "Paid") {
          formData.append("ticketPrice", parseFloat(price));
        }
      }
  
      // Append the image using the correct key
      if (image) {
        formData.append(imageKey, {
          uri: image,
          type: "image/jpeg",
          name: "upload.jpg",
        });
      }
  
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      Alert.alert("Success", "Post submitted successfully!");
      setTitle("");
      setDescription("");
      setCategory(null);
      setMembershipType(null);
      setPrice("");
      setImage(null);
  
    } catch (error) {
      console.error("Error submitting post:", error?.response?.data || error.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to submit post."
      );
    } finally {
      setLoading(false);
    }
  };
  

  const categories = ["Clubs", "Events", "Social"];
  const membershipOptions = [
    { label: "Free", value: "Free" },
    { label: "Paid", value: "Paid" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Make a New Post!</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title..."
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter description..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.row}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.button,
              category === item && styles.buttonSelected,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.buttonText,
                category === item && styles.buttonTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Membership Type</Text>
      <View style={styles.row}>
        {membershipOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.button,
              membershipType === opt.value && styles.buttonSelected,
            ]}
            onPress={() => setMembershipType(opt.value)}
          >
            <Text
              style={[
                styles.buttonText,
                membershipType === opt.value && styles.buttonTextSelected,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {membershipType === "Paid" && (
        <>
          <Text style={styles.label}>Price (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price..."
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </>
      )}

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Ionicons name="camera-outline" size={36} color="gray" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Post It!</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 15, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  button: {
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  buttonSelected: { backgroundColor: primaryColor },
  buttonText: { color: primaryColor },
  buttonTextSelected: { color: "#fff" },
  imagePicker: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 10 },
  submitButton: {
    backgroundColor: primaryColor,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
