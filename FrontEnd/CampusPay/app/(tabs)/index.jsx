import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import axios from "axios";
import FooterComponent from "../components/Footer";
import PaymentModal from "../components/PaymentModal";
import colors from "../assets/utils/colors";
import { Header } from "./components/home/Header";
import { PayUser } from "./components/home/PayUser";
import { QuickActions } from "./components/home/QuickActions";
import { RecentGroups } from "../components/RecentGroups";
import Footer from "../components/Footer";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [splitAmount, setSplitAmount] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [groups, setGroups] = useState([]);

  const loadInitialData = useCallback(async () => {
    const username = await AsyncStorage.getItem("name");
    const userRole = await AsyncStorage.getItem("role");
    setName(username);
    setRole(userRole);

    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.get(
        `https://techrush-backend.onrender.com/api/groups/my-groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(res.data || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchedUsers([]);
      return;
    }
    setIsSearching(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.get(
        `https://techrush-backend.onrender.com/api/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { query },
        }
      );
      setSearchedUsers(res.data.users || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchedUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    setSearchQuery(user.name);
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header name={name} role={role} onReload={loadInitialData} />

      <View style={styles.mainContentArea}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 25 }}>
            <PayUser
              query={searchQuery}
              setQuery={setSearchQuery}
              users={searchedUsers}
              onSelectUser={handleSelectUser}
              isSearching={isSearching}
            />
          </View>

          <View style={{ paddingHorizontal: 25 }}>
            <QuickActions
              splitAmount={splitAmount}
              setSplitAmount={setSplitAmount}
            />
          </View>

          <RecentGroups groups={groups} />

          <View>
            <FooterComponent />
          </View>
        </ScrollView>
      </View>

      {isModalVisible && selectedUser && (
        <PaymentModal
          receiverid={selectedUser._id}
          Payto={selectedUser.name}
          data={() => setIsModalVisible(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  mainContentArea: {
    flex: 1,
    backgroundColor: "#F8F7FF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  contentContainer: { paddingVertical: 25 },
  footerComponent: {
    paddingVertical: 50,
    height: 200,
    alignItems: "center",
  },
  footerText: {
    fontFamily: "Poppins-Regular",
    color: "#999",
    fontSize: 14,
  },
});
