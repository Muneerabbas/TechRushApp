import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';

import colors from "../../assets/utils/colors";
import {
  createClub,
  createEvent,
  shareActivity,
} from "../../(tabs)/services/apiService";

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
  const [userRole, setUserRole] = useState(null);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [membershipType, setMembershipType] = useState("Free");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await AsyncStorage.getItem("role");
      setUserRole(role);
      if (role !== "Admin") {
        setCategory("Social");
      }
    };
    fetchUserRole();
  }, []);

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

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventDate;
    setShowPicker(Platform.OS === 'ios');
    setEventDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const handleSubmit = async () => {
    if (
      !category ||
      (category !== "Social" && !title.trim()) ||
      !description.trim()
    ) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }
    if (category === "Events" && (!capacity.trim() || !location.trim())) {
      Alert.alert("Error", "Please enter the event capacity and location.");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    if (image) {
      const filename = image.uri.split("/").pop();
      const type = `image/${filename.split(".").pop()}`;
      const imageKey = category === "Social" ? "image" : "coverImage";
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
        formData.append("location", location);
        formData.append("visibility", "Public");
        formData.append("capacity", capacity);
        formData.append("date", eventDate.toISOString());
        await createEvent(formData);
      } else if (category === "Social") {
        formData.append("content", description);
        await shareActivity(formData);
      }
      router.back();
    } catch (error) {
       Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderAdminOptions = () => (
    <>
      <Text style={styles.label}>What are you creating?*</Text>
      <View style={styles.row}>
        {["Clubs", "Events", "Social"].map((item) => (
          <SelectionButton
            key={item}
            label={item}
            isSelected={category === item}
            onPress={() => setCategory(item)}
          />
        ))}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.heading}>
            {userRole === "Admin" ? "Create New Post" : "Share an Update"}
          </Text>
        </View>

        {userRole === "Admin" ? renderAdminOptions() : null}

        {category && (
          <View style={styles.formContainer}>
            {category !== "Social" && (
              <>
                <Text style={styles.label}>
                  {category === "Clubs" ? "Club Name*" : "Title*"}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a catchy title..."
                  value={title}
                  onChangeText={setTitle}
                />
              </>
            )}

            <Text style={styles.label}>
              {category === "Social" ? "What's on your mind?*" : "Description*"}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your post..."
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {category !== "Social" && (
              <>
                <Text style={styles.label}>Type*</Text>
                <View style={styles.row}>
                  {["Free", "Paid"].map((item) => (
                    <SelectionButton
                      key={item}
                      label={item}
                      isSelected={membershipType === item}
                      onPress={() => setMembershipType(item)}
                    />
                  ))}
                </View>

                {membershipType === "Paid" && (
                  <>
                    <Text style={styles.label}>Price (₹)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 100"
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="numeric"
                    />
                  </>
                )}
              </>
            )}

            {category === "Events" && (
              <>
                <Text style={styles.label}>Location*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., College Auditorium"
                  value={location}
                  onChangeText={setLocation}
                />

                <Text style={styles.label}>Capacity*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 100"
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Date & Time*</Text>
                <View style={styles.dateRow}>
                    <TouchableOpacity onPress={showDatepicker} style={[styles.input, styles.dateInput]}>
                        <Ionicons name="calendar-outline" size={20} color="#555" style={{marginRight: 10}}/>
                        <Text style={styles.dateText}>{eventDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showTimepicker} style={[styles.input, styles.dateInput]}>
                        <Ionicons name="time-outline" size={20} color="#555" style={{marginRight: 10}}/>
                        <Text style={styles.dateText}>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                </View>

                {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={eventDate}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onDateChange}
                    />
                )}
              </>
            )}

            <Text style={styles.label}>Cover Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={36} color="#888" />
                  <Text style={styles.imagePlaceholderText}>Upload Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Post It!</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F7FF", paddingVertical:30, },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor:"#F8F7FF"
  },
  backButton: {
    padding: 5,
  },
  heading: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#2c3e50",
    marginLeft: 15,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#34495e",
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "#e0e6ed",
    flexDirection: 'row',
    alignItems: 'center',
  },
  textArea: { height: 120, textAlignVertical: "top" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateInput: {
    flex: 1,
  },
  dateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
  },
  button: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  buttonSelected: { backgroundColor: colors.primary },
  buttonText: { color: colors.primary, fontFamily: "Poppins-SemiBold" },
  buttonTextSelected: { color: "#fff" },
  imagePicker: {
    width: "100%",
    height: 180,
    borderWidth: 2,
    borderColor: "#e0e6ed",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  imagePlaceholder: { alignItems: "center" },
  imagePlaceholderText: {
    fontFamily: "Poppins-SemiBold",
    color: "#888",
    marginTop: 8,
  },
  imagePreview: { width: "100%", height: "100%" },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 30,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  submitButtonText: { color: "#fff", fontSize: 18, fontFamily: "Poppins-Bold" },
});