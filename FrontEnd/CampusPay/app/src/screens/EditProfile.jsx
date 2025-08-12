import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import { useRouter } from "expo-router";

import { useFonts } from "expo-font";

import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../assets/utils/colors";

import { getMyProfile, updateProfile } from "../../(tabs)/services/apiService";

const FallbackImage = ({ uri, style }) => {
  const [hasError, setHasError] = useState(!uri);

  return (
    <Image
      source={
        hasError ? require("../../assets/images/studentProfile.png") : { uri }
      }
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

export default function EditProfileScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),

    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),

    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [description, setDescription] = useState("");

  const [profilePicture, setProfilePicture] = useState(null);

  const [newImage, setNewImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isFetching, setIsFetching] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMyProfile();

        setDescription(userData.description || "");

        if (userData.profilePicture) {
          setProfilePicture(
            `https://techrush-backend.onrender.com${userData.profilePicture}`
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch profile data.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access your photo library."
      );

      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,

      aspect: [1, 1],

      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("description", description);

      if (newImage) {
        const filename = newImage.split("/").pop();

        const match = /\.(\w+)$/.exec(filename);

        const type = match ? `image/${match[1]}` : "image";

        formData.append("profilePicture", {
          uri: newImage,
          name: filename,
          type,
        });
      }

      await updateProfile(formData);

      Alert.alert("Success", "Profile updated successfully!");

      router.back();
    } catch (error) {
      console.error(
        "Update profile error:",
        error.response?.data || error.message
      );

      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <View style={{ width: 44 }} />
        </View>

        <View style={styles.profilePicSection}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            <FallbackImage
              uri={newImage || profilePicture}
              style={styles.profileImage}
            />

            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>About Me</Text>

          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Tell us something about yourself..."
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
paddingVertical:20,
    backgroundColor: "#F5F7FB",
  },

  container: {
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 15,

    paddingVertical: 10,

    backgroundColor: "#F5F7FB",
  },

  backButton: {
    padding: 5,
  },

  headerTitle: {
    fontSize: 22,

    fontFamily: "Poppins-Bold",

    color: colors.text,
  },

  profilePicSection: {
    alignItems: "center",

    marginVertical: 30,
  },

  profileImageContainer: {
    position: "relative",
  },

  profileImage: {
    height: 120,

    width: 120,

    borderRadius: 60,

    borderWidth: 3,

    borderColor: colors.primary,
  },

  editIconContainer: {
    position: "absolute",

    bottom: 0,

    right: 0,

    backgroundColor: colors.primary,

    padding: 8,

    borderRadius: 20,
  },

  formSection: {
    paddingHorizontal: 25,
  },

  label: {
    fontSize: 16,

    fontFamily: "Poppins-SemiBold",

    color: "#333",

    marginBottom: 10,
  },

  textInput: {
    backgroundColor: "#fff",

    borderRadius: 15,

    padding: 15,

    fontSize: 14,

    fontFamily: "Poppins-Regular",

    minHeight: 120,

    textAlignVertical: "top",

    borderWidth: 1,

    borderColor: "#E2E8F0",
  },

  saveButton: {
    backgroundColor: colors.primary,

    marginHorizontal: 25,

    paddingVertical: 15,

    borderRadius: 15,

    alignItems: "center",

    marginTop: 40,
  },

  saveButtonText: {
    color: "white",

    fontSize: 16,

    fontFamily: "Poppins-Bold",
  },
});
