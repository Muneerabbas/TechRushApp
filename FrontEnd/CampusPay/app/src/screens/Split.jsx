//app/src/screens/Split.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/utils/colors"; 
import { useNavigation } from "@react-navigation/native";

export default function SplitPaymentScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userResults, setUserResults] = useState([]);

  const allUsers = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
    { id: "4", name: "Diana" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setUserResults([]);
      return;
    }
    const filteredUsers = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedUsers.some((selected) => selected.id === user.id)
    );
    setUserResults(filteredUsers);
  };

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setUserResults([]); 
    setSearchQuery(""); 
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleSplit = () => {
    if (!amount || selectedUsers.length === 0) {
      alert("Please enter an amount and select at least one person.");
      return;
    }
    navigation.navigate("ConfirmSplit", { amount, selectedUsers });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Split a Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Total Amount Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Total Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
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

        {/* Search for Users Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Split with</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#777" />
            <TextInput
              style={styles.searchInput}
              placeholder="Find a person to split with"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#aaa"
            />
          </View>
          {userResults.length > 0 && (
            <View style={styles.userResultsContainer}>
              {userResults.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={styles.userResultItem}
                  onPress={() => handleSelectUser(user)}
                >
                  <Text style={styles.userResultText}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Selected Users Preview Section */}
        {selectedUsers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Selected people</Text>
            <View style={styles.userChipContainer}>
              {selectedUsers.map((user) => (
                <View key={user.id} style={styles.userChip}>
                  <Text style={styles.userChipText}>{user.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveUser(user.id)}
                    style={styles.removeUserBtn}
                  >
                    <Ionicons name="close-circle" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Split Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.splitBtn, (!amount || selectedUsers.length === 0) && styles.splitBtnDisabled]}
          onPress={handleSplit}
          disabled={!amount || selectedUsers.length === 0}
        >
          <Text style={styles.splitText}>Calculate Split</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  backBtn: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 22,
    color: colors.white,
    fontFamily: "Poppins-Bold",
  },
  body: {
    flexGrow: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: colors.primary,
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  userResultsContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userResultText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#444",
  },
  userChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  userChipText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: "Poppins-Medium",
    marginRight: 4,
  },
  removeUserBtn: {
    marginLeft: 5,
  },
  footer: {
    backgroundColor: colors.white,
    padding: 25,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  splitBtn: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  splitBtnDisabled: {
    backgroundColor: "#a0c4ff",
  },
  splitText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginRight: 8,
  },
});