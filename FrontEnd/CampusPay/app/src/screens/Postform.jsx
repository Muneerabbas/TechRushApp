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
  SafeAreaView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import colors from "../../assets/utils/colors";
import { createClub, createEvent, shareActivity } from "../../(tabs)/services/apiService";

// Reusable Button Component
const SelectionButton = ({ label, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.button, isSelected && styles.buttonSelected]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function PostForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [membershipType, setMembershipType] = useState("Free");
  const [price, setPrice] = useState("");

  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!category || !title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in title, description, and category.");
      return;
    }
    if (category === "Events" && !capacity.trim()) {
        Alert.alert("Error", "Please enter the event capacity.");
        return;
    }
    setIsLoading(true);
  
    const formData = new FormData();
    if (image) {
      const filename = image.uri.split('/').pop();
      const type = `image/${filename.split('.').pop()}`;
      const imageKey = category === 'Social' ? 'image' : 'coverImage';
      formData.append(imageKey, { uri: image.uri, name: filename, type });
    }
  
    try {
      if (category === "Clubs") {
        formData.append("name", title);
        formData.append("description", description);
        formData.append("eventType", membershipType);
        if (membershipType === "Paid") formData.append("ticketPrice", price);
        await createClub(formData);
      } else if (category === "Events") {
        formData.append("title", title);
        formData.append("description", description);
        formData.append("eventType", membershipType);
        if (membershipType === "Paid") formData.append("ticketPrice", price);
        formData.append("location", location || "Campus");
        formData.append("visibility", "Public");
        formData.append("capacity", capacity);
        await createEvent(formData);
      } else if (category === "Social") {
        formData.append("content", description);
        await shareActivity(formData);
      }
      
      router.back();

    } catch (error) {
      // The apiService file already shows an alert.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.heading}>Create New Post</Text>
        </View>

        <Text style={styles.label}>What are you creating?*</Text>
        <View style={styles.row}>
          {["Clubs", "Events", "Social"].map(item => (
            <SelectionButton key={item} label={item} isSelected={category === item} onPress={() => setCategory(item)} />
          ))}
        </View>

        {category && (
          <>
            <Text style={styles.label}>{category === 'Clubs' ? 'Club Name*' : 'Title*'}</Text>
            <TextInput style={styles.input} placeholder="Enter a catchy title..." value={title} onChangeText={setTitle} />

            <Text style={styles.label}>{category === 'Social' ? 'Content*' : 'Description*'}</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Describe your post..." value={description} onChangeText={setDescription} multiline />

            {category !== 'Social' && (
              <>
                <Text style={styles.label}>Type*</Text>
                <View style={styles.row}>
                  {["Free", "Paid"].map(item => (
                    <SelectionButton key={item} label={item} isSelected={membershipType === item} onPress={() => setMembershipType(item)} />
                  ))}
                </View>

                {membershipType === "Paid" && (
                  <>
                    <Text style={styles.label}>Price (₹)</Text>
                    <TextInput style={styles.input} placeholder="e.g., 100" value={price} onChangeText={setPrice} keyboardType="numeric" />
                  </>
                )}
              </>
            )}

            {category === 'Events' && (
              <>
                <Text style={styles.label}>Location*</Text>
                <TextInput style={styles.input} placeholder="e.g., College Auditorium" value={location} onChangeText={setLocation} />
                
                <Text style={styles.label}>Capacity*</Text>
                <TextInput style={styles.input} placeholder="e.g., 100" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
              </>
            )}

            <Text style={styles.label}>Cover Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={36} color="#888" />
                  <Text style={styles.imagePlaceholderText}>Upload</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Post It!</Text>}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  heading: { fontSize: 24, fontFamily: "Poppins-Bold", color: '#333', marginLeft: 15 },
  label: { fontSize: 16, fontFamily: "Poppins-SemiBold", color: '#555', marginTop: 20, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff",
    borderRadius: 12, padding: 12, fontSize: 15, fontFamily: "Poppins-Regular",
  },
  textArea: { height: 120, textAlignVertical: "top" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  button: {
    borderWidth: 1, borderColor: colors.primary, borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 16, backgroundColor: "#fff",
  },
  buttonSelected: { backgroundColor: colors.primary },
  buttonText: { color: colors.primary, fontFamily: 'Poppins-SemiBold' },
  buttonTextSelected: { color: "#fff" },
  imagePicker: {
    width: '100%', height: 180, borderWidth: 2, borderColor: "#ddd",
    borderStyle: 'dashed', borderRadius: 12, justifyContent: "center",
    alignItems: "center", marginTop: 8, backgroundColor: "#fff", overflow: 'hidden',
  },
  imagePlaceholder: { alignItems: 'center' },
  imagePlaceholderText: { fontFamily: 'Poppins-SemiBold', color: '#888', marginTop: 8 },
  imagePreview: { width: "100%", height: "100%" },
  datePickerButton: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 12, padding: 12,
  },
  datePickerText: { fontFamily: 'Poppins-Regular', fontSize: 15, color: '#333' },
  submitButton: {
    backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 12,
    marginTop: 40, alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontSize: 18, fontFamily: "Poppins-Bold" },
});
