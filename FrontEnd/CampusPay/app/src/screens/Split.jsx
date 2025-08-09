// app/src/screens/Split.jsx
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../../assets/utils/colors";

// A function to fetch users from a real API endpoint.
// You'll need to replace the URL and method with your actual backend details.
const searchUsersFromAPI = async (query) => {
  if (!query.trim()) {
    return [];
  }

  // Replace this URL with your actual backend API endpoint for searching users.
  // The 'query' parameter is what you'll pass to your backend.
  const apiUrl = `https://techrush-backend.onrender.com/api/search/?query=${query}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET", // Or "POST" if your API requires it.
      headers: {
        // Add any necessary headers, like an Authorization token.
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    // The API should return an array of user objects.
    const users = await response.json();
    return users;

  } catch (error) {
    console.error("Failed to fetch users from API:", error);
    // You might want to throw the error to be handled by the calling function.
    throw error;
  }
};

export default function SplitPaymentScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debouncing search requests with useEffect.
  useEffect(() => {
    // Set a timer to wait for the user to stop typing.
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() === "") {
        setUserResults([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchUsersFromAPI(searchQuery);
        // Filter out users who are already selected before displaying them.
        const currentlySelectedIds = new Set(selectedUsers.map(user => user.id));
        const newResults = results.filter(user => !currentlySelectedIds.has(user.id));
        setUserResults(newResults);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        Alert.alert("Error", "Failed to fetch users. Please try again.");
        setUserResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce delay of 300ms.

    // Cleanup function to clear the timeout if the user types again.
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedUsers]); // Rerun the effect when the search query or selected users change.

  const handleSelectUser = (user) => {
    // Check if the user is not already selected to prevent duplicates.
    const isAlreadySelected = selectedUsers.some(selected => selected.id === user.id);
    if (!isAlreadySelected) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setUserResults([]); // Clear search results after selection.
    setSearchQuery(""); // Clear search query after selection.
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleSplit = () => {
    if (!amount || selectedUsers.length === 0) {
      Alert.alert(
        "Missing Information",
        "Please enter an amount and select at least one person to split with."
      );
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
              onChangeText={setSearchQuery}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* User search results or loading indicator */}
          <View style={styles.userResultsWrapper}>
            {loading ? (
              <ActivityIndicator style={styles.loadingIndicator} size="small" color={colors.primary} />
            ) : userResults.length > 0 ? (
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
            ) : (
              searchQuery.length > 0 && (
                <Text style={styles.noResultsText}>No users found</Text>
              )
            )}
          </View>
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
  userResultsWrapper: {
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  noResultsText: {
    marginTop: 10,
    textAlign: "center",
    color: "#777",
    fontFamily: "Poppins-Regular",
  },
  userResultsContainer: {
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
