import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/utils/colors";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [membershipType, setMembershipType] = useState(null); // Paid or Free
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title || !description || !category || !membershipType) {
      alert("Please fill all required fields");
      return;
    }
    if (membershipType === "Paid" && !price) {
      alert("Please enter a price for paid membership");
      return;
    }
    console.log({
      title,
      description,
      category,
      membershipType,
      price: membershipType === "Paid" ? price : "Free",
      image,
    });
    alert("Submitted successfully!");
  };

  const categories = ["Clubs & Events", "Canteen", "Campus OLX"];
  const membershipOptions = ["Free", "Paid"];

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.heading}>Create Post</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title..."
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Write something..."
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryBtn,
              category === item && styles.categorySelected,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                category === item && styles.categoryTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Membership Type</Text>
      <View style={styles.categoryContainer}>
        {membershipOptions.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.categoryBtn,
              membershipType === type && styles.categorySelected,
            ]}
            onPress={() => setMembershipType(type)}
          >
            <Text
              style={[
                styles.categoryText,
                membershipType === type && styles.categoryTextSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {membershipType === "Paid" && (
        <>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price..."
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </>
      )}

      <Text style={styles.label}>Upload Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Ionicons name="camera" size={28} color="#666" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Upload</Text>
      </TouchableOpacity>
    </View></ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    marginTop: 25,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontFamily: "Poppins-Regular",
    color: "#000",
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  categorySelected: {
    backgroundColor: colors.background,
    borderColor: colors.background,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  categoryTextSelected: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  submitBtn: {
    backgroundColor: colors.background,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    marginBottom:20,

    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});
