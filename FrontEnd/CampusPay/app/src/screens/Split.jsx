import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../assets/utils/colors";
import { searchUsers, createGroup, splitBill } from "../../(tabs)/services/apiService";

const API_URL = 'https://techrush-backend.onrender.com';

export default function SplitPaymentScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() === "") {
        setUserResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        const currentlySelectedIds = new Set(selectedUsers.map(user => user._id));
        const newResults = results.filter(user => !currentlySelectedIds.has(user._id));
        setUserResults(newResults);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch users.");
        setUserResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedUsers]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setUserResults([]);
    setSearchQuery("");
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  const handleSplit = async () => {
    if (!amount || !description.trim() || selectedUsers.length === 0) {
      Alert.alert("Missing Information", "Please enter an amount, description, and select at least one person.");
      return;
    }
    setIsSubmitting(true);
    try {
      const participantIds = selectedUsers.map(u => u._id);
      const groupName = `Split: ${description}`;
      
      const groupResponse = await createGroup(groupName, participantIds, `Bill split for ${description}`);
      const groupId = groupResponse.group._id;
      
      await splitBill(groupId, parseFloat(amount), description);
      
      Alert.alert("Success", "The bill has been split successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to split the bill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUserResult = ({ item }) => (
    <TouchableOpacity style={styles.userResultItem} onPress={() => handleSelectUser(item)}>
        {item.profilePicture ? (
            <Image source={{ uri: `${API_URL}${item.profilePicture}` }} style={styles.avatar} />
        ) : (
            <View style={styles.avatarPlaceholder}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
        )}
        <Text style={styles.userResultText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={26} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Split a Payment</Text>
            </View>

            <ScrollView contentContainerStyle={styles.body}>
                <View style={styles.section}>
                    <Text style={styles.label}>Total Amount</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            value={amount}
                            onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ""))}
                            keyboardType="numeric"
                            placeholderTextColor="#aaa"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>What is this for?</Text>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="e.g., Dinner, Movie Tickets"
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor="#aaa"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Split with</Text>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#777" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Find people to split with"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    {isSearching ? (
                        <ActivityIndicator style={{ marginTop: 20 }} size="small" color={colors.primary} />
                    ) : (
                        <FlatList
                            data={userResults}
                            renderItem={renderUserResult}
                            keyExtractor={(item) => item._id}
                            style={styles.userResultsContainer}
                            scrollEnabled={false}
                        />
                    )}
                </View>

                {selectedUsers.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Selected people ({selectedUsers.length})</Text>
                        <View style={styles.userChipContainer}>
                        {selectedUsers.map((user) => (
                            <View key={user._id} style={styles.userChip}>
                            <Text style={styles.userChipText}>{user.name}</Text>
                            <TouchableOpacity onPress={() => handleRemoveUser(user._id)} style={styles.removeUserBtn}>
                                <Ionicons name="close-circle" size={20} color={colors.primary} />
                            </TouchableOpacity>
                            </View>
                        ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.splitBtn, (!amount || selectedUsers.length === 0 || isSubmitting) && styles.splitBtnDisabled]}
                    onPress={handleSplit}
                    disabled={!amount || selectedUsers.length === 0 || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <>
                            <Text style={styles.splitText}>Split Bill</Text>
                            <Ionicons name="arrow-forward" size={20} color={colors.white} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 15,
    paddingTop: 50, paddingBottom: 20,
  },
  backBtn: { marginRight: 15, padding: 5 },
  headerText: { fontSize: 22, color: colors.white, fontFamily: "Poppins-Bold" },
  body: {
    flexGrow: 1, backgroundColor: '#F4F6F9', borderTopLeftRadius: 30,
    borderTopRightRadius: 30, padding: 25,
  },
  section: { marginBottom: 25 },
  label: {
    fontSize: 16, color: "#555", fontFamily: "Poppins-SemiBold", marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.white,
    borderRadius: 12, paddingHorizontal: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05,
  },
  currencySymbol: { fontSize: 24, fontFamily: "Poppins-Bold", color: colors.primary, marginRight: 5 },
  amountInput: {
    flex: 1, fontSize: 24, fontFamily: "Poppins-Bold",
    color: colors.primary, paddingVertical: 15,
  },
  descriptionInput: {
    backgroundColor: colors.white, borderRadius: 12, paddingHorizontal: 15,
    paddingVertical: 15, fontFamily: "Poppins-Regular", fontSize: 16, elevation: 2,
  },
  searchContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.white,
    borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: "Poppins-Regular", fontSize: 16 },
  userResultsContainer: {
    marginTop: 10, backgroundColor: "#fff", borderRadius: 12,
    maxHeight: 180,
  },
  userResultItem: {
    flexDirection: 'row', alignItems: 'center', padding: 15,
    borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20, marginRight: 15,
    backgroundColor: '#E9EAF0', justifyContent: 'center', alignItems: 'center',
  },
  userResultText: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#444" },
  userChipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  userChip: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#e6f0ff",
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
  },
  userChipText: {
    fontSize: 14, color: colors.primary,
    fontFamily: "Poppins-SemiBold", marginRight: 4,
  },
  removeUserBtn: { marginLeft: 5 },
  footer: {
    backgroundColor: colors.white, padding: 25, borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  splitBtn: {
    flexDirection: "row", backgroundColor: colors.primary, paddingVertical: 15,
    borderRadius: 12, justifyContent: "center", alignItems: "center",
  },
  splitBtnDisabled: { backgroundColor: "#a0c4ff" },
  splitText: {
    color: colors.white, fontSize: 16,
    fontFamily: "Poppins-SemiBold", marginRight: 8,
  },
});
